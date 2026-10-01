import { useMemo } from 'react';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const useIndicators = (candles: Candle[]) => {
  const ma7 = useMemo(() => calculateSMA(candles, 7), [candles]);
  const ma25 = useMemo(() => calculateSMA(candles, 25), [candles]);
  const ma99 = useMemo(() => calculateSMA(candles, 99), [candles]);

  return { ma7, ma25, ma99 };
};

const calculateSMA = (candles: Candle[], period: number) => {
  if (candles.length < period) return [];

  const sma: (number | null)[] = new Array(candles.length).fill(null);

  let sum = 0;
  // Calculate sum for the first window
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  sma[period - 1] = sum / period;

  // Slide the window
  for (let i = period; i < candles.length; i++) {
    sum += candles[i].close - candles[i - period].close;
    sma[i] = sum / period;
  }

  return sma;
};
