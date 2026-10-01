import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc,
  setDoc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  increment,
  serverTimestamp,
  where,
  limit,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useMarketData } from './useMarketData';

export interface MasterTrader {
  id: string;
  name: string;
  avatar: string;
  roi: number;
  winRate: number;
  followers: number;
  totalTrades: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  bio: string;
  strategy: {
    frequency: number; // avg trades per day
    preferredPairs: string[];
    avgDuration: string;
  };
  lastTradeAt?: any;
  status?: 'active' | 'inactive';
}

export interface MasterTrade {
  id: string;
  traderId: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice: number;
  profit: number;
  timestamp: any;
  status: 'closed';
}

export interface UserCopy {
  id: string;
  userId: string;
  traderId: string;
  multiplier: number; // percentage of current balance (e.g. 0.1 for 10%)
  createdAt: any;
}

export function useGhostTraders() {
  const { user } = useAuth();
  const [traders, setTraders] = useState<MasterTrader[]>([]);
  const [userCopies, setUserCopies] = useState<UserCopy[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all master traders
  useEffect(() => {
    const q = query(collection(db, 'masterTraders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tradersData: MasterTrader[] = [];
      snapshot.forEach((doc) => {
        tradersData.push({ id: doc.id, ...doc.data() } as MasterTrader);
      });
      setTraders(tradersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user's current copies
  useEffect(() => {
    if (!user) {
      setUserCopies([]);
      return;
    }

    const q = query(collection(db, 'userCopies'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const copiesData: UserCopy[] = [];
      snapshot.forEach((doc) => {
        copiesData.push({ id: doc.id, ...doc.data() } as UserCopy);
      });
      setUserCopies(copiesData);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleCopy = async (traderId: string, multiplier: number = 0.1) => {
    if (!user) return;

    const existingCopy = userCopies.find(c => c.traderId === traderId);
    if (existingCopy) {
      // Unfollow/Stop Copying
      const copyRef = doc(db, 'userCopies', existingCopy.id);
      await deleteDoc(copyRef);
    } else {
      // Start Copying
      await addDoc(collection(db, 'userCopies'), {
        userId: user.uid,
        traderId,
        multiplier,
        createdAt: serverTimestamp()
      });
    }
  };

  return { traders, userCopies, toggleCopy, loading };
}

/**
 * triggerManualTrade
 * Used by Admin to force a trade for a specific master trader.
 */
export const triggerManualTrade = async (trader: MasterTrader, ticker: any) => {
  // 1. Pick a random pair from trader's preferred pairs
  const pair = trader.strategy.preferredPairs[Math.floor(Math.random() * trader.strategy.preferredPairs.length)];
  
  // Simplified price fetch
  const entryPrice = pair.includes('BTC') ? ticker.currentPrice : (pair.includes('ETH') ? 3500 : 1.08);
  if (entryPrice === 0) return;

  const isWin = Math.random() * 100 <= trader.winRate;
  const type = Math.random() > 0.5 ? 'buy' : 'sell';
  
  const profitPercent = (Math.random() * 14 + 1) / 100;
  const exitPrice = type === 'buy' 
    ? (isWin ? entryPrice * (1 + profitPercent) : entryPrice * (1 - profitPercent))
    : (isWin ? entryPrice * (1 - profitPercent) : entryPrice * (1 + profitPercent));
  
  const profitAmount = isWin ? 100 * profitPercent : -100 * profitPercent;

  const masterTradeData: Omit<MasterTrade, 'id'> = {
    traderId: trader.id,
    symbol: pair,
    type: type as 'buy' | 'sell',
    entryPrice,
    exitPrice,
    profit: profitAmount,
    timestamp: serverTimestamp(),
    status: 'closed'
  };

  // Record Master Trade
  await addDoc(collection(db, `masterTraders/${trader.id}/trades`), masterTradeData);
  
  // Update trader's last trade time
  await updateDoc(doc(db, 'masterTraders', trader.id), {
    lastTradeAt: serverTimestamp()
  });
};

/**
 * useGhostEngine
 * Background hook that triggers deterministic master trades AND listens for manual master trades.
 */
export function useGhostEngine() {
  const { user } = useAuth();
  const { traders, userCopies } = useGhostTraders();
  const { ticker: btcTicker } = useMarketData('BTCUSDT');
  const [processedTradeIds] = useState(new Set<string>());

  // 1. Real-time listener for Master Trades
  useEffect(() => {
    if (!user || userCopies.length === 0) return;

    const unsubscribes: (() => void)[] = [];

    userCopies.forEach(copy => {
      // Listen for the LATEST trade in this trader's sub-collection
      const tradeQuery = query(
        collection(db, `masterTraders/${copy.traderId}/trades`),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const unsub = onSnapshot(tradeQuery, async (snapshot) => {
        if (snapshot.empty) return;
        
        const tradeDoc = snapshot.docs[0];
        const trade = { id: tradeDoc.id, ...tradeDoc.data() } as MasterTrade;

        // Skip if we already mirrored this or if it's too old (e.g. > 5 mins)
        // Note: For a live simulation, we check the ID set.
        if (processedTradeIds.has(trade.id)) return;
        
        // Add to processed set
        processedTradeIds.add(trade.id);

        // Mirror trade to user's trades collection
        await mirrorTrade(trade, copy);
      });

      unsubscribes.push(unsub);
    });

    return () => unsubscribes.forEach(u => u());
  }, [user, userCopies, processedTradeIds]);

  // 2. Deterministic periodic generation (Optional - Admin can trigger everything now)
  useEffect(() => {
    if (!user || traders.length === 0) return;

    const interval = setInterval(async () => {
      const now = Date.now();
      const currentMinute = Math.floor(now / 60000);

      for (const trader of traders) {
        const idHash = trader.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const dailyMinutes = 1440;
        const tradeInterval = Math.max(1, Math.floor(dailyMinutes / trader.strategy.frequency));
        
        const shouldTrade = (currentMinute + idHash) % tradeInterval === 0;

        // On deterministic match, the client PUSHES to masterTraders, 
        // which then triggers the listener above for EVERYONE.
        if (shouldTrade) {
          // Use a fixed ID for the deterministic trade to prevent duplicates across multiple clients
          const tradeId = `${trader.id}_${currentMinute}`;
          const tradeRef = doc(db, `masterTraders/${trader.id}/trades`, tradeId);
          
          // Check if it exists first or just use setDoc (which overwrites - okay since it's same data)
          // But wait, if multiple users do this, we want to be clean.
          // For now, let's let the Admin be the one who triggers MOST trades.
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user, traders]);

  const mirrorTrade = async (masterTrade: MasterTrade, copy: UserCopy) => {
    if (!user) return;

    // Determine result based on master trade's profit
    const isWin = masterTrade.profit > 0;
    
    await addDoc(collection(db, 'trades'), {
      userId: user.uid,
      symbol: masterTrade.symbol,
      type: masterTrade.type,
      entryPrice: masterTrade.entryPrice,
      amount: 100 * copy.multiplier * 10, // Example scale
      duration: '00:01:00', // Simplified
      status: 'closed',
      result: isWin ? 'win' : 'loss',
      payout: isWin ? (100 * copy.multiplier * 18) : 0,
      timestamp: serverTimestamp(),
      expiryTime: Date.now() + 60000,
      accountType: 'demo',
      copiedFrom: masterTrade.traderId,
      masterTradeId: masterTrade.id
    });

    // Update User Balance
    const userRef = doc(db, 'users', user.uid);
    const profit = isWin ? 80 : -100;
    await updateDoc(userRef, {
      demoBalance: increment(profit)
    });
  };
}
