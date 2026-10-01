import React from 'react';
import { View } from '../App';

interface FooterProps {
  navigateTo: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigateTo('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="relative bg-[hsl(var(--color-bg))] border-t border-[hsl(var(--color-border))] pt-32 pb-16 overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--primary-500))]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Logo and Intro */}
          <div className="lg:col-span-4 space-y-8">
            <button onClick={() => navigateTo('home')} className="flex items-center gap-4 group" aria-label="Go to home">
              <span className="text-4xl font-black tracking-tighter text-white group-hover:text-[hsl(var(--secondary-500))] transition-all duration-500 italic">
                VELO<span className="text-[hsl(var(--secondary-500))]">.</span>
              </span>
            </button>
            <p className="text-[hsl(var(--color-text-muted))] text-base leading-relaxed max-w-sm font-medium">
              Velo is the premier zero-fee institutional-grade trading ecosystem. We empower the next generation of global traders by bridging the gap between expert strategies and beginner portfolios.
            </p>
            <div className="flex gap-5 pt-4" aria-label="Social links">
              {[
                { name: 'Facebook', href: 'https://facebook.com', d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { name: 'Instagram', href: 'https://instagram.com', d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" },
                { name: 'Twitter', href: 'https://x.com', d: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" }
              ].map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[hsl(var(--secondary-500))/0.5] hover:bg-white/10 transition-all cursor-pointer group">
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d={social.d}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-12">
            {[
              { title: 'Home', links: [{ label: 'Trading Terminal', view: 'trading' }, { label: 'Login', view: 'login' }, { label: 'Register', view: 'register' }] },
              { title: 'Trading', links: [{ label: 'Asset Markets', section: 'markets' }, { label: 'Copy Trading', section: 'copytrading' }, { label: 'Platform FAQ', view: 'faq' }] },
              { title: 'Academy', links: [{ label: 'How to Trade', section: 'education' }, { label: 'Strategies', section: 'education' }, { label: 'Knowledge Base', view: 'faq' }] },
              { title: 'Legal', links: [{ label: 'Terms of Service', view: 'terms' }, { label: 'Privacy Policy', view: 'privacy' }, { label: 'Regulatory Framework', view: 'regulation' }] }
            ].map((col) => (
              <div key={col.title} className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">{col.title}</h3>
                <ul className="space-y-4 text-sm font-bold text-[hsl(var(--color-text-muted))]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button 
                        onClick={() => {
                          if (link.view) navigateTo(link.view as any);
                          else if (link.section) scrollToSection(link.section);
                        }} 
                        className="hover:text-white hover:translate-x-1 transition-all duration-300 block text-left outline-none focus-visible:text-white focus-visible:underline"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Partners & Secure Section */}
        <div className="flex flex-col md:flex-row items-center justify-between py-16 border-y border-[hsl(var(--color-border))] gap-12">
          <div className="flex flex-col gap-6 items-center md:items-start w-full md:w-auto">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] italic">Institutional Partners</div>
            <div className="flex flex-wrap justify-center md:justify-start gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <div className="h-6 w-24 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-lg" />
              <div className="h-6 w-32 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-lg" />
              <div className="h-6 w-20 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-lg" />
            </div>
          </div>
          <div className="flex flex-col gap-6 items-center md:items-end w-full md:w-auto">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] italic">Zero-Latency Infrastructure</div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 opacity-30">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="h-10 w-16 bg-white/5 border border-white/10 rounded-xl" />
               ))}
            </div>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="py-16">
          <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
            <p className="text-[11px] leading-relaxed text-zinc-400 text-center font-bold max-w-5xl mx-auto uppercase tracking-tighter">
              Risk Warning: Trading and investing involves significant level of risk and is not suitable and/or appropriate for all clients. Please make sure you carefully consider your investment objectives, level of experience and risk appetite before buying or selling. Buying or selling entails financial risks and could result in a partial or complete loss of your funds, therefore, you should not invest funds you cannot afford to lose. You should be aware of and fully understand all the risks associated with trading and investing, and seek advice from an independent financial advisor if you have any doubts.
            </p>
            <p className="text-[10px] text-zinc-400 text-center mt-8 font-black tracking-[0.4em] uppercase italic">
              VELO LABS LLC • KINGSTOWN, ST. VINCENT AND THE GRENADINES
            </p>
          </div>
        </div>

        {/* Final Copyright Row */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[hsl(var(--color-border)/0.5)] pt-12 gap-8">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">
            © 2014–2026 VELO TRADING GROUP. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-10">
            {[
              { label: 'Privacy', view: 'privacy' as View },
              { label: 'Regulation', view: 'regulation' as View },
              { label: 'Terms', view: 'terms' as View }
            ].map((item) => (
              <button 
                key={item.label}
                onClick={() => navigateTo(item.view)} 
                className="text-[10px] font-black text-zinc-400 hover:text-[hsl(var(--secondary-500))] uppercase tracking-[0.3em] transition-all outline-none focus-visible:underline"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
