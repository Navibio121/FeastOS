"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { Navbar } from '@/components/globals/Navbar';
import { LogIn, UserPlus, Github, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.error) {
          setError('Invalid email or password');
        } else {
          router.push('/profile');
          router.refresh();
        }
      } else {
        // Handle signup - for now we'll just mock it or call a signup API
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setIsLogin(true);
          setError('Account created! Please log in.');
        } else {
          const data = await res.json();
          setError(data.message || 'Something went wrong');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="w-full max-w-md">
          {/* Glass Card */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl -z-10" />

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-zinc-500 text-sm">
                {isLogin ? 'Sign in to manage your orders' : 'Join the FeastOS community'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-zinc-400 text-xs font-medium ml-1">Full Name</label>
                  <div className="relative">
                    <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input 
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-colors"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-zinc-400 text-xs font-medium ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    required
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-colors"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-zinc-400 text-xs font-medium">Password</label>
                  {isLogin && (
                    <button type="button" className="text-yellow-500/80 text-xs hover:text-yellow-500 hover:underline">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-colors"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold rounded-2xl transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isLogin ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-zinc-600 text-xs uppercase tracking-wider font-bold">Or continue with</span>
              <div className="h-px bg-white/5 flex-1" />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button 
                onClick={() => signIn('google', { callbackUrl: '/profile' })}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white text-sm transition-all"
              >
                <div className="relative w-4 h-4 grayscale opacity-70">
                  <Image src="https://www.google.com/favicon.ico" fill alt="Google" />
                </div>
                Google
              </button>
              <button 
                onClick={() => signIn('github', { callbackUrl: '/profile' })}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white text-sm transition-all"
              >
                <Github className="w-4 h-4" />
                GitHub
              </button>
            </div>

            <p className="mt-10 text-center text-zinc-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-yellow-500 font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
