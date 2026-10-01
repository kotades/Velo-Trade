
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Instruments from './components/Instruments';
import Markets from './components/Markets';
import CopyTrading from './components/CopyTrading';
import Education from './components/Education';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import FAQ from './components/FAQ';
import Terms from './components/Terms';
import PrivacyPolicy from './components/PrivacyPolicy';
import Regulation from './components/Regulation';
import Trading from './components/Trading';
import AdminPortal from './components/admin/AdminPortal';
import { useAuth } from './context/AuthContext';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';


export type View = 'home' | 'login' | 'register' | 'faq' | 'terms' | 'privacy' | 'regulation' | 'trading' | 'admin';

const App: React.FC = () => {
  usePerformanceMonitor();
  const [isScrolled, setIsScrolled] = useState(false);

  const [currentView, setCurrentView] = useState<View>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('velo_current_view') as View;
      const validViews: View[] = ['home', 'login', 'register', 'faq', 'terms', 'privacy', 'regulation', 'trading', 'admin'];
      if (saved && validViews.includes(saved)) {
        return saved;
      }
    }
    return 'home';
  });

  const { user, isAdmin, loading } = useAuth();

  // Route Protection & State Synchronization
  useEffect(() => {
    if (loading) return;

    if (currentView === 'admin' && (!user || !isAdmin)) {
      setCurrentView('home');
      if (typeof window !== 'undefined') {
        localStorage.setItem('velo_current_view', 'home');
      }
      return;
    }

    if (user && (currentView === 'login' || currentView === 'register')) {
      setCurrentView('trading');
      if (typeof window !== 'undefined') {
        localStorage.setItem('velo_current_view', 'trading');
      }
    }
  }, [currentView, user, isAdmin, loading]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (view: View) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('velo_current_view', view);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--color-bg))] text-zinc-50 overflow-x-hidden scroll-smooth">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[hsl(var(--primary-500))] focus:text-white focus:rounded-lg transition-all"
      >
        Skip to main content
      </a>

      {/* Dynamic Header - Hidden when in trading/admin mode for full immersion */}
      {currentView !== 'trading' && currentView !== 'admin' && (
        <Header isScrolled={isScrolled} navigateTo={navigateTo} currentView={currentView} />
      )}
      
      <main id="main-content">
        {currentView === 'home' && (
          <>
            <Hero navigateTo={navigateTo} />
            <Stats />
            <Features />
            <HowItWorks />
            <Markets />
            <CopyTrading />
            <Instruments navigateTo={navigateTo} />
            <Education />
          </>
        )}

        {currentView === 'login' && (
          <Login navigateTo={navigateTo} />
        )}

        {currentView === 'register' && (
          <Register navigateTo={navigateTo} />
        )}

        {currentView === 'faq' && (
          <FAQ />
        )}

        {currentView === 'terms' && (
          <Terms navigateTo={navigateTo} />
        )}

        {currentView === 'privacy' && (
          <PrivacyPolicy navigateTo={navigateTo} />
        )}

        {currentView === 'regulation' && (
          <Regulation navigateTo={navigateTo} />
        )}

        {currentView === 'trading' && (
          <Trading navigateTo={navigateTo} />
        )}

        {currentView === 'admin' && isAdmin && (
          <AdminPortal navigateTo={navigateTo} />
        )}
        
        {/* Background Decorative Elements - Only for landing views */}
        {currentView !== 'trading' && currentView !== 'admin' && (
          <>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[hsl(var(--primary-500)/0.05)] blur-[120px] rounded-full pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--secondary-500)/0.05)] blur-[120px] rounded-full pointer-events-none -z-10"></div>
          </>
        )}
      </main>

      {/* Global Footer - Hidden in trading/admin mode */}
      {currentView !== 'trading' && currentView !== 'admin' && (
        <Footer navigateTo={navigateTo} />
      )}
    </div>
  );
};

export default App;
