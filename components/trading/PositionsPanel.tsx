import React, { useState, useEffect, useMemo } from 'react';
import { useTrades, Trade } from '../../hooks/useTrades';
import { Layers, ChevronDown, Activity, ShieldCheck, Clock } from 'lucide-react';

const TradeCountdown: React.FC<{ expiryTime: number }> = ({ expiryTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, expiryTime - Date.now());
      const seconds = Math.floor(remaining / 1000);
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  return <span className="font-mono text-[hsl(var(--secondary-400))]">{timeLeft}</span>;
};

type PositionTab = 'active' | 'history';

interface PositionsPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
  currentPrice: number;
  symbol: string;
}

const PositionsPanel: React.FC<PositionsPanelProps> = ({ isExpanded, onToggle, currentPrice, symbol }) => {
  const [activeTab, setActiveTab] = useState<PositionTab>('active');
  const { trades, loading } = useTrades();

  const filteredTrades = useMemo(() => {
    if (activeTab === 'active') return trades.filter(t => t.status === 'open');
    return trades.filter(t => t.status === 'closed');
  }, [trades, activeTab]);

  const activeTrades = useMemo(() => trades.filter(t => t.status === 'open'), [trades]);
  
  const calculatePnl = (trade: Trade) => {
    if (trade.status === 'closed') return trade.payout || 0;
    
    // For simplicity, we only calculate live P&L if the trade symbol matches the active one
    if (trade.symbol !== symbol) return 0;

    const isProfit = trade.type === 'buy' 
      ? currentPrice > trade.entryPrice 
      : currentPrice < trade.entryPrice;
    
    return isProfit ? (trade.amount * 0.85) : -trade.amount; // 85% payout simulation
  };

  const totalPnl = useMemo(() => {
    return activeTrades.reduce((sum, t) => sum + calculatePnl(t), 0);
  }, [activeTrades, currentPrice, symbol]);

  return (
    <div className={`border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-bg)/0.9)] backdrop-blur-md transition-all duration-300 ${isExpanded ? 'max-h-[350px]' : 'max-h-[36px]'} overflow-hidden shrink-0`}>
      {/* Header — always visible */}
      <button 
        onClick={onToggle} 
        aria-expanded={isExpanded}
        aria-label="Toggle Positions Panel"
        className="w-full h-9 flex items-center justify-between px-3 hover:bg-[hsl(var(--color-surface)/0.4)] transition-all outline-none focus-visible:bg-[hsl(var(--color-surface))]"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Positions</span>
          <span className="text-[8px] font-bold text-zinc-600 bg-[hsl(var(--color-surface))] px-1.5 py-0.5 rounded">
            {activeTrades.length} open
          </span>
          <span className={`text-[9px] font-black ${totalPnl >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)} USD
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && (
            <button
              onClick={e => { e.stopPropagation(); }}
              className="text-[9px] font-black uppercase tracking-widest text-[hsl(var(--danger))] hover:text-white bg-[hsl(var(--danger)/0.1)] hover:bg-[hsl(var(--danger))] px-3 py-1 rounded-lg transition-all"
            >
              Close All
            </button>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Explanatory description banner */}
      <div className="px-3 py-1 bg-zinc-950/60 border-y border-[hsl(var(--color-border)/0.5)] flex items-center justify-between text-[8px] text-zinc-500 font-medium">
        <span className="flex items-center gap-1.5">
          <Activity className="w-2.5 h-2.5 text-cyan-400" />
          Real-time Mark-to-Market P&L • Auto-settled upon contract expiration
        </span>
        <span className="hidden sm:flex items-center gap-1 text-emerald-400/80">
          <ShieldCheck className="w-2.5 h-2.5" />
          Zero Slippage Guaranteed
        </span>
      </div>

      <div role="tablist" aria-label="Trade Views" className="flex px-3 gap-1 border-b border-[hsl(var(--color-border))]">
        {([
          { id: 'active' as const, label: 'Active', count: activeTrades.length },
          { id: 'history' as const, label: 'History', count: trades.filter(t => t.status === 'closed').length },
        ]).map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="positions-panel-content"
            onClick={() => setActiveTab(tab.id)}
            className={`px-2 py-1.5 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 outline-none focus-visible:bg-[hsl(var(--color-surface))] ${
              activeTab === tab.id
                ? 'text-[hsl(var(--secondary-400))] border-[hsl(var(--secondary-400))]'
                : 'text-zinc-600 border-transparent hover:text-zinc-400'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Table */}
      <div id="positions-panel-content" role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="overflow-x-auto overflow-y-auto max-h-[280px]">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[hsl(var(--color-border)/0.5)]">
              {['Pair', 'Type', 'Entry', 'Current', 'Amount', 'P&L', 'ROI', 'Time', ''].map((h, i) => (
                <th key={i} className="px-3 py-2 text-left text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                  {i === 8 ? <span className="sr-only">Actions</span> : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                  Loading trades...
                </td>
              </tr>
            ) : filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                  No {activeTab} trades
                </td>
              </tr>
            ) : filteredTrades.map(trade => {
              const livePnl = calculatePnl(trade);
              const liveRoi = (livePnl / trade.amount) * 100;
              const displayPrice = trade.symbol === symbol ? currentPrice : trade.entryPrice;

              return (
                <tr key={trade.id} className="border-b border-[hsl(var(--color-border)/0.3)] hover:bg-[hsl(var(--color-surface)/0.3)] transition-all">
                  <td className="px-3 py-1.5 text-xs font-black text-white">{trade.symbol}</td>
                  <td className="px-3 py-1.5">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${trade.type === 'buy' ? 'bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]' : 'bg-[hsl(var(--danger)/0.1)] text-[hsl(var(--danger))]'}`}>
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-[10px] font-bold text-zinc-400">${trade.entryPrice.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-[10px] font-bold text-white">${displayPrice.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-[10px] font-bold text-zinc-400">${trade.amount}</td>
                  <td className={`px-3 py-1.5 text-[10px] font-black ${livePnl >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
                    {livePnl === 0 ? '—' : `${livePnl >= 0 ? '+' : ''}$${livePnl.toFixed(2)}`}
                  </td>
                  <td className={`px-3 py-1.5 text-[10px] font-black ${liveRoi >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
                    {liveRoi === 0 ? '—' : `${liveRoi >= 0 ? '+' : ''}${liveRoi.toFixed(2)}%`}
                  </td>
                  <td className="px-3 py-1.5 text-[9px] font-medium text-zinc-600">
                    {trade.status === 'open' ? (
                      <TradeCountdown expiryTime={trade.expiryTime} />
                    ) : (
                      'Closed'
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {trade.status === 'open' && (
                      <button 
                        aria-label={`Close trade for ${trade.symbol}`}
                        className="text-[9px] font-black uppercase text-zinc-500 hover:text-[hsl(var(--danger))] px-2 py-1 rounded hover:bg-[hsl(var(--danger)/0.1)] transition-all outline-none focus-visible:bg-[hsl(var(--danger)/0.2)]"
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsPanel;
