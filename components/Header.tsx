import React, { useState } from 'react';
import { View } from '../App';
import { useAuth } from '../context/AuthContext';
import { Terminal, LogOut, X, Menu } from 'lucide-react';

interface HeaderProps {
  isScrolled: boolean;
  navigateTo: (view: View) => void;
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ isScrolled, navigateTo, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${
        isScrolled || currentView !== 'home'
          ? 'bg-[hsl(var(--color-bg)/0.8)] backdrop-blur-2xl border-b border-[hsl(var(--color-border))] py-4' 
          : 'bg-transparent border-b border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
        
        {/* Left Section: Menu & Utilities */}
        <div className="flex items-center gap-6 z-10">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[hsl(var(--secondary-500))/0.5] transition-all group lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between overflow-hidden">
              <span className={`block h-0.5 w-full bg-zinc-400 group-hover:bg-[hsl(var(--secondary-500))] transition-all duration-500 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 w-full bg-zinc-400 group-hover:bg-[hsl(var(--secondary-500))] transition-all duration-500 ${isMenuOpen ? 'opacity-0 translate-x-full' : ''}`} />
              <span className={`block h-0.5 w-full bg-zinc-400 group-hover:bg-[hsl(var(--secondary-500))] transition-all duration-500 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
            <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">Menu</span>
          </button>

          <nav className="hidden lg:flex items-center gap-10" aria-label="Main navigation">
            <button onClick={() => scrollToSection('markets')} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-[hsl(var(--secondary-500))] transition-all duration-300 relative group">
              Markets
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[hsl(var(--secondary-500))] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('copytrading')} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-[hsl(var(--secondary-500))] transition-all duration-300 relative group">
              Copy Trading
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[hsl(var(--secondary-500))] transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('education')} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-[hsl(var(--secondary-500))] transition-all duration-300 relative group">
              Education
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[hsl(var(--secondary-500))] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>
        </div>

        {/* Center Section: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
          <button onClick={() => navigateTo('home')} className="flex items-center gap-3 group" aria-label="Velo Home">
            <div className="relative w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
              {/* Logo Glow */}
              <div className="absolute inset-0 bg-[hsl(var(--primary-500))]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <svg viewBox="0 0 1024 1024" className="w-full h-full drop-shadow-[0_0_15px_rgba(124,58,237,0.3)] relative z-10">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary-500))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary-500))" />
                  </linearGradient>
                </defs>
                <path d="M280.5 320.5C280.5 320.5 450.5 680.5 460.5 690.5C470.5 700.5 420.5 580.5 420.5 580.5L340.5 380.5C340.5 380.5 280.5 320.5 280.5 320.5Z" fill="url(#logoGrad)"/>
                <path d="M210.5 450.5C210.5 450.5 230.5 680.5 450.5 780.5C670.5 880.5 820.5 520.5 820.5 520.5L780.5 480.5L880.5 320.5L980.5 550.5L980.5 550.5L940.5 510.5C940.5 510.5 850.5 980.5 480.5 850.5C110.5 720.5 210.5 450.5 210.5 450.5Z" fill="url(#logoGrad)"/>
              </svg>
            </div>
            <span className="hidden md:block text-2xl font-black tracking-tighter text-white group-hover:text-[hsl(var(--secondary-500))] transition-colors italic">
              VELO<span className="text-[hsl(var(--secondary-500))]">.</span>
            </span>
          </button>
        </div>

        {/* Right Section: Auth */}
        <div className="flex items-center gap-4 z-10">
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigateTo('trading')}
                className="velo-gradient px-6 py-2.5 rounded-2xl text-[10px] font-black text-white shadow-xl shadow-indigo-500/20 hover:shadow-[hsl(var(--primary-500))/0.4] hover:scale-105 active:scale-95 transition-all duration-300 uppercase tracking-[0.2em] border border-white/10 flex items-center gap-2"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Terminal</span>
              </button>
              <button 
                onClick={signOut}
                className="hidden sm:flex text-[10px] font-black px-4 py-2.5 transition-all duration-300 uppercase tracking-[0.2em] rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 items-center gap-1.5"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigateTo('login')}
                className={`hidden sm:block text-[10px] font-black px-6 py-2.5 transition-all duration-300 uppercase tracking-[0.3em] rounded-xl hover:bg-white/5 ${currentView === 'login' ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}
              >
                Login
              </button>
              <button 
                onClick={() => navigateTo('register')}
                className="velo-gradient px-8 py-3 rounded-2xl text-[10px] font-black text-white shadow-xl shadow-indigo-500/20 hover:shadow-[hsl(var(--primary-500))/0.4] hover:scale-105 active:scale-95 transition-all duration-500 uppercase tracking-[0.2em] border border-white/10"
              >
                Join Now
              </button>
            </>
          )}
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      <div 
        id="mobile-menu"
        className={`lg:hidden fixed inset-0 top-0 bg-[hsl(var(--color-bg)/0.95)] backdrop-blur-[50px] transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] z-[90] ${isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible pointer-events-none'}`}
      >
        <div className="flex flex-col items-center gap-10 text-center h-full justify-center p-12">
          {['Home', 'Markets', 'Copy Trade', 'Academy'].map((item, idx) => (
            <button 
              key={item}
              onClick={() => {
                if (item === 'Home') navigateTo('home');
                else scrollToSection(item.toLowerCase().replace(' ', ''));
                setIsMenuOpen(false);
              }} 
              className={`text-5xl font-black transition-all duration-500 uppercase italic tracking-tighter ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <span className="text-zinc-800 hover:text-white hover:velo-text-gradient transition-all">{item}</span>
            </button>
          ))}
          
          {user ? (
            <div className={`flex flex-col gap-3 mt-12 w-full max-w-xs transition-all duration-700 delay-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button 
                onClick={() => { navigateTo('trading'); setIsMenuOpen(false); }} 
                className="w-full px-8 py-4 rounded-2xl velo-gradient text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>Open Terminal</span>
              </button>
              <button 
                onClick={() => { signOut(); setIsMenuOpen(false); }} 
                className="w-full px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className={`flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-xs transition-all duration-700 delay-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button onClick={() => {navigateTo('login'); setIsMenuOpen(false);}} className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">Login</button>
              <button onClick={() => {navigateTo('register'); setIsMenuOpen(false);}} className="w-full px-8 py-5 rounded-2xl velo-gradient text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20">Register</button>
            </div>
          )}
        </div>

        {/* Decorative Background for Mobile Menu */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[hsl(var(--primary-500))]/10 rounded-full blur-[80px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-[hsl(var(--secondary-500))]/10 rounded-full blur-[80px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Close Button Mobile */}
        <button onClick={() => setIsMenuOpen(false)} aria-label="Close navigation menu" className="absolute top-8 right-8 w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-90">
          <X className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
