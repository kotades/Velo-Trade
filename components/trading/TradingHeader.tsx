import React from 'react';
import { View } from '../../App';
import { TradingPair } from './AssetSelector';
import { Trade } from '../../hooks/useTrades';
import { User } from 'firebase/auth';
import ActiveTradeStatus from './ActiveTradeStatus';
import { ChevronDown, Plus, Layers, Wallet, Check, Eye, EyeOff, ArrowRightLeft } from 'lucide-react';
import FundTransferModal from './FundTransferModal';

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
  mainBalance?: number;
  tradingBalance?: number;
  onTransferFunds?: (from: 'main' | 'trading', to: 'main' | 'trading', amount: number) => void;
}

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
  setWalletTab,
  mainBalance = 0,
  tradingBalance,
  onTransferFunds
}) => {
  const [isBalanceHidden, setIsBalanceHidden] = React.useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const effectiveTradingBalance = tradingBalance !== undefined ? tradingBalance : balance;
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
    <header className="h-14 md:h-16 border-b border-zinc-800/80 flex items-center justify-between px-2 sm:px-4 z-30 bg-zinc-950/90 backdrop-blur-2xl shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 min-w-0">
        {/* Brand Home Button */}
        <button 
          aria-label="Go to Home"
          onClick={() => navigateTo('home')} 
          className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 shrink-0 active:scale-95 transition-transform"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 velo-gradient rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20 border border-white/20">
            <span className="text-white font-black text-xs md:text-sm italic">V</span>
          </div>
          <span className="text-lg md:text-xl font-black italic text-white hidden sm:block">VELO<span className="text-cyan-400">.</span></span>
        </button>

        <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

        {/* Pair Selector Pill */}
        <button 
          aria-label={`Select Trading Pair, currently ${selectedPair.displayName}`}
          onClick={() => setAssetSelectorOpen(true)} 
          className="flex items-center gap-2 hover:bg-zinc-900/80 bg-zinc-900/40 border border-zinc-800/80 px-2 sm:px-3 py-1.5 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-98"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-zinc-950 font-black text-[10px] sm:text-xs shrink-0 shadow-sm">
            {selectedPair.icon}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] sm:text-xs font-black text-white uppercase leading-none tracking-tight">{selectedPair.displayName}</span>
            <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider leading-none mt-1 ${priceUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {priceUp ? '+' : ''}{ticker.priceChangePercent24h.toFixed(2)}%
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-zinc-500 ml-0.5" />
        </button>

        <div className="h-6 w-px bg-zinc-800 hidden lg:block" />

        {/* Desktop Ticker Bar */}
        <div className="hidden lg:flex items-center gap-6 text-left">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Mark Price</span>
            <span className={`text-sm font-black leading-none mt-1 ${priceUp ? 'text-emerald-400' : 'text-rose-400'}`}>${formatPrice(ticker.currentPrice)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">24h High</span>
            <span className="text-sm font-black text-white leading-none mt-1">${formatPrice(ticker.high24h)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">24h Low</span>
            <span className="text-sm font-black text-white leading-none mt-1">${formatPrice(ticker.low24h)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">24h Volume</span>
            <span className="text-sm font-black text-zinc-300 leading-none mt-1">{formatVolume(ticker.volume24h)} BTC</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Account, Deposit, Depth Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Feed Status Dot */}
        <div className="hidden xs:flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-900/60 border border-zinc-800">
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-wider hidden sm:block">
            {isConnected ? '1s Live' : 'Reconnecting'}
          </span>
        </div>

        <ActiveTradeStatus trades={trades} />

        {/* Balance Privacy Eye Toggle */}
        <button
          aria-label={isBalanceHidden ? "Reveal balance" : "Hide balance"}
          onClick={() => setIsBalanceHidden(!isBalanceHidden)}
          className="p-1.5 sm:p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-400 hover:text-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-95"
          title={isBalanceHidden ? "Show balance" : "Hide balance"}
        >
          {isBalanceHidden ? <EyeOff className="w-3.5 h-3.5 text-zinc-400" /> : <Eye className="w-3.5 h-3.5 text-zinc-400" />}
        </button>

        {/* Transfer Funds Modal Quick CTA (M-Shot Broker Feature) */}
        <button
          aria-label="Transfer funds between Main and Trading balance"
          onClick={() => setIsTransferModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-bold outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-95"
          title="Transfer funds between Main and Trading balances"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline text-[9px] uppercase font-black tracking-wider">Transfer</span>
        </button>

        {/* Account Switcher Pill */}
        <div className="relative">
          <button 
            aria-haspopup="listbox"
            aria-expanded={isAccountDropdownOpen}
            aria-label={`Switch account, current: ${accountType} account, balance: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            className="flex flex-col items-end hover:bg-zinc-900/80 bg-zinc-900/40 border border-zinc-800/80 px-2 sm:px-3 py-1 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-98"
          >
            <div className="flex items-center gap-1">
              <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none ${accountType === 'demo' ? 'text-amber-400' : 'text-cyan-400'}`}>
                {accountType}
              </span>
              <ChevronDown className={`w-2.5 h-2.5 text-zinc-500 transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            <span className="text-xs sm:text-base font-black text-white leading-none mt-1">
              {isBalanceHidden ? "$••••••" : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </span>
          </button>

          {isAccountDropdownOpen && (
            <div role="listbox" className="absolute top-full right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 backdrop-blur-2xl">
              <div className="px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                Trading Balance Mode
              </div>
              <button 
                role="option"
                aria-selected={accountType === 'demo'}
                onClick={() => { setAccountType('demo'); setIsAccountDropdownOpen(false); }}
                className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-zinc-800/60 transition-all ${accountType === 'demo' ? 'bg-zinc-800/80' : ''}`}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Demo Account</span>
                  <span className="text-[9px] font-semibold text-zinc-400 mt-0.5">
                    {isBalanceHidden ? "$••••••" : `$${(userData?.demoBalance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} Available
                  </span>
                </div>
                {accountType === 'demo' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
              <div className="h-px bg-zinc-800/80" />
              <button 
                role="option"
                aria-selected={accountType === 'real'}
                onClick={() => { setAccountType('real'); setIsAccountDropdownOpen(false); }}
                className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-zinc-800/60 transition-all ${accountType === 'real' ? 'bg-zinc-800/80' : ''}`}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Real Account</span>
                  <span className="text-[9px] font-semibold text-zinc-400 mt-0.5">
                    {isBalanceHidden ? "$••••••" : `$${(userData?.realBalance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} Available
                  </span>
                </div>
                {accountType === 'real' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Fast Deposit CTA Button */}
        <button 
          onClick={() => {
            setActiveSideTab('finances');
            setWalletTab('deposit');
          }}
          className="px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 velo-gradient rounded-xl text-[10px] sm:text-xs font-black text-white uppercase tracking-wider shadow-lg shadow-indigo-500/25 border border-white/20 hover:scale-105 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Deposit</span>
        </button>

        {/* Toggle Level 2 Depth / Info Panel */}
        <button
          onClick={() => setRightPanelOpen(prev => !prev)}
          aria-label="Toggle Order Book and Market Depth"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-8 sm:h-9 md:h-10 rounded-xl border transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-95 ${rightPanelOpen ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
        >
          <Layers className="w-4 h-4 sm:w-4 sm:h-4" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest hidden xl:block">Depth Book</span>
        </button>

        {/* Profile Circle */}
        <button 
          onClick={() => setActiveSideTab('profile')}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center cursor-pointer overflow-hidden hidden sm:flex outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 hover:border-zinc-700 transition-all active:scale-95"
          aria-label="Go to Profile"
        >
          <div className="w-full h-full velo-gradient flex items-center justify-center font-black text-white text-xs sm:text-sm">
            {(userData?.displayName || user?.displayName || user?.email || 'V').charAt(0).toUpperCase()}
          </div>
        </button>
      </div>

      {/* M-Shot Fund Migration Modal */}
      <FundTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        mainBalance={mainBalance}
        tradingBalance={effectiveTradingBalance}
        onTransfer={(from, to, amt) => {
          if (onTransferFunds) {
            onTransferFunds(from, to, amt);
          }
        }}
      />
    </header>
  );
};

export default TradingHeader;
