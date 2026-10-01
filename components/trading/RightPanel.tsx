import React, { useState } from 'react';
import { TickerData } from '../../hooks/useMarketData';
import OrderBook from './OrderBook';
import { ChevronLeft, X, Layers, Info, TrendingUp, BarChart2 } from 'lucide-react';

interface RightPanelProps {
  ticker: TickerData;
  symbol: string;
  isOpen: boolean;
  onToggle: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ ticker, symbol, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('orders');
  const priceUp = ticker.priceChangePercent24h >= 0;

  const formatPrice = (p: number) => {
    if (p === 0) return '—';
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatVolume = (v: number) => {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(2) + 'M';
    if (v >= 1_000) return (v / 1_000).toFixed(2) + 'K';
    return v.toFixed(2);
  };

  return (
    <>
      {/* Toggle button — visible on tablet/desktop when panel is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          aria-label="Open right panel"
          className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 w-8 h-16 bg-zinc-900/90 border border-zinc-800 border-r-0 rounded-l-xl items-center justify-center text-zinc-500 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <button 
          className="md:hidden fixed inset-x-0 top-14 bottom-14 bg-black/40 backdrop-blur-sm z-40 transition-all cursor-default" 
          onClick={onToggle}
          aria-label="Close right panel"
        />
      )}

      {/* Panel */}
      <div className={`
        fixed md:relative right-0 
        top-14 bottom-14 md:top-0 md:bottom-0 h-auto md:h-full z-50 md:z-auto
        w-[280px] sm:w-[320px] md:w-[340px] border-l border-zinc-900 bg-zinc-950/95 md:bg-zinc-900/95 backdrop-blur-2xl
        flex flex-col transition-transform duration-500 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:invisible'}
      `}>
        {/* Header with Tabs & Description */}
        <div className="border-b border-zinc-900 shrink-0">
          <div className="h-12 md:h-14 flex items-center justify-between px-3">
            <div className="flex bg-zinc-900/80 rounded-lg p-0.5" role="tablist">
              <button 
                onClick={() => setActiveTab('orders')}
                role="tab"
                aria-selected={activeTab === 'orders'}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 ${activeTab === 'orders' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Layers className="w-3 h-3 text-cyan-400" />
                Orders
              </button>
              <button 
                onClick={() => setActiveTab('info')}
                role="tab"
                aria-selected={activeTab === 'info'}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 ${activeTab === 'info' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Info className="w-3 h-3 text-secondary-400" />
                Info
              </button>
            </div>
            <button 
              onClick={onToggle} 
              aria-label="Close right panel"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-3 py-1 bg-zinc-950/40 border-t border-zinc-900/80 text-[8px] text-zinc-500 font-medium">
            {activeTab === 'orders' 
              ? 'Level 2 Depth • Live bid/ask spread and order aggregation' 
              : '24-Hour Statistical Highlights & Underlying Asset Fundamentals'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'orders' ? (
            <OrderBook currentPrice={ticker.currentPrice} />
          ) : (
            <>
              {/* Quick Stats */}
              <div className="p-5 border-b border-zinc-900 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Price</span>
                  <span className={`text-sm font-black ${priceUp ? 'text-emerald-400' : 'text-rose-400'}`}>${formatPrice(ticker.currentPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">24h Change</span>
                  <span className={`text-sm font-black ${priceUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {priceUp ? '+' : ''}{ticker.priceChange24h.toFixed(2)} ({priceUp ? '+' : ''}{ticker.priceChangePercent24h.toFixed(2)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">High</span>
                  <span className="text-sm font-black text-white">${formatPrice(ticker.high24h)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Low</span>
                  <span className="text-sm font-black text-white">${formatPrice(ticker.low24h)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Volume</span>
                  <span className="text-sm font-black text-white">{formatVolume(ticker.volume24h)} BTC</span>
                </div>
              </div>

              {/* Market Description placeholder */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col text-left">
                <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-3 italic">About {symbol}</h4>
                <p className="text-zinc-500 text-[10px] font-medium leading-relaxed">
                  {symbol} is a prominent digital asset in the global financial ecosystem. Market participants monitor price action closely for volatility and liquidity patterns.
                </p>
                
                <div className="mt-8 space-y-4">
                  <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Volatilty Index</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '65%' }} />
                      </div>
                      <span className="text-[9px] font-black text-white">Moderate</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Market Sentiment */}
        <div className="p-5 border-t border-zinc-900 bg-zinc-950 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Market Sentiment</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${priceUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              {priceUp ? 'Bullish' : 'Bearish'}
            </span>
          </div>
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.max(5, Math.min(95, 50 + ticker.priceChangePercent24h * 2))}%` }} />
            <div className="h-full bg-rose-500 flex-1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default RightPanel;
