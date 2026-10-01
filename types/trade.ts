export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  entryPrice: number;
  duration: string;
  status: 'open' | 'closed';
  timestamp: any;
  expiryTime: number;
  accountType: 'demo' | 'real';
  result?: 'win' | 'loss' | 'draw';
  payout?: number;
  exitPrice?: number;
  idempotencyKey?: string;
}

export type TradeResult = 'win' | 'loss' | 'draw';
