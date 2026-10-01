import React, { useState, useEffect } from 'react';
import { View } from '../App';
import { useAuth } from '../context/AuthContext';
import { Terminal, LogOut, X, Menu, Shield, TrendingUp, HelpCircle, User, ArrowRight } from 'lucide-react';

interface HeaderProps {
  isScrolled: boolean;
  navigateTo: (view: View) => void;
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ isScrolled, navigateTo, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userData, signOut } = useAuth();

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (currentView !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${
        isScrolled || currentView !== 'home'
          ? 'bg-zinc-950/85 backdrop-blur-2xl border-b border-zinc-800/80 shadow-2xl py-3.5' 
          : 'bg-gradient-to-b from-zinc-950/70 to-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between relative">
        
        {/* Left Section: Menu Toggle (Mobile) & Navigation (Desktop) */}
        <div className="flex items-center gap-6 z-10">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 active:scale-95 transition-all text-zinc-300 hover:text-white lg:hidden outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Menu</span>
          </button>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            <button 
              onClick={() => scrollToSection('markets')} 
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all relative py-1 group outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
            >
              Markets
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              onClick={() => scrollToSection('copytrading')} 
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all relative py-1 group outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
            >
              Copy Trading
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              onClick={() => scrollToSection('education')} 
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all relative py-1 group outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
            >
              Education
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              onClick={() => navigateTo('faq')} 
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative py-1 group outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded ${currentView === 'faq' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              FAQ
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 ${currentView === 'faq' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </button>
          </nav>
        </div>

        {/* Center Section: Logo & Live Status Indicator */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1 transition-transform active:scale-95" 
            aria-label="Velo Home"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-full h-full velo-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/20">
                <span className="text-white font-black text-base sm:text-lg italic">V</span>
              </div>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-cyan-400 transition-colors italic leading-none">
                VELO<span className="text-cyan-400">.</span>
              </span>
              <span className="text-[8px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none mt-0.5 hidden xs:block">
                Institutional
              </span>
            </div>
          </button>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800 text-[9px] font-bold text-zinc-400 ml-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>0% Fee Engine • KuCoin Realtime Feed</span>
          </div>
        </div>

        {/* Right Section: Auth & Terminal Launch */}
        <div className="flex items-center gap-3 z-10">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => navigateTo('trading')}
                className="velo-gradient px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.15em] border border-white/20 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Terminal</span>
              </button>

              <button 
                onClick={signOut}
                className="hidden sm:flex text-[10px] font-bold px-3 py-2 transition-all uppercase tracking-widest rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => navigateTo('login')}
                className={`text-[10px] sm:text-[11px] font-black px-4 sm:px-5 py-2 sm:py-2.5 transition-all uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-900 text-zinc-300 hover:text-white border border-transparent hover:border-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 ${currentView === 'login' ? 'text-white bg-zinc-900 border-zinc-800' : ''}`}
              >
                Login
              </button>
              <button 
                onClick={() => navigateTo('register')}
                className="velo-gradient px-5 sm:px-7 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black text-white shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.15em] border border-white/20 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                Join Now
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Upgraded Full Mobile Navigation Drawer */}
      <div 
        id="mobile-menu"
        className={`lg:hidden fixed inset-0 top-[60px] bg-zinc-950/95 backdrop-blur-3xl transition-all duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)] z-[95] overflow-y-auto ${
          isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-6 flex flex-col gap-6 min-h-[calc(100vh-60px)] justify-between max-w-md mx-auto">
          
          {/* User Session Banner (if logged in) */}
          {user && (
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl velo-gradient flex items-center justify-center text-white font-black text-sm shadow-md">
                  {(userData?.displayName || user.displayName || user.email || 'V').charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-white truncate max-w-[160px]">
                    {userData?.displayName || user.displayName || 'Velo Trader'}
                  </span>
                  <span className="text-[10px] text-zinc-500 truncate max-w-[160px]">
                    {user.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { signOut(); setIsMenuOpen(false); }}
                className="text-[10px] font-black uppercase tracking-wider text-rose-400 hover:text-rose-300 p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-colors flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 px-3">Navigation</span>
            {[
              { label: 'Home View', action: () => { navigateTo('home'); setIsMenuOpen(false); }, icon: Shield },
              { label: 'Live Markets', action: () => scrollToSection('markets'), icon: TrendingUp },
              { label: 'Copy Trading', action: () => scrollToSection('copytrading'), icon: User },
              { label: 'Education & Academy', action: () => scrollToSection('education'), icon: Shield },
              { label: 'Frequent Questions', action: () => { navigateTo('faq'); setIsMenuOpen(false); }, icon: HelpCircle },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-base font-black text-zinc-200 group-hover:text-white uppercase tracking-tight">
                      {item.label}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </button>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 pt-4 border-t border-zinc-900">
            {user ? (
              <button 
                onClick={() => { navigateTo('trading'); setIsMenuOpen(false); }} 
                className="w-full py-4 rounded-2xl velo-gradient text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 border border-white/20 active:scale-98 transition-transform"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch Trading Terminal</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2.5">
                <button 
                  onClick={() => { navigateTo('register'); setIsMenuOpen(false); }} 
                  className="w-full py-4 rounded-2xl velo-gradient text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 border border-white/20"
                >
                  Create Free Account
                </button>
                <button 
                  onClick={() => { navigateTo('login'); setIsMenuOpen(false); }} 
                  className="w-full py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white"
                >
                  Log In to Existing Account
                </button>
              </div>
            )}

            <div className="p-3 rounded-xl bg-zinc-900/30 text-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              Zero Fees • Instant Settlement • 250+ Global Markets
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;

