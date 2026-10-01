import React, { useMemo, useState, useEffect } from 'react';
import CandlestickChart from './CandlestickChart';
import CopyTradingHub from '../social/CopyTradingHub';
import PositionsPanel from './PositionsPanel';
import OrderPanel from './OrderPanel';
import RightPanel from './RightPanel';
import OrderBook from './OrderBook';
import { TradingPair } from './AssetSelector';
import { Trade } from '../../hooks/useTrades';
import { MobileTab } from './MobileTradeNav';
import Skeleton from '../common/Skeleton';
import { BarChart2, Wallet, Users, BookOpen, User, Settings, Activity, Layers, TrendingUp, History, Scale, Bot } from 'lucide-react';

interface TerminalViewProps {
  terminalView: 'chart' | 'social';
  setTerminalView: (view: 'chart' | 'social') => void;
  candles: any[];
  ticker: any;
  trades: Trade[];
  selectedPair: TradingPair;
  positionsExpanded: boolean;
  setPositionsExpanded: (val: boolean | ((prev: boolean) => boolean)) => void;
  mobileTab: MobileTab;
  isOrderPanelExpanded: boolean;
  setIsOrderPanelExpanded: (val: boolean | ((prev: boolean) => boolean)) => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  investment: number;
  setInvestment: (val: number) => void;
  duration: string;
  accountType: 'demo' | 'real';
  setAssetSelectorOpen: (open: boolean) => void;
  setActiveSideTab: (tab: string) => void;
  setMobileTab: (tab: MobileTab) => void;
}

