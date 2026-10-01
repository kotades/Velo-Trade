import React, { useState } from 'react';
import { View } from '../App';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { useRateLimiter } from '../hooks/useRateLimiter';
import { getFriendlyErrorMessage } from '../lib/authErrors';

interface RegisterProps {
  navigateTo: (view: View) => void;
}

const Register: React.FC<RegisterProps> = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { consume, getRetryAfter } = useRateLimiter({
    key: 'register',
    maxTokens: 5,
    refillRate: 5 / 60000 // 5 tokens per minute
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (!consume()) {
      const retryAfter = getRetryAfter();
      setError(`Too many requests. Please try again in ${retryAfter} seconds.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(userCredential.user, { displayName: formData.name });
      navigateTo('trading');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, 'Unable to create account. Please check your details and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 md:pt-32 pb-20 px-4 flex flex-col items-center justify-center relative overflow-hidden bg-[hsl(var(--color-bg))]">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-xl z-10 anim-fade-in">
        <div className="bg-[hsl(var(--color-surface)/0.6)] backdrop-blur-3xl border border-[hsl(var(--color-border))] rounded-[2rem] p-6 md:p-12 shadow-2xl shadow-black/40">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl velo-gradient mb-6 shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-2xl italic">V</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Create Account</h1>
            <p className="text-zinc-500 font-medium text-sm md:text-base">Join the world's most advanced copy-trading platform.</p>
            
            {error && (
              <div 
                role="alert"
                className="mt-6 p-4 bg-[hsl(var(--danger)/0.1)] border border-[hsl(var(--danger)/0.2)] rounded-xl text-[hsl(var(--danger))] text-xs font-bold anim-shake"
              >
                <div className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="full-name" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <input 
                id="full-name"
                type="text" 
                required
                placeholder="Enter your full name"
                className="w-full bg-[hsl(var(--color-bg)/0.5)] border border-[hsl(var(--color-border))] rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[hsl(var(--secondary-500))] focus:ring-1 focus:ring-[hsl(var(--secondary-500))] transition-all shadow-inner font-medium"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="email" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input 
                id="email"
                type="email" 
                required
                placeholder="name@example.com"
                className="w-full bg-[hsl(var(--color-bg)/0.5)] border border-[hsl(var(--color-border))] rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[hsl(var(--secondary-500))] focus:ring-1 focus:ring-[hsl(var(--secondary-500))] transition-all shadow-inner font-medium"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Password</label>
              <input 
                id="password"
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-[hsl(var(--color-bg)/0.5)] border border-[hsl(var(--color-border))] rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[hsl(var(--secondary-500))] focus:ring-1 focus:ring-[hsl(var(--secondary-500))] transition-all shadow-inner font-medium"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Confirm</label>
              <input 
                id="confirm-password"
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-[hsl(var(--color-bg)/0.5)] border border-[hsl(var(--color-border))] rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[hsl(var(--secondary-500))] focus:ring-1 focus:ring-[hsl(var(--secondary-500))] transition-all shadow-inner font-medium"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 space-y-6 pt-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-1 relative w-5 h-5 flex-shrink-0">
                  <input type="checkbox" className="peer absolute opacity-0 cursor-pointer" required aria-label="Terms and Conditions" />
                  <div className="w-5 h-5 bg-[hsl(var(--color-bg))] border border-[hsl(var(--color-border))] rounded peer-checked:bg-[hsl(var(--primary-500))] peer-checked:border-[hsl(var(--primary-500))] transition-all"></div>
                  <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  I agree to Velo's <button type="button" className="text-[hsl(var(--secondary-400))] hover:underline font-bold">Terms of Service</button> and <button type="button" className="text-[hsl(var(--secondary-400))] hover:underline font-bold">Privacy Policy</button>.
                </span>
              </label>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full velo-gradient py-5 rounded-2xl text-lg font-black text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] border border-white/10 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : 'Start Trading Now'}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-[hsl(var(--color-border)/0.5)] text-center">
            <p className="text-zinc-500 font-medium">
              Already a member?{' '}
              <button 
                onClick={() => navigateTo('login')}
                className="text-[hsl(var(--secondary-400))] font-black uppercase tracking-widest text-xs hover:text-[hsl(var(--secondary-300))] transition-colors ml-2"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;

