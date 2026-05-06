"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SLIDES = [
  {
    id: 1,
    title: "DINING REIMAGINED",
    subtitle: "Experience the legendary smokey flavors of our signature Nigerian Party Jollof.",
    image: "/slider/slide_1_jollof_1777427720491.png",
    color: "from-orange-500/20"
  },
  {
    id: 2,
    title: "THE WAGYU STANDARD",
    subtitle: "Savor the richness of A5 Wagyu paired with black truffle and gold-leaf accents.",
    image: "/slider/slide_2_wagyu_1777427734214.png",
    color: "from-yellow-500/20"
  },
  {
    id: 3,
    title: "TRADITION MEETS LUXURY",
    subtitle: "Our Pounded Yam & Egusi Deluxe is a symphony of authentic local flavors.",
    image: "/slider/slide_3_egusi_1777427855062.png",
    color: "from-green-500/20"
  },
  {
    id: 4,
    title: "OCEAN'S FINEST",
    subtitle: "Freshly poached Lobster chunks in a cognac-infused cream sauce.",
    image: "/slider/slide_4_lobster_1777427881007.png",
    color: "from-blue-500/20"
  },
  {
    id: 5,
    title: "AGED TO PERFECTION",
    subtitle: "Experience the intensity of our 45-day dry-aged bone-in Ribeye.",
    image: "/slider/slide_5_ribeye_1777427992365.png",
    color: "from-zinc-500/20"
  },
  {
    id: 6,
    title: "EFIK ROYALTY",
    subtitle: "The king of vegetable soups, Edikaikong, slow-cooked with premium goat meat.",
    image: "/slider/slide_6_edikaikong_1777428079255.png",
    color: "from-green-600/20"
  },
  {
    id: 7,
    title: "SPANISH SUNSET",
    subtitle: "Our Saffron-infused Seafood Paella brings the Mediterranean to your table.",
    image: "/slider/slide_4_lobster_1777427881007.png",
    color: "from-red-500/20"
  }
];

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prev = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence>
        <motion.div 
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${SLIDES[current].image})` }}
          />
          
          {/* Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent`} />
          <div className={`absolute inset-0 bg-gradient-to-r ${SLIDES[current].color} to-transparent mix-blend-overlay`} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <AnimatePresence>
          <motion.div
            key={current}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-4xl absolute"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">
              {SLIDES[current].title.split(' ')[0]}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                {SLIDES[current].title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 mb-10 font-medium leading-relaxed max-w-2xl mx-auto">
              {SLIDES[current].subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/menu"
                className="group px-10 py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl transition-all flex items-center gap-2 text-lg shadow-[0_0_30px_rgba(234,179,8,0.3)]"
              >
                Explore Menu
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/reservations"
                className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl transition-all text-lg"
              >
                Book a Table
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8">
        <button onClick={prev} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-sm border border-white/10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        {/* Progress Indicators */}
        <div className="flex gap-3">
          {SLIDES.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${current === i ? 'w-12 bg-yellow-500' : 'w-3 bg-white/30'}`}
            />
          ))}
        </div>

        <button onClick={next} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-sm border border-white/10">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Floating Badge */}
      <div className="absolute top-32 right-12 z-20 hidden lg:block animate-bounce">
        <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-xs tracking-widest uppercase shadow-xl">
          Now Open
        </div>
      </div>
    </section>
  );
};
