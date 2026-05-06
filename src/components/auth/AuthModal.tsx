"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChefHat, Mail, Lock, User, ArrowRight, Github, Chrome, Sparkles } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useUIStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Something went wrong');
        }
        
        toast.success('Account created! Please sign in.');
        setMode('login');
      } else {
        const res = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.error) {
          throw new Error(res.error);
        }

        toast.success('Welcome back!');
        closeAuthModal();
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: window.location.href });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-zinc-900 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl"
        >
          {/* Close Button */}
          <button 
            onClick={closeAuthModal}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all z-20"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>

          <div className="p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-black mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <ChefHat className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                {mode === 'login' ? 'Welcome Back' : 'Join the Elite'}
              </h2>
              <p className="text-zinc-500 text-sm mt-2 font-medium">
                {mode === 'login' 
                  ? 'Access your personalized culinary journey.' 
                  : 'Start your cultural gastronomy experience today.'}
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-3 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
              >
                <Chrome className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Google</span>
              </button>
              <button 
                onClick={() => handleSocialLogin('github')}
                className="flex items-center justify-center gap-3 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
              >
                <Github className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">GitHub</span>
              </button>
            </div>

            <div className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-900">OR</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:border-yellow-500/50 outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:border-yellow-500/50 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:border-yellow-500/50 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all mt-6 shadow-[0_0_30px_rgba(234,179,8,0.2)] disabled:opacity-50"
              >
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>

          {/* Footer Decor */}
          <div className="bg-black/40 p-4 text-center border-t border-white/5">
             <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3 text-yellow-500/50" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">FeastOS Security Protocol</span>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
