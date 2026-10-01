import React from 'react';
import { View } from '../App';

interface InstrumentsProps {
  navigateTo: (view: View) => void;
}

const Instruments: React.FC<InstrumentsProps> = ({ navigateTo }) => {
  const assets = [
    { name: 'Bitcoin', symbol: 'BTC/USD', price: '$64,231.50', change: '+2.45%', trend: 'up' },
    { name: 'Ethereum', symbol: 'ETH/USD', price: '$3,452.12', change: '+1.82%', trend: 'up' },
    { name: 'Solana', symbol: 'SOL/USD', price: '$145.89', change: '-0.95%', trend: 'down' },
    { name: 'Cardano', symbol: 'ADA/USD', price: '$0.452', change: '+5.12%', trend: 'up' },
    { name: 'Avalanche', symbol: 'AVAX/USD', price: '$34.21', change: '-2.10%', trend: 'down' },
    { name: 'Polkadot', symbol: 'DOT/USD', price: '$7.24', change: '+0.45%', trend: 'up' },
  ];

  return (
    <section className="relative py-32 px-4 bg-[hsl(var(--color-bg))] overflow-hidden" id="instruments">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--secondary-500))]/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-20 anim-fade-in">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-none">
              Global <span className="velo-text-gradient">Instruments</span>
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-xl font-medium leading-relaxed">
              Trade over 250+ institutional-grade digital assets, commodities, and global indices with ultra-low latency and the tightest spreads in the ecosystem.
            </p>
          </div>
          <button 
            onClick={() => navigateTo('register')}
            className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-[hsl(var(--secondary-500))] hover:text-white transition-all duration-300"
          >
            View Full Asset List
            <div className="w-12 h-12 rounded-full border border-[hsl(var(--secondary-500))/0.3] flex items-center justify-center group-hover:bg-[hsl(var(--secondary-500))] group-hover:border-transparent transition-all">
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assets.map((asset, idx) => (
            <div 
              key={idx} 
              className="group relative p-8 rounded-[2.5rem] bg-[hsl(var(--color-surface)/0.4)] border border-[hsl(var(--color-border))] backdrop-blur-xl hover:border-[hsl(var(--secondary-500))/0.5] transition-all duration-500 anim-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Asset Glow Effect */}
              <div className={`absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl ${asset.trend === 'up' ? 'bg-[hsl(var(--success))/0.15]' : 'bg-[hsl(var(--danger))/0.15]'}`} />

              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                  <div className="relative w-16 h-16 rounded-2xl bg-[hsl(var(--color-bg))] flex items-center justify-center border border-[hsl(var(--color-border))] group-hover:border-[hsl(var(--secondary-500))/0.5] transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-2xl font-black text-[hsl(var(--color-text-muted))] group-hover:text-[hsl(var(--secondary-500))] transition-colors italic">
                      {asset.symbol[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-black uppercase tracking-tight italic leading-tight">{asset.name}</h3>
                    <span className="text-[10px] font-black text-[hsl(var(--color-text-muted))] tracking-[0.2em] uppercase">{asset.symbol}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black px-3 py-1 rounded-full ${asset.trend === 'up' ? 'text-[hsl(var(--success))] bg-[hsl(var(--success))/0.1]' : 'text-[hsl(var(--danger))] bg-[hsl(var(--danger))/0.1]'}`}>
                    {asset.change}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div>
                  <span className="block text-[10px] font-black text-[hsl(var(--color-text-muted))] uppercase tracking-[0.3em] mb-2">Live Valuation</span>
                  <span className="text-3xl font-black text-white tracking-tighter leading-none">{asset.price}</span>
                </div>
                <button 
                  onClick={() => navigateTo('register')}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 border ${
                    asset.trend === 'up' 
                    ? 'bg-white/5 text-white border-white/10 hover:bg-[hsl(var(--success))] hover:border-transparent hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                    : 'bg-white/5 text-white border-white/10 hover:bg-[hsl(var(--danger))] hover:border-transparent hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                  }`}
                >
                  Trade
                </button>
              </div>

              {/* Enhanced Sparkline Decor */}
              <div className="mt-10 h-16 w-full overflow-hidden opacity-20 group-hover:opacity-60 transition-all duration-700">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <defs>
                    <linearGradient id={`grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={asset.trend === 'up' ? "hsl(var(--success))" : "hsl(var(--danger))"} stopOpacity="0" />
                      <stop offset="50%" stopColor={asset.trend === 'up' ? "hsl(var(--success))" : "hsl(var(--danger))"} stopOpacity="1" />
                      <stop offset="100%" stopColor={asset.trend === 'up' ? "hsl(var(--success))" : "hsl(var(--danger))"} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d={asset.trend === 'up' ? "M0 15 L10 12 L20 16 L30 10 L40 14 L50 8 L60 12 L70 5 L80 9 L90 2 L100 6" : "M0 5 L10 8 L20 4 L30 12 L40 9 L50 15 L60 11 L70 18 L80 14 L90 19 L100 15"} 
                    fill="none" 
                    stroke={`url(#grad-${idx})`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-2 transition-transform duration-[2s] ease-linear"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instruments;
