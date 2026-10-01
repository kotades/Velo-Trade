
import React from 'react';

const CopyTrading: React.FC = () => {
  const experts = [
    { name: 'Alex Rivers', roi: '+248%', risk: 'Medium', followers: '12.4k', img: 'AR' },
    { name: 'Sarah Chen', roi: '+412%', risk: 'High', followers: '8.2k', img: 'SC' },
    { name: 'Marco Velo', roi: '+124%', risk: 'Low', followers: '25.1k', img: 'MV' },
  ];

  return (
    <section id="copytrading" className="py-32 bg-[hsl(var(--color-bg))] relative overflow-hidden border-t border-[hsl(var(--color-border)/0.5)]">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--primary-500)/0.05)] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10 anim-fade-in">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase italic leading-tight">
              Elite <span className="velo-text-gradient inline-block">Copy Trading</span>
            </h2>
            <p className="text-[hsl(var(--color-text-muted))] text-xl font-medium leading-relaxed">
              Skip the learning curve. Follow verified experts and replicate their trades automatically in real-time with our proprietary synchronization engine.
            </p>
          </div>
          <button className="px-10 py-5 bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] rounded-2xl text-xs font-black text-white uppercase tracking-[0.2em] hover:bg-white/5 transition-all shadow-xl hover:shadow-[hsl(var(--primary-500)/0.2)] group">
            Become a Master <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experts.map((expert, idx) => (
            <div 
              key={idx} 
              className={`group p-10 rounded-[3rem] bg-[hsl(var(--color-surface)/0.3)] border border-[hsl(var(--color-border)/0.5)] hover:border-[hsl(var(--primary-500)/0.5)] transition-all duration-500 backdrop-blur-xl shadow-2xl anim-fade-in delay-${(idx + 1) * 100}`}
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-3xl velo-gradient flex items-center justify-center text-3xl font-black text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {expert.img}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-[hsl(var(--secondary-400))] transition-colors">{expert.name}</h3>
                  <span className="text-xs font-bold text-[hsl(var(--color-text-muted))] uppercase tracking-[0.2em]">{expert.followers} Followers</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-10">
                <div className="p-6 rounded-[2rem] bg-[hsl(var(--color-bg)/0.5)] border border-[hsl(var(--color-border)/0.5)] group-hover:border-[hsl(var(--secondary-500)/0.3)] transition-all">
                  <span className="block text-[10px] font-black text-[hsl(var(--color-text-muted))] uppercase tracking-widest mb-2">Total ROI</span>
                  <span className="text-2xl font-black text-[hsl(var(--success))]">{expert.roi}</span>
                </div>
                <div className="p-6 rounded-[2rem] bg-[hsl(var(--color-bg)/0.5)] border border-[hsl(var(--color-border)/0.5)] group-hover:border-[hsl(var(--secondary-500)/0.3)] transition-all">
                  <span className="block text-[10px] font-black text-[hsl(var(--color-text-muted))] uppercase tracking-widest mb-2">Risk Level</span>
                  <span className={`text-2xl font-black ${
                    expert.risk === 'High' ? 'text-[hsl(var(--danger))]' : 
                    expert.risk === 'Medium' ? 'text-[hsl(var(--warning))]' : 
                    'text-[hsl(var(--secondary-400))]'
                  }`}>
                    {expert.risk}
                  </span>
                </div>
              </div>

              <button className="w-full py-5 rounded-2xl bg-[hsl(var(--color-surface))] text-white font-black uppercase text-xs tracking-[0.2em] group-hover:velo-gradient shadow-lg transition-all duration-300">
                Copy Trades
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CopyTrading;

