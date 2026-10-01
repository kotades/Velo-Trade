import React from 'react';
import { TrendingUp, Users, Layers, MoreHorizontal } from 'lucide-react';

export type MobileTab = 'trade' | 'social' | 'positions' | 'more';

interface MobileTradeNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

const tabs: { id: MobileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'trade', label: 'Terminal', icon: TrendingUp },
  { id: 'social', label: 'Copy Hub', icon: Users },
  { id: 'positions', label: 'Ledger', icon: Layers },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

const MobileTradeNav: React.FC<MobileTradeNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800/80 safe-area-bottom shadow-2xl">
      <div className="flex items-center justify-around h-14 px-2" role="tablist">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={isActive}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 active:scale-90 ${
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
              <span className="text-[8px] uppercase tracking-widest leading-none mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTradeNav;