const TerminalView: React.FC<TerminalViewProps> = ({
  terminalView,
  setTerminalView,
  candles,
  ticker,
  trades,
  selectedPair,
  positionsExpanded,
  setPositionsExpanded,
  mobileTab,
  isOrderPanelExpanded,
  setIsOrderPanelExpanded,
  rightPanelOpen,
  setRightPanelOpen,
  investment,
  setInvestment,
  duration,
  accountType,
  setAssetSelectorOpen,
  setActiveSideTab,
  setMobileTab
}) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'chart' | 'book' | 'positions'>('chart');

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeTradesForSymbol = useMemo(() => {
    return trades.filter(t => t.status === 'open' && t.symbol === selectedPair.symbol);
  }, [trades, selectedPair.symbol]);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-w-0 overflow-hidden md:p-1 gap-1 border-x md:border-x-0 border-[hsl(var(--color-border))] rounded-t-3xl md:rounded-none bg-[hsl(var(--color-bg)/0.5)]">
      
      {/* Main Terminal Area */}
      <div className={`flex-1 flex flex-col min-w-0 md:border md:border-[hsl(var(--color-border))] md:rounded-2xl overflow-hidden bg-[hsl(var(--color-bg)/0.2)] ${mobileTab !== 'trade' ? 'hidden md:flex' : 'flex'}`}>
        
        {/* View Toggle & Status Bar */}
        <div className="flex items-center justify-between p-1 px-2 sm:px-3 border-b border-[hsl(var(--color-border)/0.5)] bg-[hsl(var(--color-bg)/0.3)]">
          {/* Desktop Tab Switcher */}
          <div role="tablist" aria-label="Terminal View" className="hidden md:flex bg-[hsl(var(--color-surface)/0.4)] p-0.5 rounded-lg">
            <button 
              role="tab"
              aria-selected={terminalView === 'chart'}
              aria-controls="terminal-content-area"
              onClick={() => setTerminalView('chart')}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--secondary-500))] ${terminalView === 'chart' ? 'bg-[hsl(var(--color-surface))] text-[hsl(var(--secondary-400))] shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Chart View
            </button>
            <button 
              role="tab"
              aria-selected={terminalView === 'social'}
              aria-controls="terminal-content-area"
              onClick={() => setTerminalView('social')}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--secondary-500))] ${terminalView === 'social' ? 'bg-[hsl(var(--color-surface))] text-[hsl(var(--secondary-400))] shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Copy Traders
            </button>
          </div>

          {/* Mobile Segmented Workspace Switcher */}
          <div className="flex md:hidden bg-zinc-900/80 p-0.5 rounded-xl border border-zinc-800" role="tablist">
            <button 
              role="tab"
              aria-selected={mobileViewMode === 'chart'}
              onClick={() => setMobileViewMode('chart')}
              className={`flex items-center gap-1 px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${mobileViewMode === 'chart' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              Chart
            </button>
            <button 
              role="tab"
              aria-selected={mobileViewMode === 'book'}
              onClick={() => setMobileViewMode('book')}
              className={`flex items-center gap-1 px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${mobileViewMode === 'book' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Layers className="w-3 h-3 text-secondary-400" />
              Depth
            </button>
            <button 
              role="tab"
              aria-selected={mobileViewMode === 'positions'}
              onClick={() => setMobileViewMode('positions')}
              className={`flex items-center gap-1 px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${mobileViewMode === 'positions' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <History className="w-3 h-3 text-emerald-400" />
              Positions ({activeTradesForSymbol.length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[140px] sm:max-w-none">{selectedPair.displayName} • 1s Feed</span>
          </div>
        </div>

        {/* Main View Area */}
        <div id="terminal-content-area" role="tabpanel" className="flex-1 relative overflow-hidden flex flex-col">
          {/* Mobile alternative views */}
          {!isDesktop && mobileViewMode === 'book' && (
            <div className="flex-1 overflow-hidden bg-zinc-950 flex flex-col">
              <OrderBook currentPrice={ticker.currentPrice} />
            </div>
          )}

          {!isDesktop && mobileViewMode === 'positions' && (
            <div className="flex-1 overflow-y-auto bg-zinc-950 flex flex-col">
              <PositionsPanel 
                isExpanded={true} 
                onToggle={() => {}} 
                currentPrice={ticker.currentPrice}
                symbol={selectedPair.symbol}
              />
            </div>
          )}

          {(isDesktop || mobileViewMode === 'chart') && (
            terminalView === 'chart' ? (
              <div className="flex-1 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <span className="text-[150px] md:text-[250px] font-black italic select-none">VELO</span>
                </div>
                <div className="absolute inset-0">
                  {candles.length > 0 ? (
                    <CandlestickChart 
                      candles={candles} 
                      activeTrades={activeTradesForSymbol}
                    />
                  ) : (
                    <div className="w-full h-full p-4 flex flex-col gap-4">
                      <Skeleton height="70%" width="100%" />
                      <div className="flex gap-4">
                        <Skeleton height="20px" width="100px" />
                        <Skeleton height="20px" width="100px" />
                      </div>
                      <Skeleton height="15%" width="100%" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <CopyTradingHub onBack={() => setTerminalView('chart')} />
              </div>
            )
          )}
        </div>

        {/* Positions Panel (Desktop bottom bar) */}
        <div className="hidden md:block">
          <PositionsPanel 
            isExpanded={positionsExpanded} 
            onToggle={() => setPositionsExpanded(p => !p)} 
            currentPrice={ticker.currentPrice}
            symbol={selectedPair.symbol}
          />
        </div>
      </div>

      {/* Sidebar Area */}
      <div className={`${mobileTab !== 'trade' ? 'hidden md:flex' : 'flex'} flex-col ${isOrderPanelExpanded ? (rightPanelOpen ? 'md:w-[320px] lg:w-[360px]' : 'md:w-[280px] lg:w-[300px]') : 'md:w-0 md:opacity-0 md:invisible'} shrink-0 gap-1 transition-all duration-500 ease-in-out overflow-hidden`}>
        <div className="bg-[hsl(var(--color-bg)/0.4)] md:border md:border-[hsl(var(--color-border))] md:rounded-2xl overflow-hidden shadow-xl shadow-black/40">
          <OrderPanel 
            investment={investment}
            setInvestment={setInvestment}
            duration={duration}
            currentPrice={ticker.currentPrice}
            symbol={selectedPair.symbol}
            accountType={accountType}
            isExpanded={isOrderPanelExpanded}
            onToggleExpand={() => setIsOrderPanelExpanded(prev => !prev)}
            isDesktop={isDesktop}
          />
        </div>

        {rightPanelOpen && isOrderPanelExpanded && (
          <div className="hidden md:flex flex-1 border border-[hsl(var(--color-border))] rounded-2xl overflow-hidden bg-[hsl(var(--color-bg)/0.5)] min-h-0">
            <RightPanel ticker={ticker} symbol={selectedPair.symbol} isOpen={true} onToggle={() => setRightPanelOpen(false)} />
          </div>
        )}
      </div>

      {/* Mobile-only views */}
      {mobileTab === 'social' && (
        <div className="flex-1 md:hidden overflow-y-auto bg-[hsl(var(--color-bg))]">
          <CopyTradingHub onNavigate={() => {}} />
        </div>
      )}

      {mobileTab === 'positions' && (
        <div className="flex-1 md:hidden overflow-y-auto bg-[hsl(var(--color-bg))]">
          <PositionsPanel 
            isExpanded={true} 
            onToggle={() => {}} 
            currentPrice={ticker.currentPrice}
            symbol={selectedPair.symbol}
          />
        </div>
      )}

      {mobileTab === 'more' && (
        <div className="flex-1 md:hidden p-6 space-y-4 overflow-y-auto bg-[hsl(var(--color-bg))]">
          <div className="mb-4">
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Quick Actions</h3>
            <p className="text-[10px] text-zinc-500 font-medium mt-1">Terminal navigation & account controls</p>
          </div>
          {[
            { id: 'markets', label: 'Trade Terminal', icon: BarChart2, desc: 'Advanced multi-timeframe trading interface', action: () => setAssetSelectorOpen(true) },
            { id: 'stocks', label: 'Equities Terminal', icon: TrendingUp, desc: 'Institutional US Stocks (NVDA, AAPL, TSLA)' },
            { id: 'predictions', label: 'Polymarket Predictions', icon: Scale, desc: 'Decentralized event binary markets & odds' },
            { id: 'strategies', label: 'Auto-Trading / IRA', icon: Bot, desc: 'Roth IRA automated bots & quantitative algorithms' },
            { id: 'finances', label: 'Portfolio & Wallet', icon: Wallet, desc: 'Deposit, withdraw, and allocate capital' },
            { id: 'social', label: 'Social Copy Hub', icon: Users, desc: 'Mirror top master traders automatically' },
            { id: 'education', label: 'Velo Academy', icon: BookOpen, desc: 'Structured trading education & analytics' },
            { id: 'profile', label: 'Trader Profile', icon: User, desc: 'Identity verification and tier progression' },
            { id: 'settings', label: 'Platform Settings', icon: Settings, desc: 'Security, 2FA, and exchange configurations' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'markets') setAssetSelectorOpen(true);
                  else {
                    setActiveSideTab(item.id);
                    setMobileTab('trade');
                  }
                }}
                className="w-full flex items-center gap-4 p-4 bg-[hsl(var(--color-surface)/0.6)] border border-[hsl(var(--color-border))] rounded-2xl hover:bg-[hsl(var(--color-surface))] transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary-500))]"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-white uppercase tracking-widest">{item.label}</span>
                  <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TerminalView;
