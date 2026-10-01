import React from 'react';
import { View } from '../App';
import { Rocket } from 'lucide-react';

interface HeroProps {
  navigateTo: (view: View) => void;
}

const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  const cryptoAssets = [
    { name: 'Bitcoin', symbol: 'BTC', color: 'bg-orange-500' },
    { name: 'Ethereum', symbol: 'ETH', color: 'bg-blue-500' },
    { name: 'Solana', symbol: 'SOL', color: 'bg-purple-500' },
    { name: 'Cardano', symbol: 'ADA', color: 'bg-blue-600' },
    { name: 'Polkadot', symbol: 'DOT', color: 'bg-pink-500' },
  ];

  return (
    <section className="relative pt-32 pb-20 px-4 md:pt-48 md:pb-40 overflow-hidden bg-[hsl(var(--color-bg))]">
      {/* Background Decorative Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none opacity-20">
        <svg className="w-full h-full animate-pulse duration-[10s]" viewBox="0 0 630 611" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#heroFilter)">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M396.199 0.750802C383.159 0.461026 369.245 3.44836 355.841 9.75261L118.886 121.082C92.4239 133.517 71.9454 156.955 65.0963 182.639L2.92934 415.765C-3.91978 441.449 3.89082 465.516 23.448 478.973L198.583 599.47C208.492 606.274 220.658 609.841 233.698 610.13C246.738 610.42 260.642 607.433 274.052 601.147L511 489.808C537.461 477.373 557.94 453.935 564.789 428.251L626.956 195.125C633.805 169.441 625.995 145.374 606.437 131.917L431.309 11.4297C421.396 4.60726 409.239 1.04058 396.199 0.750802" 
              fill="url(#heroGradient)" 
              fillOpacity="0.4"
            />
          </g>
          <defs>
            <filter id="heroFilter" x="-15" y="-15" width="660" height="641" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="20" />
            </filter>
            <linearGradient id="heroGradient" x1="222" y1="607" x2="195" y2="-32" gradientUnits="userSpaceOnUse">
              <stop stopColor="hsl(var(--primary-500))" />
              <stop offset="1" stopColor="hsl(var(--secondary-500))" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Section: Content */}
        <div className="text-center lg:text-left z-10 space-y-8 anim-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
              <span className="italic font-light text-[hsl(var(--color-text-muted))] block mb-2">Investing Is</span>
              <span className="velo-text-gradient block">Even Better Now.</span>
            </h1>
            
            <p className="text-[hsl(var(--color-text-muted))] text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              <strong className="text-white">Providing you with the opportunity to invest</strong> in more than 200 crypto assets for continuous income with zero trading fees.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 py-4">
            <div className="flex -space-x-3" aria-hidden="true">
              {cryptoAssets.map((asset, i) => (
                <div 
                  key={i} 
                  className={`w-10 h-10 rounded-full ${asset.color} border-2 border-[hsl(var(--color-bg))] flex items-center justify-center text-[10px] font-bold text-white shadow-xl hover:scale-110 hover:z-20 transition-all cursor-help`}
                  title={asset.name}
                >
                  {asset.symbol[0]}
                </div>
              ))}
            </div>
            <div className="bg-[hsl(var(--color-surface)/0.5)] backdrop-blur-md border border-[hsl(var(--color-border))] px-4 py-2 rounded-full">
              <span className="text-sm font-bold text-[hsl(var(--color-text-muted))]">
                +200 <i className="not-italic text-[hsl(var(--secondary-400))]">assets</i>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <button 
              onClick={() => navigateTo('trading')}
              className="w-full sm:w-auto px-10 py-5 velo-gradient rounded-2xl text-lg font-black text-white shadow-2xl shadow-[hsl(var(--primary-500)/0.4)] hover:scale-105 active:scale-95 transition-all text-center uppercase tracking-widest outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--primary-500)/0.5)]"
            >
              Start Trading Now
            </button>
            <button 
              onClick={() => navigateTo('trading')}
              className="w-full sm:w-auto px-10 py-5 bg-[hsl(var(--color-surface)/0.5)] backdrop-blur-md border border-[hsl(var(--color-border))] rounded-2xl text-lg font-black text-[hsl(var(--color-text-muted))] hover:text-white hover:bg-[hsl(var(--color-surface)/0.8)] transition-all text-center uppercase tracking-widest shadow-xl outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--color-border))]"
            >
              Try Free Demo
            </button>
          </div>
        </div>

        {/* Right Section: Visual Graphics */}
        <div className="relative flex items-center justify-center" aria-hidden="true">
          <div className="relative w-full max-w-[500px] aspect-square">
            <div className="absolute inset-0 bg-[hsl(var(--color-surface)/0.4)] backdrop-blur-2xl border border-[hsl(var(--color-border)/0.5)] rounded-[3rem] shadow-[0_0_100px_rgba(124,58,237,0.15)] overflow-hidden float-animation">
              <div className="p-6 border-b border-[hsl(var(--color-border)/0.5)] flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--danger)/0.5)]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--warning)/0.5)]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--success)/0.5)]"></div>
                </div>
                <div className="text-[10px] font-bold text-[hsl(var(--color-text-muted))] tracking-widest uppercase">Live Marketplace</div>
              </div>
              
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 rounded-2xl bg-[hsl(var(--color-bg)/0.5)] border border-[hsl(var(--color-border)/0.5)] hover:border-[hsl(var(--primary-500)/0.3)] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center font-bold text-zinc-500 group-hover:text-[hsl(var(--secondary-400))] transition-colors">#0{item}</div>
                      <div>
                        <div className="h-2 w-24 bg-zinc-800 rounded-full mb-2"></div>
                        <div className="h-1.5 w-16 bg-zinc-900 rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-2 w-12 bg-[hsl(var(--success)/0.2)] rounded-full ml-auto mb-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[hsl(var(--color-surface))] rounded-3xl border border-[hsl(var(--color-border))] shadow-2xl flex items-center justify-center rotate-12 float-animation delay-700">
               <Rocket className="w-10 h-10 text-[hsl(var(--primary-400))]" />
            </div>
            <div className="absolute -bottom-10 right-10 p-6 bg-[hsl(var(--color-surface)/0.8)] backdrop-blur-xl border border-[hsl(var(--color-border))] rounded-3xl shadow-2xl float-animation delay-300">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--success))] animate-pulse"></div>
                <span className="text-xs font-bold text-[hsl(var(--color-text-muted))]">Experts Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

