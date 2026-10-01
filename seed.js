import admin from 'firebase-admin';

admin.initializeApp({
  projectId: "velo-d3b31-test"
});

const db = admin.firestore();

const GHOST_TRADERS = [
  { 
    name: 'CryptoKing', 
    avatar: '👑', 
    roi: 342.5, 
    winRate: 78, 
    followers: 12450, 
    totalTrades: 2841, 
    riskLevel: 'Medium', 
    bio: 'Full-time crypto trader. BTC/ETH specialist.',
    strategy: {
      frequency: 24,
      preferredPairs: ['BTC / USDT', 'ETH / USDT'],
      avgDuration: '00:05:00'
    }
  },
  { 
    name: 'AlphaWolf', 
    avatar: '🐺', 
    roi: 218.3, 
    winRate: 82, 
    followers: 8920, 
    totalTrades: 1567, 
    riskLevel: 'Low', 
    bio: 'Conservative strategies, consistent returns.',
    strategy: {
      frequency: 8,
      preferredPairs: ['EUR / USD', 'GBP / USD', 'BTC / USDT'],
      avgDuration: '00:15:00'
    }
  },
  { 
    name: 'MoonShot', 
    avatar: '🚀', 
    roi: 567.1, 
    winRate: 65, 
    followers: 23100, 
    totalTrades: 4210, 
    riskLevel: 'High', 
    bio: 'High-risk, high-reward. Alt-coin focused.',
    strategy: {
      frequency: 48,
      preferredPairs: ['SOL / USDT', 'DOGE / USDT', 'AVAX / USDT'],
      avgDuration: '00:01:00'
    }
  },
  { 
    name: 'SteadyEdge', 
    avatar: '🎯', 
    roi: 156.8, 
    winRate: 88, 
    followers: 5670, 
    totalTrades: 980, 
    riskLevel: 'Low', 
    bio: 'Algorithmic trading. Data-driven decisions.', 
    strategy: { 
      frequency: 12, 
      preferredPairs: ['EUR / USD', 'BTC / USDT'], 
      avgDuration: '00:10:00' 
    } 
  },
  { 
    name: 'NightOwl', 
    avatar: '🦉', 
    roi: 289.4, 
    winRate: 74, 
    followers: 7340, 
    totalTrades: 3120, 
    riskLevel: 'Medium', 
    bio: 'Asian session specialist. 24/7 coverage.', 
    strategy: { 
      frequency: 15, 
      preferredPairs: ['USD / JPY', 'ETH / USDT'], 
      avgDuration: '00:03:00' 
    } 
  },
  { 
    name: 'DiamondHands', 
    avatar: '💎', 
    roi: 412.7, 
    winRate: 71, 
    followers: 15800, 
    totalTrades: 1890, 
    riskLevel: 'High', 
    bio: 'Long-term positions. Never panic sell.', 
    strategy: { 
      frequency: 4, 
      preferredPairs: ['BTC / USDT', 'ETH / USDT'], 
      avgDuration: '01:00:00' 
    } 
  },
  { 
    name: 'ScalpMaster', 
    avatar: '⚡', 
    roi: 198.2, 
    winRate: 85, 
    followers: 4210, 
    totalTrades: 8940, 
    riskLevel: 'Medium', 
    bio: 'Quick in, quick out. 100+ trades/day.', 
    strategy: { 
      frequency: 120, 
      preferredPairs: ['BTC / USDT', 'SOL / USDT'], 
      avgDuration: '00:00:30' 
    } 
  },
  { 
    name: 'WhaleWatch', 
    avatar: '🐋', 
    roi: 445.9, 
    winRate: 69, 
    followers: 19500, 
    totalTrades: 560, 
    riskLevel: 'High', 
    bio: 'Following institutional money flows.', 
    strategy: { 
      frequency: 6, 
      preferredPairs: ['BTC / USDT', 'ETH / USDT'], 
      avgDuration: '00:30:00' 
    } 
  },
  { 
    name: 'TechAnalyst', 
    avatar: '📐', 
    roi: 178.6, 
    winRate: 80, 
    followers: 6780, 
    totalTrades: 2340, 
    riskLevel: 'Low', 
    bio: 'Pure technical analysis. No emotions.', 
    strategy: { 
      frequency: 10, 
      preferredPairs: ['GBP / USD', 'EUR / USD'], 
      avgDuration: '00:20:00' 
    } 
  },
  { 
    name: 'GreenCandle', 
    avatar: '🟢', 
    roi: 324.3, 
    winRate: 76, 
    followers: 11200, 
    totalTrades: 3670, 
    riskLevel: 'Medium', 
    bio: 'Trend follower. Momentum trader.', 
    strategy: { 
      frequency: 20, 
      preferredPairs: ['ETH / USDT', 'SOL / USDT'], 
      avgDuration: '00:05:00' 
    } 
  }
];

async function seed() {
  console.log("Seeding ghost traders using firebase-admin...");
  const tradersCol = db.collection('masterTraders');
  const snapshot = await tradersCol.get();
  
  if (!snapshot.empty) {
    console.log(`Clearing ${snapshot.size} existing traders...`);
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  const batch = db.batch();
  for (const trader of GHOST_TRADERS) {
    const docRef = tradersCol.doc();
    batch.set(docRef, trader);
    console.log(`Queueing ${trader.name} write...`);
  }
  await batch.commit();
  console.log("Seeding complete.");
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}).then(() => process.exit(0));
