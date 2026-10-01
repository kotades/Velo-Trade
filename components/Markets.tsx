import React, { useState } from 'react';
import { View } from '../App';
import { TOP_STOCKS } from '../data/stocks';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MarketsProps {
  navigateTo?: (view: View) => void;
}

const Markets: React.FC<MarketsProps> = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState<'stocks' | 'crypto' | 'commodities'>('stocks');

  const cryptoAssets = [
    { name: 'Bitcoin', symbol: 'BTC', price: '$94,120.50', change: '+2.85%', trend: 'up', logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
    { name: 'Ethereum', symbol: 'ETH', price: '$3,410.12', change: '+1.40%', trend: 'up', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { name: 'Solana', symbol: 'SOL', price: '$182.89', change: '+5.60%', trend: 'up', logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
    { name: 'Ripple', symbol: 'XRP', price: '$2.38', change: '+4.15%', trend: 'up', logo: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  ];

  const commoditiesAssets = [
    { name: 'Gold Spot', symbol: 'XAU/USD', price: '$2,785.40', change: '+0.65%', trend: 'up', icon: '🥇' },
    { name: 'Silver Spot', symbol: 'XAG/USD', price: '$31.80', change: '-0.42%', trend: 'down', icon: '🥈' },
    { name: 'Crude Oil', symbol: 'WTI', price: '$72.45', change: '+1.15%', trend: 'up', icon: '🛢️' },
  ];

  const handleAssetClick = () => {
    if (navigateTo) navigateTo('trading');
  };

  return (
    <section id="markets" className="py-24 sm:py-32 bg-[hsl(var(--color-bg))] relative border-t border-[hsl(var(--color-border)/0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 anim-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
            Institutional Coverage
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 uppercase italic leading-none tracking-tight">
            Institutional <span className="velo-text-gradient inline-block">Markets</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mb-8 font-medium">
            Trade top global US equities, decentralized prediction markets, crypto pairs, and spot commodities with 0% commission.
          </p>

          <div className="inline-flex p-1.5 bg-zinc-900/80 rounded-2xl border border-zinc-800 gap-1 sm:gap-2 backdrop-blur-xl">
            {(['stocks', 'crypto', 'commodities'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  activeTab === tab 
                  ? 'velo-gradient text-white shadow-lg shadow-indigo-500/25 border border-white/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {tab === 'stocks' ? 'US Stocks' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/40 rounded-3xl border border-zinc-800/80 overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/70">
                  <th className="px-6 sm:px-10 py-5 text-[10px] sm:text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Asset</th>
                  <th className="px-6 sm:px-10 py-5 text-[10px] sm:text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Price</th>
                  <th className="px-6 sm:px-10 py-5 text-[10px] sm:text-xs font-black text-zinc-400 uppercase tracking-[0.2em] text-right">24h Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {activeTab === 'stocks' && TOP_STOCKS.slice(0, 6).map((stock) => {
                  const isUp = stock.change_24h_percent >= 0;
                  return (
                    <tr 
                      key={stock.ticker_symbol} 
                      onClick={handleAssetClick}
                      className="hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                      title={`Trade ${stock.company_name} on Velo`}
                    >
                      <td className="px-6 sm:px-10 py-5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <img 
                            src={stock.company_logo_url} 
                            alt={stock.company_name}
                            className="w-10 h-10 rounded-xl bg-white p-1.5 object-contain shadow-md border border-zinc-700/50 shrink-0 group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div>
                            <div className="text-sm sm:text-base font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{stock.company_name}</div>
                            <div className="text-[10px] font-bold text-zinc-400">{stock.ticker_symbol} • {stock.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 sm:px-10 py-5 text-sm sm:text-base font-black text-white tracking-tight">
                        ${stock.current_price.toFixed(2)}
                      </td>
                      <td className={`px-6 sm:px-10 py-5 text-right font-black text-xs sm:text-sm ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <div className="flex items-center justify-end gap-1">
                          {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{isUp ? '+' : ''}{stock.change_24h_percent.toFixed(2)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {activeTab === 'crypto' && cryptoAssets.map((asset) => (
                  <tr 
                    key={asset.symbol} 
                    onClick={handleAssetClick}
                    className="hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                    title={`Trade ${asset.name} on Velo`}
                  >
                    <td className="px-6 sm:px-10 py-5">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img 
                          src={asset.logo} 
                          alt={asset.name}
                          className="w-9 h-9 rounded-full bg-zinc-800 p-1 object-contain shadow-md border border-zinc-700/50 shrink-0 group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <div className="text-sm sm:text-base font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{asset.name}</div>
                          <div className="text-[10px] font-bold text-zinc-400">{asset.symbol} / USDT</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-10 py-5 text-sm sm:text-base font-black text-white tracking-tight">{asset.price}</td>
                    <td className={`px-6 sm:px-10 py-5 text-right font-black text-xs sm:text-sm ${asset.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {asset.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {asset.change}
                      </div>
                    </td>
                  </tr>
                ))}

                {activeTab === 'commodities' && commoditiesAssets.map((asset) => (
                  <tr 
                    key={asset.symbol} 
                    onClick={handleAssetClick}
                    className="hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                    title={`Trade ${asset.name} on Velo`}
                  >
                    <td className="px-6 sm:px-10 py-5">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-lg shadow-md border border-zinc-700/50 shrink-0">
                          {asset.icon}
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{asset.name}</div>
                          <div className="text-[10px] font-bold text-zinc-400">{asset.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-10 py-5 text-sm sm:text-base font-black text-white tracking-tight">{asset.price}</td>
                    <td className={`px-6 sm:px-10 py-5 text-right font-black text-xs sm:text-sm ${asset.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {asset.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {asset.change}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-5 sm:p-6 bg-zinc-900/60 border-t border-zinc-800 text-center">
             <button 
               onClick={handleAssetClick}
               className="text-xs sm:text-sm font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-[0.2em] outline-none focus-visible:underline"
             >
               Launch All Markets in Terminal →
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Markets;
