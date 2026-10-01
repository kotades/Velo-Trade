import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart2, Wallet, Users, Settings, LogOut } from 'lucide-react';

interface SideNavigationProps {
  activeSideTab: string;
  setActiveSideTab: (tab: string) => void;
  setMobileTab: (tab: any) => void;
  setWalletTab: (tab: 'overview' | 'deposit') => void;
}

const SIDE_TABS = [
  { id: 'trade', label: 'Trade', icon: BarChart2 },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const SideNavigation: React.FC<SideNavigationProps> = ({ activeSideTab, setActiveSideTab, setMobileTab, setWalletTab }) => {
  const { signOut } = useAuth();

  const handleTabClick = (tabId: string) => {
    setActiveSideTab(tabId);
    if (tabId === 'trade') setMobileTab('trade');
    if (tabId === 'wallet') setWalletTab('overview');
  };

  return (
    <nav aria-label="Desktop Side Navigation" className="hidden md:flex w-16 border-r border-[hsl(var(--color-border))] flex-col items-center py-6 gap-8 z-30 bg-[hsl(var(--color-bg))] shrink-0">
      <div className="flex flex-col items-center gap-6 w-full px-2">
        {SIDE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSideTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-10 h-10 md:w-12 md:h-12 flex flex-col items-center justify-center rounded-xl transition-all relative group outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary-500))] ${
                isActive 
                  ? 'bg-[hsl(var(--primary-500)/0.15)] text-[hsl(var(--primary-500))]' 
                  : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50'
              }`}
              title={tab.label}
            >
              {isActive && (
                <div className="absolute left-[-8px] md:left-[-6px] top-1/4 bottom-1/4 w-1 bg-[hsl(var(--primary-500))] rounded-r-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
              )}
              <Icon className="w-5 h-5 mb-1 transition-transform group-hover:scale-110" />
              <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-tighter transition-all ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 md:gap-6 w-full px-2">
        <button 
          onClick={signOut}
          className="w-10 h-10 md:w-12 md:h-12 flex flex-col items-center justify-center rounded-xl text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100">Exit</span>
        </button>
      </div>
    </nav>
  );
};

export default SideNavigation;

