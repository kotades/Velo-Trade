import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { label: 'Trading Volume', value: '$1.2B+', accent: 'text-[hsl(var(--primary-400))]' },
    { label: 'Active Experts', value: '450+', accent: 'text-[hsl(var(--primary-400))]' },
    { label: 'Happy Users', value: '520k+', accent: 'text-[hsl(var(--secondary-400))]' },
    { label: 'Trading Fees', value: '$0', accent: 'text-[hsl(var(--success))]' },
  ];

  return (
    <section className="py-24 border-y border-[hsl(var(--color-border)/0.5)] bg-[hsl(var(--color-surface)/0.3)] backdrop-blur-md relative overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute -left-1/4 top-0 w-1/2 h-full bg-[hsl(var(--primary-500)/0.03)] blur-[100px] rounded-full"></div>
      <div className="absolute -right-1/4 top-0 w-1/2 h-full bg-[hsl(var(--secondary-500)/0.03)] blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group anim-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <p className={`text-4xl md:text-6xl font-black mb-3 transition-all duration-500 group-hover:scale-110 tracking-tighter ${stat.accent}`}>
                {stat.value}
              </p>
              <p className="text-[hsl(var(--color-text-muted))] text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

