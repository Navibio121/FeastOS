import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" 
          alt="Hero Background" 
          fill 
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      
      {/* Abstract Shapes for Premium Feel */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          DINING <span className="text-yellow-500">REIMAGINED</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Experience gourmet excellence delivered to your doorstep. From local classics to experimental fusion, FeastOS brings the world to your table.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group px-8 py-4 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-all flex items-center gap-2">
            Explore Menu
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition-all">
            Book a Table
          </button>
        </div>
      </div>
    </div>
  );
};
