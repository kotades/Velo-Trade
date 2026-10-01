
import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Enter Details",
      description: "Fill in your personal details in our secure, encrypted online application. It takes less than 5 minutes.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Connect Wallet",
      description: "Link your favorite Web3 wallet (MetaMask, Phantom, or Trust) to securely manage your assets and trade.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Start Trading",
      description: "Choose a top-tier expert to copy or trade 250+ instruments manually with zero fees.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-32 bg-[hsl(var(--color-bg))] border-t border-[hsl(var(--color-border)/0.5)] relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-px h-full bg-[hsl(var(--color-text))]" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-[hsl(var(--color-text))]" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-[hsl(var(--color-text))]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24 anim-fade-in">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase italic leading-none">
            How It <span className="velo-text-gradient inline-block">Works</span>
          </h2>
          <p className="text-[hsl(var(--color-text-muted))] text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Starting your wealth-building journey with Velo is designed to be as frictionless as possible.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row items-start justify-between gap-16 lg:gap-32">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-[hsl(var(--color-border)/0.3)] z-0">
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-[hsl(var(--primary-500)/0.5)] to-transparent" />
          </div>

          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`relative z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left group anim-fade-in delay-${(idx + 1) * 100}`}
            >
              <div className="relative mb-10">
                {/* Step Circle */}
                <div className="w-32 h-32 rounded-[2.5rem] bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] flex items-center justify-center transition-all duration-500 group-hover:border-[hsl(var(--secondary-500)/0.5)] group-hover:bg-[hsl(var(--color-surface)/0.8)] shadow-2xl relative float-animation">
                  <div className="text-[hsl(var(--secondary-400))] group-hover:text-white transition-colors duration-500">
                    {step.icon}
                  </div>
                  {/* Badge Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl velo-gradient flex items-center justify-center text-white text-sm font-black shadow-2xl border-2 border-[hsl(var(--color-bg))]">
                    {step.number}
                  </div>
                </div>
              </div>

              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight group-hover:text-[hsl(var(--primary-400))] transition-colors duration-300">
                {step.title}
              </h3>
              
              <p className="text-[hsl(var(--color-text-muted))] text-lg font-medium leading-relaxed max-w-[320px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[hsl(var(--primary-500)/0.05)] border border-[hsl(var(--primary-500)/0.1)] text-[hsl(var(--primary-400))] text-sm font-black uppercase tracking-[0.2em] anim-shake">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Scroll to see instruments
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

