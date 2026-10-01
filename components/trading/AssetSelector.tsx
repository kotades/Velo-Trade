import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { TOP_STOCKS } from '../../data/stocks';

export interface TradingPair {
  symbol: string;
  displayName: string;
  icon: string;
  price: number;
  change24h: number;
  volume: string;
  category: 'crypto' | 'forex' | 'stocks';
}

const STOCK_PAIRS: TradingPair[] = TOP_STOCKS.map(s => ({
  symbol: `${s.ticker_symbol}USD`,
  displayName: `${s.ticker_symbol} / USD`,
  icon: s.company_logo_url,
  price: s.current_price,
  change24h: s.price_change_24h,
  volume: s.volume_24h,
  category: 'stocks' as const
}));

const MOCK_PAIRS: TradingPair[] = [
  { symbol: 'BTCUSDT', displayName: 'BTC / USDT', icon: '₿', price: 67432.50, change24h: 2.34, volume: '1.2B', category: 'crypto' },
  { symbol: 'ETHUSDT', displayName: 'ETH / USDT', icon: 'Ξ', price: 3521.80, change24h: -1.12, volume: '890M', category: 'crypto' },
  { symbol: 'SOLUSDT', displayName: 'SOL / USDT', icon: '◎', price: 178.25, change24h: 5.62, volume: '450M', category: 'crypto' },
  { symbol: 'BNBUSDT', displayName: 'BNB / USDT', icon: '◆', price: 598.40, change24h: 0.87, volume: '320M', category: 'crypto' },
  { symbol: 'XRPUSDT', displayName: 'XRP / USDT', icon: '✕', price: 0.6234, change24h: -0.45, volume: '280M', category: 'crypto' },
  { symbol: 'ADAUSDT', displayName: 'ADA / USDT', icon: '₳', price: 0.4512, change24h: 1.23, volume: '150M', category: 'crypto' },
  { symbol: 'DOGEUSDT', displayName: 'DOGE / USDT', icon: 'Ð', price: 0.1234, change24h: 3.45, volume: '200M', category: 'crypto' },
  { symbol: 'DOTUSDT', displayName: 'DOT / USDT', icon: '●', price: 7.856, change24h: -2.10, volume: '95M', category: 'crypto' },
  { symbol: 'AVAXUSDT', displayName: 'AVAX / USDT', icon: '▲', price: 38.92, change24h: 1.78, volume: '180M', category: 'crypto' },
  { symbol: 'LINKUSDT', displayName: 'LINK / USDT', icon: '⬡', price: 14.56, change24h: 0.34, volume: '120M', category: 'crypto' },
  { symbol: 'MATICUSDT', displayName: 'MATIC / USDT', icon: '⬟', price: 0.8921, change24h: -1.56, volume: '88M', category: 'crypto' },
  { symbol: 'NEARUSDT', displayName: 'NEAR / USDT', icon: 'Ⓝ', price: 5.67, change24h: 4.12, volume: '110M', category: 'crypto' },
  ...STOCK_PAIRS,
  { symbol: 'EURUSD', displayName: 'EUR / USD', icon: '€', price: 1.0891, change24h: -0.12, volume: '—', category: 'forex' },
  { symbol: 'GBPUSD', displayName: 'GBP / USD', icon: '£', price: 1.2734, change24h: 0.08, volume: '—', category: 'forex' },
  { symbol: 'USDJPY', displayName: 'USD / JPY', icon: '¥', price: 151.42, change24h: 0.23, volume: '—', category: 'forex' }
];

interface AssetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSymbol: string;
  onSelectPair: (pair: TradingPair) => void;
}

const AssetSelector: React.FC<AssetSelectorProps> = ({ isOpen, onClose, selectedSymbol, onSelectPair }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'crypto' | 'forex' | 'stocks'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = MOCK_PAIRS.filter(p => {
    const matchesSearch = p.displayName.toLowerCase().includes(search.toLowerCase()) || p.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 animate-fade-in" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div 
        className={`
          fixed left-0 top-0 h-full z-50
          w-[320px] md:w-[360px] bg-zinc-950/98 backdrop-blur-2xl border-r border-zinc-800
          flex flex-col transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0 visible' : '-translate-x-full invisible'}
        `}
        role="dialog"
        aria-label="Asset Selector"
        aria-modal="true"
      >
        {/* Header */}
        <div className="h-16 border-b border-zinc-900 flex items-center justify-between px-5 shrink-0">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Markets & Assets</h3>
            <span className="text-[10px] text-zinc-500 font-medium">Select instrument to trade</span>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3.5 border-b border-zinc-900 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ticker, company, crypto..."
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div role="tablist" aria-label="Asset Categories" className="flex p-2 gap-1.5 border-b border-zinc-900 shrink-0">
          {(['all', 'crypto', 'stocks', 'forex'] as const).map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Asset List */}
        <div role="listbox" aria-label="Assets" className="flex-1 overflow-y-auto divide-y divide-zinc-900/60">
          {filtered.map(pair => (
            <button
              key={pair.symbol}
              role="option"
              aria-selected={selectedSymbol === pair.symbol}
              onClick={() => { onSelectPair(pair); onClose(); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 hover:bg-zinc-900/60 transition-all text-left focus-visible:outline-none focus-visible:bg-zinc-900/80 ${selectedSymbol === pair.symbol ? 'bg-zinc-900/40 border-l-2 border-l-indigo-500' : ''}`}
            >
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-black text-white shrink-0 overflow-hidden p-1.5">
                {pair.icon.startsWith('http') ? (
                  <img src={pair.icon} alt="" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span>{pair.icon}</span>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <span className="text-xs font-black text-white block truncate">{pair.displayName}</span>
                <span className="text-[10px] text-zinc-500 font-medium">{pair.volume}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-white block font-mono">
                  ${pair.price < 1 ? pair.price.toFixed(4) : pair.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`text-[10px] font-bold ${pair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AssetSelector;
