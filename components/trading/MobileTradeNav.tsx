import React from 'react';
import { BarChart2, Users, ClipboardList, MoreHorizontal } from 'lucide-react';

export type MobileTab = 'trade' | 'social' | 'positions' | 'more';

interface MobileTradeNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

const tabs: { id: MobileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'trade', label: 'Trade', icon: BarChart2 },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'positions', label: 'Positions', icon: ClipboardList },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

const MobileTradeNav: React.FC<MobileTradeNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 safe-area-bottom">
      <div className="flex items-center justify-around h-14" role="tablist">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                activeTab === tab.id
                  ? 'text-cyan-400'
                  : 'text-zinc-600 active:text-zinc-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTradeNav;
