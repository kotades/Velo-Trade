import { useState, useEffect } from 'react';

interface RateLimiterOptions {
  key: string;
  maxTokens: number;
  refillRate: number; // tokens per millisecond
}

export const useRateLimiter = ({ key, maxTokens, refillRate }: RateLimiterOptions) => {
  const [tokens, setTokens] = useState<number>(() => {
    const stored = localStorage.getItem(`rate_limit_${key}`);
    if (stored) {
      const { tokens: storedTokens, lastRefill } = JSON.parse(stored);
      const elapsed = Date.now() - lastRefill;
      const refilled = Math.floor(elapsed * refillRate);
      return Math.min(maxTokens, storedTokens + refilled);
    }
    return maxTokens;
  });

  const [lastRefill, setLastRefill] = useState<number>(() => {
    const stored = localStorage.getItem(`rate_limit_${key}`);
    if (stored) {
      return JSON.parse(stored).lastRefill;
    }
    return Date.now();
  });

  useEffect(() => {
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify({ tokens, lastRefill }));
  }, [tokens, lastRefill, key]);

  const consume = (): boolean => {
    const now = Date.now();
    const elapsed = now - lastRefill;
    const refilled = Math.floor(elapsed * refillRate);
    
    let currentTokens = tokens;
    let currentLastRefill = lastRefill;

    if (refilled > 0) {
      currentTokens = Math.min(maxTokens, tokens + refilled);
      currentLastRefill = now;
    }

    if (currentTokens > 0) {
      setTokens(currentTokens - 1);
      setLastRefill(currentLastRefill);
      return true;
    }

    return false;
  };

  const getRetryAfter = (): number => {
    if (tokens > 0) return 0;
    const now = Date.now();
    const elapsed = now - lastRefill;
    const needed = 1 / refillRate;
    return Math.max(0, Math.ceil((needed - elapsed) / 1000));
  };

  return { consume, tokens, getRetryAfter };
};
