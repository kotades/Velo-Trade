import React, { useState, useEffect } from 'react';
import { Trade } from '../../hooks/useTrades';

interface ActiveTradeStatusProps {
  trades: Trade[];
}

const ActiveTradeStatus: React.FC<ActiveTradeStatusProps> = ({ trades }) => {
  const activeTrade = trades.find(t => t.status === 'open');
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!activeTrade) return;

    const totalSeconds = (() => {
      const durationStr = activeTrade.duration || '00:01:00';
      const [h, m, s] = durationStr.split(':').map(Number);
      return (h * 3600 + m * 60 + s);
    })();

    const update = () => {
      const remainingMs = Math.max(0, activeTrade.expiryTime - Date.now());
      const seconds = Math.floor(remainingMs / 1000);
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      
      const p = (remainingMs / (totalSeconds * 1000)) * 100;
      setProgress(p);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeTrade]);

  if (!activeTrade) return null;

  return (
    <div 
      role="status"
      aria-live="polite"
      className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[hsl(var(--color-surface))] border border-[hsl(var(--primary-500)/0.3)] rounded-xl shadow-lg shadow-indigo-500/5 anim-fade-in relative overflow-hidden"
    >
      <div 
        className="absolute bottom-0 left-0 h-0.5 bg-indigo-500/50 transition-all duration-1000 ease-linear"
        style={{ width: `${progress}%` }}
      />
      
      <div className="flex flex-col">
        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">In Trade</span>
        <span className="text-[10px] font-black text-white leading-none mt-1">{activeTrade.symbol}</span>
      </div>
      <div className="h-6 w-px bg-zinc-800" />
      <div className="flex flex-col items-center">
        <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Time Left</span>
        <span className="text-xs font-mono font-black text-[hsl(var(--secondary-500))] leading-none mt-1">{timeLeft}</span>
      </div>
    </div>
  );
};

export default ActiveTradeStatus;
