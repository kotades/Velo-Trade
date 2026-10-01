import React, { useState } from 'react';
import { View } from '../App';

interface MarketsProps {
  navigateTo?: (view: View) => void;
}

const Markets: React.FC<MarketsProps> = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState<'crypto' | 'commodities' | 'stocks'>('crypto');

  const assets = {
    crypto: [
      { name: 'Bitcoin', symbol: 'BTC', price: '$64,120.50', change: '+1.2%', trend: 'up' },
      { name: 'Ethereum', symbol: 'ETH', price: '$3,410.12', change: '+0.8%', trend: 'up' },
      { name: 'Solana', symbol: 'SOL', price: '$142.89', change: '-2.4%', trend: 'down' },
      { name: 'Ripple', symbol: 'XRP', price: '$0.62', change: '+5.1%', trend: 'up' },
    ],
    commodities: [
      { name: 'Gold', symbol: 'XAU', price: '$2,150.40', change: '+0.4%', trend: 'up' },
      { name: 'Silver', symbol: 'XAG', price: '$24.12', change: '-1.2%', trend: 'down' },
      { name: 'Crude Oil', symbol: 'WTI', price: '$78.45', change: '+1.5%', trend: 'up' },
    ],
    stocks: [
      { name: 'Apple', symbol: 'AAPL', price: '$182.40', change: '+0.2%', trend: 'up' },
      { name: 'Tesla', symbol: 'TSLA', price: '$175.12', change: '-3.4%', trend: 'down' },
      { name: 'Nvidia', symbol: 'NVDA', price: '$890.45', change: '+2.1%', trend: 'up' },
    ]
  };

  const handleAssetClick = () => {
    if (navigateTo) navigateTo('trading');
  };

  return (
    <section id="markets" className="py-32 bg-[hsl(var(--color-bg))] relative border-t border-[hsl(var(--color-border)/0.5)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 anim-fade-in">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase italic leading-none">
            Live <span className="velo-text-gradient inline-block">Markets</span>
          </h2>
          <div className="inline-flex p-1.5 bg-[hsl(var(--color-surface))] rounded-2xl border border-[hsl(var(--color-border))] gap-2">
            {(['crypto', 'commodities', 'stocks'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  activeTab === tab 
                  ? 'velo-gradient text-white shadow-lg' 
                  : 'text-[hsl(var(--color-text-muted))] hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[hsl(var(--color-surface)/0.3)] rounded-[2.5rem] border border-[hsl(var(--color-border)/0.5)] overflow-hidden backdrop-blur-xl shadow-2xl anim-fade-in">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[hsl(var(--color-border)/0.5)] bg-[hsl(var(--color-surface)/0.5)]">
                  <th className="px-10 py-8 text-xs font-black text-[hsl(var(--color-text-muted))] uppercase tracking-[0.2em]">Asset</th>
                  <th className="px-10 py-8 text-xs font-black text-[hsl(var(--color-text-muted))] uppercase tracking-[0.2em]">Price</th>
                  <th className="px-10 py-8 text-xs font-black text-[hsl(var(--color-text-muted))] uppercase tracking-[0.2em] text-right">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {assets[activeTab].map((asset, idx) => (
                  <tr 
                    key={idx} 
                    onClick={handleAssetClick}
                    className="hover:bg-white/[0.05] transition-colors group cursor-pointer border-b border-[hsl(var(--color-border)/0.2)] last:border-0"
                    title={`Trade ${asset.name} on Velo`}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--color-bg))] border border-[hsl(var(--color-border))] flex items-center justify-center font-black text-[hsl(var(--color-text-muted))] group-hover:text-[hsl(var(--secondary-400))] group-hover:border-[hsl(var(--secondary-400)/0.5)] transition-all duration-300">
                          {asset.symbol[0]}
                        </div>
                        <div>
                          <div className="text-base font-black text-white uppercase tracking-tight">{asset.name}</div>
                          <div className="text-xs font-bold text-[hsl(var(--color-text-muted))]">{asset.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-lg font-black text-white tracking-tight">{asset.price}</td>
                    <td className={`px-10 py-8 text-right font-black text-lg ${asset.trend === 'up' ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
                      <div className="flex items-center justify-end gap-2">
                        {asset.trend === 'up' ? '↑' : '↓'}
                        {asset.change}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-[hsl(var(--color-surface)/0.5)] border-t border-[hsl(var(--color-border)/0.5)] text-center">
             <button 
               onClick={handleAssetClick}
               className="text-sm font-black text-[hsl(var(--primary-400))] hover:text-white transition-colors uppercase tracking-[0.2em] outline-none focus-visible:underline"
             >
               View All Assets in Terminal →
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Markets;

