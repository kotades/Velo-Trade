import React, { useState, useEffect } from 'react';
import { View } from '../App';
import { useMarketData } from '../hooks/useMarketData';
import MobileTradeNav, { MobileTab } from './trading/MobileTradeNav';
import RightPanel from './trading/RightPanel';
import AssetSelector, { TradingPair } from './trading/AssetSelector';
import WalletDashboard from './wallet/WalletDashboard';
import CopyTradingHub from './social/CopyTradingHub';
import SettingsPage from './settings/SettingsPage';
import ProfilePage from './settings/ProfilePage';
import { useAuth } from '../context/AuthContext';
import { useTrades } from '../hooks/useTrades';
import { useGhostEngine } from '../hooks/useGhostTraders';

import TradingHeader from './trading/TradingHeader';
import SideNavigation from './trading/SideNavigation';
import TerminalView from './trading/TerminalView';
import { BookOpen } from 'lucide-react';

interface TradingProps {
  navigateTo: (view: View) => void;
}

const Trading: React.FC<TradingProps> = ({ navigateTo }) => {
  const [selectedPair, setSelectedPair] = useState<TradingPair>({
    symbol: 'BTCUSDT',
    displayName: 'BTC / USDT',
    icon: '₿',
    price: 0,
    change24h: 0,
    volume: '—',
    category: 'crypto',
  });

  const { candles, ticker, isConnected } = useMarketData(selectedPair.symbol);

  const [activeSideTab, setActiveSideTab] = useState('trade');
  const [investment, setInvestment] = useState(10);
  const [duration] = useState('00:01:00');
  const { user, userData } = useAuth();
  const { trades } = useTrades();
  useGhostEngine(); 
  
  const [accountType, setAccountType] = useState<'demo' | 'real'>('demo');
  const balance = accountType === 'demo' ? (userData?.demoBalance ?? 10000) : (userData?.realBalance ?? 0);
  
  const [walletTab, setWalletTab] = useState<'overview' | 'deposit'>('overview');
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [assetSelectorOpen, setAssetSelectorOpen] = useState(false);
  const [positionsExpanded, setPositionsExpanded] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('trade');
  const [isOrderPanelExpanded, setIsOrderPanelExpanded] = useState(false);
  const [terminalView, setTerminalView] = useState<'chart' | 'social'>('chart');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsOrderPanelExpanded(true);
    }
  }, []);

  const handleSelectPair = (pair: TradingPair) => {
    setSelectedPair(pair);
  };

  return (
    <div className="fixed inset-0 bg-[hsl(var(--color-bg))] flex flex-col overflow-hidden text-zinc-300 font-sans select-none border-[6px] md:border-none border-[hsl(var(--color-surface)/0.3)]">

      <AssetSelector
        isOpen={assetSelectorOpen}
        onClose={() => setAssetSelectorOpen(false)}
        selectedSymbol={selectedPair.symbol}
        onSelectPair={handleSelectPair}
      />

      <TradingHeader 
        navigateTo={navigateTo}
        selectedPair={selectedPair}
        ticker={ticker}
        isConnected={isConnected}
        trades={trades}
        isAccountDropdownOpen={isAccountDropdownOpen}
        setIsAccountDropdownOpen={setIsAccountDropdownOpen}
        accountType={accountType}
        setAccountType={setAccountType}
        balance={balance}
        userData={userData}
        user={user}
        rightPanelOpen={rightPanelOpen}
        setRightPanelOpen={setRightPanelOpen}
        setAssetSelectorOpen={setAssetSelectorOpen}
        setActiveSideTab={setActiveSideTab}
        setWalletTab={setWalletTab}
      />

      <div className="flex-1 flex overflow-hidden border-t md:border-none border-zinc-900/50">

        <SideNavigation 
          activeSideTab={activeSideTab}
          setActiveSideTab={setActiveSideTab}
          setMobileTab={setMobileTab}
          setWalletTab={setWalletTab}
        />

        <div className="flex-1 relative bg-[hsl(var(--color-bg))] flex flex-col min-w-0" id="main-content">
          
          {activeSideTab === 'trade' && (
            <TerminalView 
              terminalView={terminalView}
              setTerminalView={setTerminalView}
              candles={candles}
              ticker={ticker}
              trades={trades}
              selectedPair={selectedPair}
              positionsExpanded={positionsExpanded}
              setPositionsExpanded={setPositionsExpanded}
              mobileTab={mobileTab}
              isOrderPanelExpanded={isOrderPanelExpanded}
              setIsOrderPanelExpanded={setIsOrderPanelExpanded}
              rightPanelOpen={rightPanelOpen}
              setRightPanelOpen={setRightPanelOpen}
              investment={investment}
              setInvestment={setInvestment}
              duration={duration}
              accountType={accountType}
              setAssetSelectorOpen={setAssetSelectorOpen}
              setActiveSideTab={setActiveSideTab}
              setMobileTab={setMobileTab}
            />
          )}

          {activeSideTab === 'finances' && (
            <WalletDashboard onBack={() => setActiveSideTab('trade')} initialTab={walletTab as any} userData={userData} />
          )}

          {activeSideTab === 'social' && (
            <CopyTradingHub onBack={() => setActiveSideTab('trade')} />
          )}

          {activeSideTab === 'profile' && (
            <ProfilePage onBack={() => setActiveSideTab('trade')} navigateTo={navigateTo} />
          )}

          {activeSideTab === 'settings' && (
            <SettingsPage onBack={() => setActiveSideTab('trade')} />
          )}

          {(activeSideTab === 'education' || activeSideTab === 'help') && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[hsl(var(--color-bg))]">
               <div className="w-20 h-20 rounded-full bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] flex items-center justify-center mb-6">
                 <BookOpen className="w-9 h-9 text-[hsl(var(--secondary-400))]" />
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-widest italic mb-2">Learn & Support</h3>
               <p className="text-zinc-600 text-sm max-w-md">
                 Education content and help resources are currently being updated.
               </p>
               <button 
                 onClick={() => setActiveSideTab('trade')}
                 className="mt-8 text-[10px] font-black uppercase tracking-widest text-[hsl(var(--secondary-400))] hover:text-[hsl(var(--secondary-300))] transition-all outline-none focus-visible:underline"
               >
                 ← Back to Trading
               </button>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden">
        <RightPanel ticker={ticker} symbol={selectedPair.symbol} isOpen={rightPanelOpen} onToggle={() => setRightPanelOpen(false)} />
      </div>

      {activeSideTab === 'trade' && (
        <MobileTradeNav activeTab={mobileTab} onTabChange={setMobileTab} />
      )}

      <div className="h-14 md:hidden shrink-0" />
    </div>
  );
};

export default Trading;
