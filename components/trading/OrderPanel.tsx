import React, { useState, useEffect } from 'react';
import { useTrades } from '../../hooks/useTrades';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

const ActiveCountdown: React.FC<{ expiryTime: number }> = ({ expiryTime }) => {
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

  return <span className="text-[10px] font-mono font-black text-white animate-pulse">{timeLeft}</span>;
};

export type OrderType = 'market' | 'limit' | 'stop';

interface OrderPanelProps {
  investment: number;
  setInvestment: (fn: (prev: number) => number) => void;
  duration: string;
  currentPrice: number;
  symbol: string;
  accountType: 'demo' | 'real';
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isDesktop?: boolean;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ 
  investment, setInvestment, duration, currentPrice, symbol, accountType,
  isExpanded = true, onToggleExpand, isDesktop = false
}) => {
  const { trades, placeTrade } = useTrades();
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('market');
  
  // Find active trade for this symbol to show a small indicator if needed
  const activeTrade = trades.find(t => t.status === 'open' && t.symbol === symbol);
  
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [takeProfitPrice, setTakeProfitPrice] = useState('');
  const [leverage, setLeverage] = useState(1);
  const LEVERAGE_OPTIONS = [1, 5, 10, 20, 50, 100];

  const handleTrade = async (type: 'buy' | 'sell') => {
    if (isPlacing || currentPrice === 0) return;
    
    setIsPlacing(true);
    const result = await placeTrade({
      symbol,
      type,
      entryPrice: currentPrice,
      amount: investment,
      duration,
      accountType
    });

    if (result.type === 'error') {
      console.error("Trade failed:", result.error);
      // Optional: Add a toast or UI feedback here
    }

    setIsPlacing(false);
  };

  const formatDisplayPrice = (p: number) => {
    if (p === 0) return '—';
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const showFullOptions = isExpanded || isDesktop;

  return (
    <div 
      role="region"
      aria-label="Trading Order Configuration"
      className={`flex flex-col bg-[hsl(var(--color-bg)/0.95)] backdrop-blur-xl border-t md:border-t-0 border-[hsl(var(--color-border))] shrink-0 transition-all duration-300 ${showFullOptions ? 'p-2 md:p-5' : 'p-1.5 px-3'}`}>
      
      <button 
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
        aria-controls="trading-options-panel"
        className="md:hidden flex items-center justify-between w-full px-1 py-1 mb-1 cursor-pointer group focus-visible:ring-2 focus-visible:ring-[hsl(var(--secondary-500))] rounded-lg outline-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[hsl(var(--secondary-500))] flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3" />
            <span>{isExpanded ? 'Trading Configuration' : 'Quick Trade'}</span>
          </span>
          {!isExpanded && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[hsl(var(--color-surface))] rounded-full border border-white/5">
              <span className="text-[9px] font-bold text-zinc-400">${investment}</span>
              <span className="text-[9px] font-bold text-zinc-500">•</span>
              <span className="text-[9px] font-bold text-zinc-400">{duration}</span>
            </div>
          )}
        </div>
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[hsl(var(--color-surface))] group-hover:bg-zinc-800 transition-colors text-zinc-400">
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </div>
      </button>

      {showFullOptions ? (
        <div id="trading-options-panel" className="flex flex-col items-center gap-2 md:gap-3">
          {/* Order Type Tabs */}
          <div className="w-full max-w-lg">
            <div role="tablist" className="flex w-full bg-[hsl(var(--color-surface)/0.6)] rounded-lg p-0.5 gap-0.5">
              {([
                { id: 'market' as const, label: 'Market' },
                { id: 'limit' as const, label: 'Limit' },
                { id: 'stop' as const, label: 'SL/TP' },
              ]).map(type => (
                <button
                  key={type.id}
                  role="tab"
                  aria-selected={orderType === type.id}
                  aria-label={`Select ${type.label} order type`}
                  onClick={() => setOrderType(type.id)}
                  className={`flex-1 py-1 rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-[hsl(var(--secondary-500))] outline-none ${
                    orderType === type.id
                      ? 'bg-[hsl(var(--color-border))] text-[hsl(var(--secondary-500))] shadow-md'
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <p className="text-[8px] text-zinc-500 font-medium px-1 mt-1">
              {orderType === 'market' && 'Instant fill at current best execution price'}
              {orderType === 'limit' && 'Pending order executed when target price triggers'}
              {orderType === 'stop' && 'Automated risk management with Stop Loss / Take Profit bounds'}
            </p>
          </div>

          {/* Investment & Duration */}
          <div className="flex items-center gap-2 md:gap-3 w-full max-w-lg">
            <div className="flex-1 flex items-center bg-[hsl(var(--color-surface)/0.8)] border border-[hsl(var(--color-border))] rounded-xl h-8 md:h-11 overflow-hidden">
              <button 
                aria-label="Decrease investment"
                onClick={() => setInvestment(prev => Math.max(1, prev - 1))} 
                className="w-8 md:w-11 h-full flex items-center justify-center hover:bg-zinc-800 text-zinc-500 transition-all text-sm md:text-base focus-visible:bg-zinc-800 outline-none"
              >−</button>
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-[6px] md:text-[8px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Investment</span>
                <span className="text-xs md:text-base font-black text-white leading-none mt-0.5">${investment}</span>
              </div>
              <button 
                aria-label="Increase investment"
                onClick={() => setInvestment(prev => prev + 1)} 
                className="w-8 md:w-11 h-full flex items-center justify-center hover:bg-zinc-800 text-zinc-500 transition-all text-sm md:text-base focus-visible:bg-zinc-800 outline-none"
              >+</button>
            </div>
            <div className="flex-1 flex items-center bg-[hsl(var(--color-surface)/0.8)] border border-[hsl(var(--color-border))] rounded-xl h-8 md:h-11 overflow-hidden">
              <button 
                aria-label="Decrease duration"
                className="w-8 md:w-11 h-full flex items-center justify-center hover:bg-zinc-800 text-zinc-500 transition-all text-sm md:text-base focus-visible:bg-zinc-800 outline-none"
              >−</button>
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-[6px] md:text-[8px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Duration</span>
                <span className="text-xs md:text-base font-black text-white leading-none mt-0.5">{duration}</span>
              </div>
              <button 
                aria-label="Increase duration"
                className="w-8 md:w-11 h-full flex items-center justify-center hover:bg-zinc-800 text-zinc-500 transition-all text-sm md:text-base focus-visible:bg-zinc-800 outline-none"
              >+</button>
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="flex items-center gap-1.5 w-full max-w-lg justify-between">
            {[10, 25, 50, 100, 250, 500].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setInvestment(amt)}
                className={`flex-1 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 ${
                  investment === amt 
                    ? 'bg-zinc-800 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                    : 'bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 border border-zinc-800/60'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Leverage Selector */}
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-between mb-1 px-1">
              <label id="leverage-label" className="text-[8px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">Leverage Multiplier</label>
              <span className="text-[8px] text-zinc-500 font-medium">Buying Power {leverage}x</span>
            </div>
            <div role="radiogroup" aria-labelledby="leverage-label" className="flex bg-[hsl(var(--color-surface)/0.6)] rounded-lg p-0.5 gap-0.5 overflow-x-auto no-scrollbar">
              {LEVERAGE_OPTIONS.map(val => (
                <button
                  key={val}
                  role="radio"
                  aria-checked={leverage === val}
                  aria-label={`${val}x leverage`}
                  onClick={() => setLeverage(val)}
                  className={`flex-1 min-w-[34px] md:min-w-[40px] py-0.5 md:py-1 rounded-md text-[8px] md:text-[9px] font-black transition-all focus-visible:ring-2 focus-visible:ring-[hsl(var(--secondary-500))] outline-none ${
                    leverage === val
                      ? 'bg-[hsl(var(--color-border))] text-[hsl(var(--secondary-500))] shadow-md'
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {val}x
                </button>
              ))}
            </div>
          </div>

          {/* Conditional: Limit Price + Stop Price fields */}
          {orderType !== 'market' && (
            <div className="flex items-center gap-2 md:gap-4 w-full max-w-lg">
              {orderType === 'limit' && (
                <div className="flex-1">
                  <label htmlFor="limit-price" className="text-[8px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1 px-1">Limit Price</label>
                  <input
                    id="limit-price"
                    type="text"
                    value={limitPrice}
                    onChange={e => setLimitPrice(e.target.value)}
                    placeholder={formatDisplayPrice(currentPrice)}
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5 md:py-2.5 text-xs md:text-sm font-black text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                  />
                </div>
              )}
              {orderType === 'stop' && (
                <>
                  <div className="flex-1">
                    <label htmlFor="stop-loss" className="text-[8px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1 px-1">Stop Loss</label>
                    <input
                      id="stop-loss"
                      type="text"
                      value={stopPrice}
                      onChange={e => setStopPrice(e.target.value)}
                      placeholder={formatDisplayPrice(currentPrice * 0.97)}
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5 md:py-2 text-[10px] md:text-xs font-black text-white placeholder-zinc-700 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="take-profit" className="text-[8px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1 px-1">Take Profit</label>
                    <input
                      id="take-profit"
                      type="text"
                      value={takeProfitPrice}
                      onChange={e => setTakeProfitPrice(e.target.value)}
                      placeholder={formatDisplayPrice(currentPrice * 1.05)}
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5 md:py-2 text-[10px] md:text-xs font-black text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex gap-2 md:gap-3 w-full max-w-lg h-9 md:h-12 relative">
            <button 
              aria-label={`Place SELL order at ${formatDisplayPrice(currentPrice)}`}
              onClick={() => handleTrade('sell')}
              disabled={isPlacing || currentPrice === 0}
              className={`flex-1 relative group overflow-hidden bg-[hsl(var(--danger))] rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/10 active:scale-95 transition-all hover:bg-rose-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--danger))] outline-none ${isPlacing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-1.5 md:gap-2 z-10">
                {isPlacing ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/80" />
                )}
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs md:text-base font-black text-white tracking-tighter italic leading-none">SELL</span>
                  <span className="text-[6px] md:text-[8px] font-bold text-white/60 uppercase leading-none">Market</span>
                </div>
              </div>
            </button>

            <button 
              aria-label={`Place BUY order at ${formatDisplayPrice(currentPrice)}`}
              onClick={() => handleTrade('buy')}
              disabled={isPlacing || currentPrice === 0}
              className={`flex-1 relative group overflow-hidden bg-[hsl(var(--success))] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 active:scale-95 transition-all hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--success))] outline-none ${isPlacing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-row-reverse items-center gap-1.5 md:gap-2 z-10">
                {isPlacing ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/80" />
                )}
                <div className="flex flex-col items-end leading-tight text-right">
                  <span className="text-xs md:text-base font-black text-white tracking-tighter italic leading-none">BUY</span>
                  <span className="text-[6px] md:text-[8px] font-bold text-white/60 uppercase leading-none">Market</span>
                </div>
              </div>
            </button>
            
            {activeTrade && (
              <div className="absolute -top-5 right-0 flex items-center gap-1.5 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30 backdrop-blur-sm pointer-events-none">
                <span className="text-[7px] font-black text-indigo-400 uppercase tracking-tighter">Active</span>
                <ActiveCountdown expiryTime={activeTrade.expiryTime} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 w-full max-w-lg h-9">
          <button 
            onClick={(e) => { e.stopPropagation(); handleTrade('sell'); }} 
            disabled={isPlacing || currentPrice === 0}
            aria-label={`Quick sell ${symbol} at market price`}
            className="flex-1 h-full bg-gradient-to-r from-rose-600/30 to-rose-500/20 hover:from-rose-600/40 hover:to-rose-500/30 text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-wider border border-rose-500/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-rose-500 shadow-sm"
          >
            {isPlacing ? (
              <div className="w-3 h-3 border-2 border-rose-400/40 border-t-rose-400 rounded-full animate-spin" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5" />
            )}
            <span>Sell Market</span>
            <span className="text-[8px] px-1 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold ml-1">+85%</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleTrade('buy'); }} 
            disabled={isPlacing || currentPrice === 0}
            aria-label={`Quick buy ${symbol} at market price`}
            className="flex-1 h-full bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 hover:from-emerald-600/40 hover:to-emerald-500/30 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-500/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-sm"
          >
            {isPlacing ? (
              <div className="w-3 h-3 border-2 border-emerald-400/40 border-t-emerald-400 rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-3.5 h-3.5" />
            )}
            <span>Buy Market</span>
            <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold ml-1">+85%</span>
          </button>
        </div>
      )}
    </div>
  );
};
export default OrderPanel;
