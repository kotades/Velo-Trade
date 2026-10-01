import React from 'react';
import { BarChart2, TrendingUp, Scale, Bot, Users, Wallet } from 'lucide-react';

export type MobileTab = 'trade' | 'stocks' | 'predictions' | 'strategies' | 'social' | 'wallet' | 'finances' | 'positions' | 'more';

interface MobileTradeNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'trade', label: 'Terminal', icon: BarChart2 },
  { id: 'stocks', label: 'Stocks', icon: TrendingUp },
  { id: 'predictions', label: 'Predict', icon: Scale },
  { id: 'strategies', label: 'Bots', icon: Bot },
  { id: 'social', label: 'Copy Hub', icon: Users },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
];

const MobileTradeNav: React.FC<MobileTradeNavProps> = ({ activeTab, onTabChange }) => {
  const normalizedActive = activeTab === 'finances' ? 'wallet' : activeTab;

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/80 pb-safe shadow-2xl">
      <div className="flex items-center justify-around overflow-x-auto no-scrollbar px-1 h-14" role="tablist">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = normalizedActive === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={isActive}
              className={`relative flex flex-col items-center justify-center flex-1 min-w-[52px] h-full py-1 px-1 rounded-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-90 shrink-0 ${
                isActive
                  ? 'text-cyan-400 font-black'
                  : 'text-zinc-500 hover:text-zinc-300 active:text-zinc-200 font-bold'
              }`}
            >
              {/* Active Top Glow Bar */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[8px] uppercase tracking-wider leading-none mt-0.5 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTradeNav;
