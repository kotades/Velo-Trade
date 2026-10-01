import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc,
  increment, 
  serverTimestamp, 
  Timestamp,
  runTransaction,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { useMarketData } from '../hooks/useMarketData';
import { Result, Ok, Err } from '../lib/result';
import { generateUUID } from '../lib/uuid';
import { Trade } from '../types/trade';

interface TradeContextType {
  trades: Trade[];
  loading: boolean;
  placeTrade: (tradeData: Omit<Trade, 'id' | 'userId' | 'status' | 'timestamp' | 'expiryTime'>) => Promise<Result<string, string>>;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userData, applyOptimisticBalance } = useAuth();
  const [serverTrades, setServerTrades] = useState<Trade[]>([]);
  const [optimisticTrades, setOptimisticTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  // Combined and deduplicated trades
  const trades = useMemo(() => {
    const combined = [...optimisticTrades, ...serverTrades];
    return combined.filter((trade, index, self) => 
      index === self.findIndex((t) => (
        t.id === trade.id || 
        (t.symbol === trade.symbol && Math.abs(t.expiryTime - trade.expiryTime) < 2000)
      ))
    ).sort((a, b) => {
      const timeA = (a.timestamp as any)?.toMillis?.() || (typeof a.timestamp === 'number' ? a.timestamp : 0);
      const timeB = (b.timestamp as any)?.toMillis?.() || (typeof b.timestamp === 'number' ? b.timestamp : 0);
      return timeB - timeA;
    });
  }, [serverTrades, optimisticTrades]);

  // Subscribe to trades
  useEffect(() => {
    if (!user) {
      setServerTrades([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'trades'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const tradesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Trade[];
        
        console.log(`[TradeContext] Received ${tradesData.length} trades from server`);
        setServerTrades(tradesData);
        if (tradesData.length > 0) {
          // Clear optimistic trades that have been confirmed by server
          setOptimisticTrades(prev => prev.filter(ot => 
            !tradesData.some(st => st.id === ot.id || (st.symbol === ot.symbol && Math.abs(st.expiryTime - ot.expiryTime) < 3000))
          ));
        }
        setLoading(false);
      },
      (error) => {
        console.error("Trade Subscription Error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const { ticker: btcTicker } = useMarketData('BTCUSDT');

  // Centralized Expiration Monitor
  useEffect(() => {
    if (!user || trades.length === 0) return;

    const interval = setInterval(async () => {
      const now = Date.now();
      const openTrades = trades.filter(t => t.status === 'open');

      if (openTrades.length > 0) {
        console.log(`[TradeContext] Expiration monitor: checking ${openTrades.length} open trades`);
      }

      for (const trade of openTrades) {
        if (now >= trade.expiryTime) {
          // Determine result
          const currentPrice = (trade.symbol === 'BTCUSDT') ? btcTicker.currentPrice : (trade.entryPrice * (1 + (Math.random() * 0.002 - 0.001)));
          
          let result: 'win' | 'loss' | 'draw' = 'draw';
          if (trade.type === 'buy') {
            result = currentPrice > trade.entryPrice ? 'win' : (currentPrice < trade.entryPrice ? 'loss' : 'draw');
          } else {
            result = currentPrice < trade.entryPrice ? 'win' : (currentPrice > trade.entryPrice ? 'loss' : 'draw');
          }

          const payoutRatio = 0.85;
          const payout = result === 'win' ? (trade.amount * (1 + payoutRatio)) : (result === 'draw' ? trade.amount : 0);
          const profit = payout - trade.amount;

          try {
            console.log(`[TradeContext] Attempting to close trade ${trade.id} as ${result} (Price: ${currentPrice})`);
            await runTransaction(db, async (transaction) => {
              const tradeRef = doc(db, 'trades', trade.id);
              const userRef = doc(db, 'users', user.uid);
              
              const tradeSnap = await transaction.get(tradeRef);
              if (!tradeSnap.exists() || tradeSnap.data().status === 'closed') return;

              // 1. Close trade
              transaction.update(tradeRef, {
                status: 'closed',
                result,
                payout,
                exitPrice: currentPrice
              });

              // 2. Update user balance
              const balanceField = trade.accountType === 'demo' ? 'demoBalance' : 'realBalance';
              transaction.update(userRef, {
                [balanceField]: increment(payout),
                trades: increment(1),
                profit: increment(profit > 0 ? profit : 0)
              });
            });
          } catch (e) {
            console.error(`Failed to close trade ${trade.id}:`, e);
          }
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [trades, user, btcTicker.currentPrice]);

  const placeTrade = async (tradeData: Omit<Trade, 'id' | 'userId' | 'status' | 'timestamp' | 'expiryTime'>): Promise<Result<string, string>> => {
    if (!user) return Err("Authentication required");

    const durationStr = tradeData.duration || '00:01:00';
    const [h, m, s] = durationStr.split(':').map(Number);
    const durationMs = (h * 3600 + m * 60 + s) * 1000;
    const expiryTime = Date.now() + durationMs;

    const tradeId = `trade_${generateUUID()}`;
    const tempId = `optimistic-${Date.now()}`;
    
    // Optimistic Update
    const newOptimisticTrade: Trade = {
      ...tradeData,
      id: tradeId,
      userId: user.uid,
      status: 'open',
      timestamp: Timestamp.now(),
      expiryTime,
    };

    console.log(`[TradeContext] Placing trade optimistically: ${tradeId}`);
    setOptimisticTrades(prev => [newOptimisticTrade, ...prev]);
    applyOptimisticBalance(-tradeData.amount, tradeData.accountType);

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await transaction.get(userRef);
        
        if (!userSnap.exists()) throw new Error("User profile not found");

        const currentBalance = userSnap.data()[tradeData.accountType === 'demo' ? 'demoBalance' : 'realBalance'] || 0;
        if (currentBalance < tradeData.amount) throw new Error("Insufficient balance");

        const tradeRef = doc(db, 'trades', tradeId);
        
        // 1. Deduct balance
        transaction.update(userRef, {
          [tradeData.accountType === 'demo' ? 'demoBalance' : 'realBalance']: increment(-tradeData.amount)
        });

        // 2. Create trade document
        transaction.set(tradeRef, {
          ...tradeData,
          userId: user.uid,
          status: 'open',
          timestamp: serverTimestamp(),
          expiryTime,
          id: tradeId // Store ID inside doc too for easier mapping
        });
      });

      console.log(`[TradeContext] Trade placed successfully on server: ${tradeId}`);
      return Ok(tradeId);
    } catch (error: any) {
      console.error("Trade execution failed:", error);
      
      // Rollback optimistic update
      setOptimisticTrades(prev => prev.filter(t => t.id !== tradeId));
      applyOptimisticBalance(tradeData.amount, tradeData.accountType);
      
      return Err(error.message || "Failed to place trade");
    }
  };

  return (
    <TradeContext.Provider value={{ trades, loading, placeTrade }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTradesContext = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTradesContext must be used within a TradeProvider');
  }
  return context;
};
