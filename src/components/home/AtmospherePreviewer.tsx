"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Music, Users, Wind, PlayCircle } from 'lucide-react';
import Image from 'next/image';


const AMBIANCES = [
  {
    id: 'jazz',
    title: "The Midnight Jazz Lounge",
    desc: "Dim lights, velvet seats, and the smooth sounds of live saxophone. Perfect for intimate dates.",
    icon: Music,
    image: "/atmosphere/jazz.png",
  },
  {
    id: 'terrace',
    title: "The Sky Garden Terrace",
    desc: "Open-air dining under the stars with a panoramic view of the Lagos skyline.",
    icon: Wind,
    image: "/atmosphere/terrace.png",
  },
  {
    id: 'private',
    title: "The Royal Private Suite",
    desc: "A secluded sanctuary for your most exclusive gatherings. Personal butler service included.",
    icon: Users,
    image: "/atmosphere/private.png",
  }
];

export const AtmospherePreviewer = () => {
  const [active, setActive] = useState(AMBIANCES[0]);

  return (
    <section className="py-24 px-4 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full text-yellow-500 text-xs font-black uppercase tracking-[0.3em] mb-6">
            <Eye className="w-4 h-4 animate-pulse" /> Virtual Atmosphere
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6 uppercase">TABLE PREVIEWER</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Don&apos;t just choose your food—choose your vibe. Preview the sensory environment of our dining spaces.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Controls */}
          <div className="lg:w-1/3 space-y-6">
            {AMBIANCES.map((vibe, i) => (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                key={vibe.id}
                onClick={() => setActive(vibe)}
                className={`w-full p-8 rounded-3xl border text-left transition-all duration-500 flex items-start gap-6 group ${
                  active.id === vibe.id 
                  ? 'bg-yellow-500 border-yellow-500 text-black shadow-2xl shadow-yellow-500/10 scale-105' 
                  : 'bg-zinc-900 border-white/5 text-white hover:border-white/10'
                }`}
              >
                <div className={`p-4 rounded-2xl ${active.id === vibe.id ? 'bg-black text-yellow-500' : 'bg-white/5 text-zinc-500'}`}>
                  <vibe.icon className={`w-6 h-6 ${active.id === vibe.id ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <h3 className="font-bold mb-2 uppercase">{vibe.title}</h3>
                  <p className={`text-xs leading-relaxed ${active.id === vibe.id ? 'text-black/70' : 'text-zinc-500'}`}>
                    {vibe.desc}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Preview Window */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-2/3 h-[600px] relative rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5 bg-black"
          >
            <AnimatePresence mode='wait'>
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {/* Live Cam Effect */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    x: [0, -10, 0, 10, 0],
                    y: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
                
                {/* Play Button Mockup */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="w-20 h-20 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-yellow-500 scale-0 group-hover:scale-100 transition-transform duration-500 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <PlayCircle className="w-10 h-10" />
                  </div>
                </div>

                {/* Live Feed Indicator */}
                <div className="absolute bottom-12 left-12 z-20 pointer-events-none">
                  <div className="flex items-center gap-4 text-white bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div 
                          key={i} 
                          className="w-1.5 h-4 bg-yellow-500 animate-pulse rounded-full" 
                          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Live Feed
                    </span>
                  </div>
                </div>

                {/* Time Indicator */}
                <div className="absolute top-12 right-12 z-20 pointer-events-none font-mono text-white/50 text-[10px] tracking-widest uppercase">
                  REC: 00:00:24:12
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
