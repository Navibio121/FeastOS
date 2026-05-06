"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Sparkles, ChefHat, MoreVertical, MapPin, Calendar, LayoutGrid, UserCircle } from 'lucide-react';

import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationSelector } from './LocationSelector';

export const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCartStore();
  const { openCart } = useUIStore();
  const { data: session } = useSession();
  
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled 
      ? 'py-4 bg-black/60 backdrop-blur-2xl border-b border-white/5 shadow-2xl' 
      : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          
          {/* Brand Identity */}
          <Link href="/" className="group flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              <ChefHat className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-tighter leading-none">FEAST<span className="text-yellow-500">OS</span></span>
              <span className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase leading-none mt-1.5">Elite Dining</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link 
              href="/menu" 
              onClick={(e) => {
                if (!session) {
                  e.preventDefault();
                  useUIStore.getState().openAuthModal();
                } else {
                  handleMenuClick(e);
                }
              }}
              className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-yellow-500 transition-colors"
            >
              Menu
            </Link>
            <Link 
              href="/reservations" 
              onClick={(e) => {
                if (!session) {
                  e.preventDefault();
                  useUIStore.getState().openAuthModal();
                }
              }}
              className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-yellow-500 transition-colors"
            >
              Reservations
            </Link>
            <Link 
              href="/mood-to-meal" 
              onClick={(e) => {
                if (!session) {
                  e.preventDefault();
                  useUIStore.getState().openAuthModal();
                }
              }}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-yellow-500 transition-colors group"
            >
              <Sparkles className="w-3 h-3 text-yellow-500 group-hover:animate-spin" />
              Mood to Meal
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <LocationSelector />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={openCart}
              className="group relative p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-yellow-500 text-[10px] font-black text-black rounded-full shadow-lg border-2 border-black">
                  {cartItemCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {session ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Link 
                    href="/profile"
                    className="p-3 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-black border border-yellow-500/20 rounded-2xl transition-all flex items-center gap-2 group"
                  >
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="User Profile" width={20} height={20} className="rounded-full object-cover" />
                    ) : (
                      <UserCircle className="w-5 h-5" />
                    )}
                    <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">My Profile</span>
                  </Link>
                </motion.div>
              ) : (
                <Link 
                  href="/login"
                  className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-yellow-500 transition-all"
                >
                  Sign In
                </Link>
              )}
            </AnimatePresence>

            {/* Mobile Menu (Optional, can be hidden if simple links are enough) */}
            <button 
              className="md:hidden p-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-400"
              onClick={() => alert("Mobile menu coming soon")} // Could trigger a simple mobile sheet
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

