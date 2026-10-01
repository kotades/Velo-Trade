import React, { useState } from 'react';
import { View } from '../App';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';

import { useRateLimiter } from '../hooks/useRateLimiter';
import { getFriendlyErrorMessage } from '../lib/authErrors';

interface LoginProps {
  navigateTo: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { consume, getRetryAfter } = useRateLimiter({
    key: 'login',
    maxTokens: 5,
    refillRate: 5 / 60000 // 5 tokens per minute
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!consume()) {
      const retryAfter = getRetryAfter();
      setError(`Too many requests. Please try again in ${retryAfter} seconds.`);
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, formData.identifier, formData.password);
      navigateTo('trading');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(getFriendlyErrorMessage(err, 'Invalid email or password. Please verify your credentials and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigateTo('trading');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(getFriendlyErrorMessage(err, 'Google sign-in could not be completed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center relative overflow-hidden bg-[hsl(var(--color-bg))]">
      {/* Decorative Blur */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[hsl(var(--primary-500)/0.15)] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[hsl(var(--secondary-500)/0.15)] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md z-10 anim-fade-in">
        <div className="bg-[hsl(var(--color-surface)/0.4)] backdrop-blur-3xl border border-[hsl(var(--color-border))] rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Welcome Back</h2>
            <p className="text-[hsl(var(--color-text-muted))] font-medium">Log in to your account to continue trading.</p>
            
            {error && (
              <div 
                role="alert" 
                className="mt-6 p-4 bg-[hsl(var(--danger)/0.1)] border border-[hsl(var(--danger)/0.2)] rounded-2xl text-[hsl(var(--danger))] text-sm font-semibold anim-shake flex items-center gap-3"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" aria-busy={isSubmitting}>
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-xs font-bold text-[hsl(var(--color-text-muted))] uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input 
                id="identifier"
                type="email" 
                placeholder="name@example.com"
                className="w-full bg-[hsl(var(--color-bg)/0.5)] border border-[hsl(var(--color-border))] rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[hsl(var(--primary-500))] focus:ring-2 focus:ring-[hsl(var(--primary-500)/0.2)] transition-all"
                value={formData.identifier}
                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-xs font-bold text-[hsl(var(--color-text-muted))] uppercase tracking-widest">
                  Password
                </label>
                <button 
                  type="button" 
                  tabIndex={0}
                  className="text-xs font-bold text-[hsl(var(--primary-400))] hover:text-[hsl(var(--primary-300))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary-500))] rounded"
                >
                  Forgot?
                </button>
              </div>
              <input 
                id="password"
                type="password" 
                placeholder="••••••••"
                className="w-full bg-[hsl(var(--color-bg)/0.5)] border border-[hsl(var(--color-border))] rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[hsl(var(--primary-500))] focus:ring-2 focus:ring-[hsl(var(--primary-500)/0.2)] transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full velo-gradient py-4 rounded-2xl text-lg font-black text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest mt-4 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : 'Log In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[hsl(var(--color-border)/0.5)] text-center">
            <p className="text-[hsl(var(--color-text-muted))] text-sm font-medium">
              Don't have an account?{' '}
              <button 
                onClick={() => navigateTo('register')}
                className="text-[hsl(var(--primary-400))] font-bold hover:text-[hsl(var(--primary-300))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary-500))] rounded px-1"
              >
                Sign Up for Free
              </button>
            </p>
          </div>
        </div>

        {/* Social Login */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Or continue with</p>
          <div className="flex gap-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              aria-label="Login with Google"
              className="w-14 h-14 bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] rounded-2xl flex items-center justify-center hover:bg-[hsl(var(--color-border)/0.5)] transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.896 4.076-1.228 1.216-3.144 2.388-6.744 2.388-5.728 0-10.2-4.632-10.2-10.38s4.472-10.38 10.2-10.38c3.088 0 5.304 1.184 7.004 2.76l2.304-2.304C18.42 1.488 15.696 0 12.48 0 5.856 0 0 5.376 0 12s5.856 12 12.48 12c3.552 0 6.456-1.128 8.916-3.708 2.532-2.532 3.336-6.144 3.336-9.084 0-.84-.072-1.632-.204-2.352H12.48z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

