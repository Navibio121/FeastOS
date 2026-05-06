"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, Leaf, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MenuItemCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  isSpicy?: boolean;
  isVegan?: boolean;
  isAvailable?: boolean;
  onClick?: () => void;
  isAuthenticated: boolean;
}

export const MenuItemCard = ({ 
  name, 
  price, 
  image, 
  isSpicy, 
  isVegan, 
  onClick,
  isAuthenticated 
}: MenuItemCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="group relative bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5 cursor-pointer hover:border-white/10 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Image 
          src={image} 
          alt={name} 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60 group-hover:opacity-80" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isSpicy && (
            <div className="p-2 bg-red-500/20 backdrop-blur-md rounded-full text-red-500 border border-red-500/30">
              <Flame className="w-4 h-4" />
            </div>
          )}
          {isVegan && (
            <div className="p-2 bg-green-500/20 backdrop-blur-md rounded-full text-green-500 border border-green-500/30">
              <Leaf className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Price/Lock Overlay */}
        <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
          {isAuthenticated ? (
            <div className="bg-yellow-500 text-black p-3 rounded-2xl shadow-xl flex items-center justify-center">
              <Plus className="w-6 h-6 stroke-[3px]" />
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl border border-white/20">
              <Lock className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-yellow-500 transition-colors uppercase">
          {name}
        </h3>
        {isAuthenticated ? (
          <p className="text-yellow-500 font-black text-xl mt-1">${price.toFixed(2)}</p>
        ) : (
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-1">Unlock Price</p>
        )}
      </div>
    </motion.div>
  );
};
