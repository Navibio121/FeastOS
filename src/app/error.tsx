"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-red-500/10 rounded-full border border-red-500/20"
        >
          <AlertCircle className="w-12 h-12 text-red-500" />
        </motion.div>
        
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">A RARE DISTURBANCE.</h1>
        <p className="text-zinc-500 mb-12 font-medium leading-relaxed">
          The culinary harmony has been momentarily disrupted. Our digital maîtres d&apos;hôtel are already attending to it.
        </p>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => reset()}
            className="w-full py-4 bg-yellow-500 text-black font-extrabold rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-yellow-500/10"
          >
            <RefreshCcw className="w-5 h-5" />
            Refresh Experience
          </button>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/5 hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
          >
            <Home className="w-5 h-5" />
            Return to Grand Entrance
          </button>
        </div>

        <p className="mt-12 text-[10px] text-zinc-700 font-mono uppercase tracking-[0.4em]">Error Reference: {error.digest || 'Internal Conflict'}</p>
      </div>
    </div>
  );
}
