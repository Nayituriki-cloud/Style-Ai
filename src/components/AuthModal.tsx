import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, login, demoLogin, showToast } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (mode === 'reset') {
      showToast(`Password reset link dispatched to ${email}`, 'info');
      setMode('signin');
      return;
    }

    login(email);
  };

  const handleGoogleLogin = () => {
    login('google.user@styleai.studio');
    showToast('Signed in via Google OAuth');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Personal Styling Account
            </span>
            <h3 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
              {mode === 'signin' && 'Welcome to STYLE AI'}
              {mode === 'signup' && 'Create Your Atelier Account'}
              {mode === 'reset' && 'Reset Password'}
            </h3>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Quick Demo Mode Login */}
          <button
            type="button"
            onClick={demoLogin}
            className="w-full py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-stone-300 dark:border-stone-700"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Instant Demo Login (Preloaded Wardrobe & Looks)</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
            <span className="text-[11px] text-stone-400 uppercase tracking-wider">or email</span>
            <div className="flex-1 h-px bg-stone-200 dark:border-stone-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Emmanuel Nayituriki"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-[11px] text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold text-xs tracking-wider uppercase rounded-xl hover:opacity-95 transition-opacity"
            >
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Send Password Reset'}
            </button>
          </form>

          {/* Social Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Mode Switcher */}
          <div className="text-center pt-2 text-xs text-stone-500">
            {mode === 'signin' && (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="font-semibold text-stone-900 dark:text-stone-100 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="font-semibold text-stone-900 dark:text-stone-100 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <button
                onClick={() => setMode('signin')}
                className="font-semibold text-stone-900 dark:text-stone-100 hover:underline"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
