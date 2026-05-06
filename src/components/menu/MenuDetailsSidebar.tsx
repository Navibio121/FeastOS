"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Leaf, Clock, ShoppingCart, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';


interface MenuDetailsSidebarProps {
  item: any | null;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  isAuthenticated: boolean;
}

export const MenuDetailsSidebar = ({ item, onClose, onAddToCart, isAuthenticated }: MenuDetailsSidebarProps) => {
  const [showIngredients, setShowIngredients] = useState(false);

  // Reset state when item changes
  useEffect(() => {
    setShowIngredients(false);
  }, [item]);

  if (!item) return null;

  const ingredients = item.ingredients?.split(',').map((i: string) => i.trim()) || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto"
        />

        {/* Modal Pop-up */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-zinc-950 rounded-[3rem] border border-white/10 shadow-2xl pointer-events-auto overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-all backdrop-blur-md z-50 border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Side: Image */}
          <div className="relative w-full md:w-1/2 h-64 md:h-auto">
            <Image src={item.image} alt={item.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-transparent to-transparent opacity-80" />
            
            {/* Badges over image */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {item.isSpicy && (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 backdrop-blur-md text-red-500 text-xs font-bold uppercase rounded-full border border-red-500/30">
                  <Flame className="w-4 h-4" /> Spicy
                </span>
              )}
              {item.isVegan && (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-md text-green-500 text-xs font-bold uppercase rounded-full border border-green-500/30">
                  <Leaf className="w-4 h-4" /> Vegan
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Details & Ingredients */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="mb-8 mt-4 md:mt-0">
              <div className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                {item.category}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase">{item.name}</h2>
              {isAuthenticated ? (
                <div className="text-3xl font-black text-yellow-500">${item.price.toFixed(2)}</div>
              ) : (
                <div className="text-zinc-600 text-xs font-black uppercase tracking-widest">Sign in for pricing</div>
              )}
            </div>

            <p className="text-zinc-400 leading-relaxed text-lg mb-8">
              {item.description}
            </p>

            {item.originStory && (
              <div className="mb-10 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl blur opacity-25" />
                <div className="relative p-6 bg-zinc-900 border border-white/5 rounded-2xl italic text-zinc-300 text-sm leading-relaxed">
                  <span className="text-yellow-500 font-black not-italic text-[10px] uppercase tracking-[0.3em] block mb-2">The Story</span>
                  &quot;{item.originStory}&quot;
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-5 bg-white/5 border border-white/5 rounded-3xl">
                <Clock className="w-6 h-6 text-yellow-500 mb-3" />
                <div className="text-white font-bold text-lg">25-35 mins</div>
                <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Prep Time</div>
              </div>
              <div className="p-5 bg-white/5 border border-white/5 rounded-3xl">
                <Flame className="w-6 h-6 text-yellow-500 mb-3" />
                <div className="text-white font-bold text-lg">650 kcal</div>
                <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Nutritional</div>
              </div>
            </div>

            {/* Expandable Ingredients Section */}
            <div className="mt-auto pt-4 border-t border-white/5">
              {!isAuthenticated ? (
                <div className="p-8 bg-zinc-900 border border-white/5 rounded-3xl text-center group relative overflow-hidden">
                  <div className="absolute inset-0 bg-yellow-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2 uppercase">Recipe Locked</h3>
                  <p className="text-zinc-500 text-xs mb-6">Sign in to view ingredients and order.</p>
                  <a href="/login" className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all text-sm">
                    Sign In
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border border-white/10 rounded-3xl overflow-hidden bg-zinc-900/50">
                    <button 
                      onClick={() => setShowIngredients(!showIngredients)}
                      className="w-full p-6 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                    >
                      <span className="text-xs font-black uppercase tracking-[0.3em]">View Ingredients</span>
                      {showIngredients ? <ChevronUp className="w-5 h-5 text-yellow-500" /> : <ChevronDown className="w-5 h-5 text-yellow-500" />}
                    </button>
                    
                    <AnimatePresence>
                      {showIngredients && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 border-t border-white/5">
                            <div className="flex flex-wrap gap-2 mt-4">
                              {ingredients.map((ing: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-black border border-white/10 rounded-lg text-zinc-400 text-xs font-medium">
                                  {ing}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={() => onAddToCart(item)}
                    className="w-full py-5 bg-yellow-500 text-black font-bold text-lg rounded-2xl hover:bg-yellow-400 transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)] flex items-center justify-center gap-3 active:scale-95"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Add to Feast • ${item.price.toFixed(2)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
