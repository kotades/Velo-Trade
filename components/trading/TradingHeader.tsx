import React from 'react';
import { View } from '../../App';
import { TradingPair } from './AssetSelector';
import { Trade } from '../../hooks/useTrades';
import { User } from 'firebase/auth';
import ActiveTradeStatus from './ActiveTradeStatus';

interface TradingHeaderProps {
  navigateTo: (view: View) => void;
  selectedPair: TradingPair;
  setAssetSelectorOpen: (open: boolean) => void;
  ticker: any;
  isConnected: boolean;
  trades: Trade[];
  accountType: 'demo' | 'real';
  setAccountType: (type: 'demo' | 'real') => void;
  balance: number;
  userData: any;
  user: User | null;
  isAccountDropdownOpen: boolean;
  setIsAccountDropdownOpen: (open: boolean) => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: (open: (prev: boolean) => boolean) => void;
  setActiveSideTab: (tab: string) => void;
  setWalletTab: (tab: 'overview' | 'deposit') => void;
}

// ActiveTradeStatus is imported from separate file

const TradingHeader: React.FC<TradingHeaderProps> = ({
  navigateTo,
  selectedPair,
  setAssetSelectorOpen,
  ticker,
  isConnected,
  trades,
  accountType,
  setAccountType,
  balance,
  userData,
  user,
  isAccountDropdownOpen,
  setIsAccountDropdownOpen,
  rightPanelOpen,
  setRightPanelOpen,
  setActiveSideTab,
  setWalletTab
}) => {
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

  React.useEffect(() => {
    if (!isAccountDropdownOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAccountDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isAccountDropdownOpen, setIsAccountDropdownOpen]);

  return (
    <header className="h-14 md:h-16 border-b border-[hsl(var(--color-border))] flex items-center justify-between px-3 md:px-4 z-30 bg-[hsl(var(--color-bg)/0.9)] backdrop-blur-2xl shrink-0">
      <div className="flex items-center gap-3 md:gap-6">
        <button 
          aria-label="Go to Home"
          onClick={() => navigateTo('home')} 
          className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary-500))] rounded-lg p-1"
        >
          <div className="w-7 h-7 md:w-8 md:h-8 velo-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs md:text-sm italic">V</span>
          </div>
          <span className="text-lg md:text-xl font-black italic text-white hidden sm:block">VELO<span className="text-[hsl(var(--secondary-500))]">.</span></span>
        </button>

        <div className="h-8 w-px bg-zinc-900 hidden sm:block" />

        <button 
          aria-label={`Select Trading Pair, currently ${selectedPair.displayName}`}
          onClick={() => setAssetSelectorOpen(true)} 
          className="flex items-center gap-2 md:gap-3 hover:bg-[hsl(var(--color-surface)/0.5)] px-2 py-1.5 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--secondary-500))]"
        >
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#f7931a] flex items-center justify-center text-white font-black text-[10px] md:text-xs">
            {selectedPair.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs font-black text-white uppercase leading-none">{selectedPair.displayName}</span>
            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5 ${priceUp ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
              {priceUp ? '▲' : '▼'} {ticker.priceChangePercent24h.toFixed(2)}%
            </span>
          </div>
          <svg className="w-3 h-3 text-zinc-600 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        <div className="h-8 w-px bg-zinc-900 hidden lg:block" />

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Price</span>
            <span className={`text-sm font-black leading-none ${priceUp ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>${formatPrice(ticker.currentPrice)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">24h High</span>
            <span className="text-sm font-black text-white leading-none">${formatPrice(ticker.high24h)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">24h Low</span>
            <span className="text-sm font-black text-white leading-none">${formatPrice(ticker.low24h)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Vol</span>
            <span className="text-sm font-black text-white leading-none">{formatVolume(ticker.volume24h)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[hsl(var(--success))] shadow-lg shadow-emerald-500/50' : 'bg-[hsl(var(--danger))] shadow-lg shadow-rose-500/50'}`} />
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest hidden sm:block">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
        <ActiveTradeStatus trades={trades} />

        <div className="flex flex-col items-end mr-2 relative">
          <button 
            aria-haspopup="listbox"
            aria-expanded={isAccountDropdownOpen}
            aria-label={`Switch account, current: ${accountType} account, balance: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            className="flex flex-col items-end hover:bg-[hsl(var(--color-surface)/0.5)] px-2 py-1 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--secondary-500))]"
          >
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">{accountType} Account</span>
              <svg className={`w-2 h-2 text-zinc-600 transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <span className="text-sm md:text-lg font-black text-white leading-none">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </button>

          {isAccountDropdownOpen && (
            <div role="listbox" className="absolute top-full right-0 mt-2 w-48 bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
              <button 
                role="option"
                aria-selected={accountType === 'demo'}
                onClick={() => { setAccountType('demo'); setIsAccountDropdownOpen(false); }}
                className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-zinc-800 transition-all ${accountType === 'demo' ? 'bg-zinc-800/50' : ''}`}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Demo Account</span>
                  <span className="text-[9px] font-medium text-zinc-500">${(userData?.demoBalance ?? 10000).toLocaleString('en-US', { minimumFractionDigits: 2 })} Available</span>
                </div>
                {accountType === 'demo' && <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--secondary-500))]" />}
              </button>
              <div className="h-px bg-[hsl(var(--color-border))]" />
              <button 
                role="option"
                aria-selected={accountType === 'real'}
                onClick={() => { setAccountType('real'); setIsAccountDropdownOpen(false); }}
                className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-zinc-800 transition-all ${accountType === 'real' ? 'bg-zinc-800/50' : ''}`}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Real Account</span>
                  <span className="text-[9px] font-medium text-zinc-500">${(userData?.realBalance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} Available</span>
                </div>
                {accountType === 'real' && <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--secondary-500))]" />}
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={() => {
            setActiveSideTab('finances');
            setWalletTab('deposit');
          }}
          className="px-3 sm:px-4 md:px-6 py-2 md:py-2.5 velo-gradient rounded-xl text-[10px] md:text-xs font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/20 border border-white/10 hover:scale-105 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[hsl(var(--secondary-500))] outline-none"
        >
          <span className="sm:hidden">+$</span>
          <span className="hidden sm:inline">Deposit</span>
        </button>

        <button
          onClick={() => setRightPanelOpen(prev => !prev)}
          className={`flex items-center gap-2 px-3 h-9 md:h-10 rounded-xl border transition-all outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--secondary-500))] ${rightPanelOpen ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
          <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Orders/Info</span>
        </button>

        <button 
          onClick={() => setActiveSideTab('profile')}
          className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group cursor-pointer overflow-hidden hidden sm:flex outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--secondary-500))]"
          aria-label="Go to Profile"
        >
          <div className="w-full h-full velo-gradient flex items-center justify-center font-black text-white text-sm">
            {(userData?.displayName || user?.displayName || 'V').charAt(0)}
          </div>
        </button>
      </div>
    </header>
  );
};

export default TradingHeader;
