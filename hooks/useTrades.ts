import { useTradesContext } from '../context/TradeContext';
export type { Trade } from '../types/trade';

export const useTrades = () => {
  return useTradesContext();
};
