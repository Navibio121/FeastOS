"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChefHat, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="w-24 h-24 bg-zinc-900 border border-white/5 rounded-[2rem] flex items-center justify-center text-yellow-500 mx-auto mb-8 shadow-2xl relative">
            <ChefHat className="w-12 h-12" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black">404</div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase">
            TABLE <span className="text-zinc-800">NOT</span> FOUND
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed max-w-md mx-auto">
            It seems the page you are looking for has been removed from the menu or never existed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Entrance
          </Link>
          <Link 
            href="/menu"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <Search className="w-5 h-5" />
            Explore the Menu
          </Link>
        </motion.div>

        {/* Decorative Text */}
        <div className="mt-24 text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em] select-none">
          FEASTOS ELITE DINING • EST. 2026
        </div>
      </div>
    </div>
  );
}
