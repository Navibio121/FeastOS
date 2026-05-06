"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Zap, Crown, Shield } from 'lucide-react';

interface LoyaltyCardProps {
  points: number;
}

export const LoyaltyCard = ({ points }: LoyaltyCardProps) => {
  const getTier = (pts: number) => {
    if (pts >= 1000) return { 
      name: 'Platinum', 
      color: 'from-cyan-400 to-blue-600', 
      icon: <Crown className="w-8 h-8" />, 
      next: null, 
      needed: 0,
      perk: 'Private Chef Experience'
    };
    if (pts >= 500) return { 
      name: 'Gold', 
      color: 'from-yellow-400 to-orange-600', 
      icon: <Trophy className="w-8 h-8" />, 
      next: 'Platinum', 
      needed: 1000 - pts,
      perk: 'Priority Table Booking'
    };
    if (pts >= 200) return { 
      name: 'Silver', 
      color: 'from-zinc-300 to-zinc-500', 
      icon: <Shield className="w-8 h-8" />, 
      next: 'Gold', 
      needed: 500 - pts,
      perk: 'Complimentary Delivery'
    };
    return { 
      name: 'Bronze', 
      color: 'from-orange-400 to-amber-700', 
      icon: <Star className="w-8 h-8" />, 
      next: 'Silver', 
      needed: 200 - pts,
      perk: '10% Welcome Discount'
    };
  };

  const tier = getTier(points);
  const progress = tier.next 
    ? Math.min(100, Math.round((points / (points + tier.needed)) * 100)) 
    : 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group perspective-1000"
    >
      {/* Card Body */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 bg-gradient-to-br ${tier.color} shadow-2xl transition-transform duration-500 group-hover:rotate-x-2 group-hover:rotate-y-2`}>
        
        {/* Animated Background Shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shine transition-all duration-1000" />
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-0 right-0 p-10 opacity-10">
          {tier.icon}
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-white/70 text-xs font-black uppercase tracking-[0.3em] mb-1">Loyalty Tier</p>
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase">{tier.name}</h3>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white">
              {tier.icon}
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-white tracking-tighter">{points}</span>
              <span className="text-white/70 font-bold mb-1 uppercase text-xs tracking-widest">Points Balance</span>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-white/70 uppercase tracking-widest">
                <span>Current Tier</span>
                {tier.next && <span>{tier.needed} pts to {tier.next}</span>}
              </div>
              <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4 px-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
            <Zap className="w-5 h-5 text-white animate-pulse" />
            <div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Active Perk</p>
              <p className="text-white font-bold text-sm leading-none">{tier.perk}</p>
            </div>
          </div>
        </div>

        {/* Card Number Style Text */}
        <div className="absolute bottom-6 right-8 text-white/20 font-mono text-xs tracking-[0.4em]">
          FEASTOS ELITE • 2026
        </div>
      </div>

      {/* Stats Quick Grid Below */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl hover:bg-zinc-900 transition-colors group/stat">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Member Since</p>
          <p className="text-white font-bold text-lg group-hover:text-yellow-500 transition-colors">May 2026</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl hover:bg-zinc-900 transition-colors group/stat">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Next Milestone</p>
          <p className="text-white font-bold text-lg group-hover:text-yellow-500 transition-colors">{tier.next || 'Maxed Out'}</p>
        </div>
      </div>
    </motion.div>
  );
};
