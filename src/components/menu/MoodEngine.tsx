"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, ArrowRight, Heart, Zap, Coffee, CloudMoon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


const MOODS = [
  { id: 'adventurous', label: 'Adventurous', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', recommendation: 'Seafood Okra Supreme', desc: 'Push your boundaries with exotic ocean flavors.', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400' },
  { id: 'comfort', label: 'Need Comfort', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10', recommendation: 'The Abula Experience', desc: 'A soulful Yoruba embrace in a bowl.', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=400' },
  { id: 'luxury', label: 'Extra Luxury', icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-500/10', recommendation: 'Black Truffle Wagyu Burger', desc: 'Indulge in the finest ingredients on earth.', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=400' },
  { id: 'productive', label: 'Productive', icon: Coffee, color: 'text-orange-500', bg: 'bg-orange-500/10', recommendation: 'Golden Miso Salmon', desc: 'Clean energy for high performance.', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400' },
  { id: 'peaceful', label: 'Peaceful', icon: CloudMoon, color: 'text-purple-500', bg: 'bg-purple-500/10', recommendation: 'French Duck Confit', desc: 'A slow-cooked symphony for a quiet night.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400' },
];

import { useMoodStore } from '@/store/moodStore';
import { useSession } from 'next-auth/react';
import { useUIStore } from '@/store/uiStore';

export const MoodEngine = () => {
  const { data: session } = useSession();
  const { selectedMoodId, setMood } = useMoodStore();
  const selected = MOODS.find(m => m.id === selectedMoodId) || null;

  return (
    <section className="py-24 px-4 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full text-yellow-500 text-xs font-black uppercase tracking-[0.3em] mb-6">
            <Brain className="w-4 h-4" /> AI Recommendations
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6">MOOD-TO-MEAL ENGINE</h2>
          <p className="text-zinc-500 max-w-xl mx-auto font-medium">How are you feeling right now? Let our sensory engine decide your next masterpiece.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setMood(mood.id)}
              className={`p-8 rounded-[2.5rem] border transition-all duration-500 group ${
                selected?.id === mood.id 
                ? `${mood.bg} border-${mood.color.split('-')[1]}-500/50` 
                : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
              }`}
            >
              <mood.icon className={`w-10 h-10 mx-auto mb-4 transition-transform group-hover:scale-110 ${
                selected?.id === mood.id ? mood.color : 'text-zinc-500'
              }`} />
              <div className={`text-xs font-black uppercase tracking-widest ${
                selected?.id === mood.id ? 'text-white' : 'text-zinc-500'
              }`}>{mood.label}</div>
            </button>
          ))}
        </div>

        <AnimatePresence mode='wait'>
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto bg-zinc-900 border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10"
            >
              <div className="flex-1">
                <div className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <selected.icon className={`w-4 h-4 ${selected.color}`} />
                  Recommended For You
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 uppercase">{selected.recommendation}</h3>
                <p className="text-zinc-400 mb-8">{selected.desc}</p>
                <Link 
                  href="/menu"
                  onClick={(e) => {
                    if (!session) {
                      e.preventDefault();
                      useUIStore.getState().openAuthModal();
                    }
                  }}
                  className="inline-flex items-center gap-3 text-yellow-500 font-bold hover:gap-5 transition-all"
                >
                  View Details <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="w-48 h-48 rounded-[2rem] overflow-hidden border border-white/10 relative group">
                <Image 
                  src={selected.image} 
                  alt={selected.recommendation} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
