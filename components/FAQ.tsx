import React, { useState } from 'react';
import { View } from '../App';

interface FAQProps {
  navigateTo?: (view: View) => void;
}

const FAQ: React.FC<FAQProps> = ({ navigateTo }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Velo Trading?",
      a: "Velo is a cutting-edge social trading platform that allows beginners to copy the trades of experienced crypto experts with zero commissions or hidden fees."
    },
    {
      q: "Is it really free to trade?",
      a: "Yes. Velo charges $0 in commissions for crypto trades. We earn revenue through institutional partnerships and premium feature sets, ensuring the core trading experience remains accessible to everyone."
    },
    {
      q: "How does Copy Trading work?",
      a: "Copy trading allows you to automatically mirror the positions taken by a master trader. When they buy or sell, your account executes the same trade proportionally based on your allocated funds."
    },
    {
      q: "What assets can I trade?",
      a: "You can trade over 250 assets, including major cryptocurrencies like Bitcoin and Ethereum, as well as high-growth altcoins, commodities, and global indices."
    },
    {
      q: "How do I withdraw my profits?",
      a: "Withdrawals are processed instantly through your connected Web3 wallet. Simply navigate to your dashboard and click 'Withdraw' to move funds back to your personal wallet."
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. We use industry-standard encryption and non-custodial wallet connections, meaning we never have direct access to your private keys. Your assets stay in your control."
    }
  ];

  return (
    <section className="relative py-32 px-4 bg-[hsl(var(--color-bg))] overflow-hidden" id="faq">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--primary-500))]/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[hsl(var(--secondary-500))]/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20 anim-fade-in">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">
            Frequent <span className="velo-text-gradient">Questions</span>
          </h2>
          <p className="text-[hsl(var(--color-text-muted))] font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about the Velo ecosystem. Master the markets with our comprehensive guide.
          </p>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="group relative rounded-[2rem] border transition-all duration-500 anim-fade-in"
              style={{ 
                animationDelay: `${idx * 100}ms`,
                backgroundColor: openIndex === idx ? 'rgba(255, 255, 255, 0.03)' : 'hsl(var(--color-surface) / 0.4)',
                borderColor: openIndex === idx ? 'hsl(var(--secondary-500) / 0.4)' : 'hsl(var(--color-border))',
              }}
            >
              {/* Active Glow */}
              {openIndex === idx && (
                <div className="absolute inset-0 bg-[hsl(var(--secondary-500))]/5 rounded-[2rem] blur-xl -z-10" />
              )}

              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
              >
                <span className={`text-xl font-bold transition-all duration-300 tracking-tight ${openIndex === idx ? 'text-[hsl(var(--secondary-500))]' : 'text-white group-hover:text-[hsl(var(--secondary-500))]'}`}>
                  {faq.q}
                </span>
                
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 ${openIndex === idx ? 'bg-[hsl(var(--secondary-500))] rotate-180' : 'bg-white/5 group-hover:bg-white/10'}`}>
                  {/* Plus/Minus Icon Transformation */}
                  <div className={`absolute w-5 h-0.5 bg-white transition-all duration-300 ${openIndex === idx ? 'scale-0' : ''}`} />
                  <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${openIndex === idx ? '' : 'rotate-90'}`} />
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${openIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-8 pb-10 pt-2">
                  <div className="h-px w-full bg-white/5 mb-8" />
                  <p className="text-[hsl(var(--color-text-muted))] text-lg font-medium leading-relaxed max-w-3xl">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-24 p-1 rounded-[3rem] bg-gradient-to-br from-[hsl(var(--primary-500))/0.3] to-[hsl(var(--secondary-500))/0.3] anim-fade-in delay-500">
          <div className="bg-[hsl(var(--color-bg))] rounded-[2.8rem] p-12 md:p-16 text-center border border-white/5 relative overflow-hidden group">
            {/* Hover Shine Effect */}
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-1000 -z-10" />
            
            <h3 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">
              Still have <span className="velo-text-gradient">questions?</span>
            </h3>
            <p className="text-[hsl(var(--color-text-muted))] font-medium text-lg mb-10 max-w-xl mx-auto">
              Our expert support team is available 24/7 via live chat and email to assist you with your trading journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@velo-trade.com"
                className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Contact Support
              </a>
              <button 
                onClick={() => navigateTo && navigateTo('trading')}
                className="px-10 py-5 bg-[hsl(var(--color-surface))] text-white border border-[hsl(var(--color-border))] font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/5 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                Launch Terminal
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
