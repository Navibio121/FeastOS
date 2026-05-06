"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/globals/Navbar';
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

import { Suspense } from 'react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  if (!sessionId) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-[60px] animate-pulse" />
          <div className="relative w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.4)]">
            <CheckCircle2 className="w-12 h-12 text-black" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">THE FEAST IS SECURED!</h1>
        <p className="text-zinc-500 text-lg max-w-md mx-auto mb-12 leading-relaxed">
          Your payment was successful and our chefs are already preparing your masterpiece. 
          Expect greatness shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => router.push('/profile')}
            className="px-10 py-4 bg-zinc-900 border border-white/10 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all flex items-center gap-3"
          >
            Track Order Status <ArrowRight className="w-5 h-5 text-yellow-500" />
          </button>
          <button 
            onClick={() => router.push('/menu')}
            className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-3"
          >
            <ShoppingBag className="w-5 h-5" /> Explore More
          </button>
        </div>

        <div className="mt-20 p-8 border border-white/5 rounded-[2rem] bg-zinc-900/50 backdrop-blur-xl">
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">Verification ID</div>
          <div className="text-white font-mono text-sm opacity-50">{sessionId}</div>
        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
