"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CartDrawer = () => {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const total = getTotal();

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 z-[70] shadow-2xl border-l border-white/10 transition-transform duration-500 ease-in-out",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">Your Cart</h2>
              <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                {items.length}
              </span>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-zinc-700" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Your cart is empty</h3>
                  <p className="text-zinc-500 text-sm">Add some delicious items to get started!</p>
                </div>
                <Link 
                  href="/menu"
                  onClick={closeCart}
                  className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5 relative">
                    <Image 
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'} 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-white font-medium truncate pr-4">{item.name}</h4>
                      <span className="text-yellow-500 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p className="text-zinc-500 text-xs mb-3">${item.price.toFixed(2)} each</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-1 border border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-zinc-900/50 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                <div className="flex justify-between text-white font-bold text-xl pt-2">
                  <span>Total</span>
                  <span className="text-yellow-500">${(total + 2.99).toFixed(2)}</span>
                </div>
              </div>
              <Link 
                href="/checkout"
                onClick={closeCart}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
              >
                Checkout Now
                <ShoppingBag className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-zinc-500 text-[10px] text-center">
                Tax and additional fees may apply at checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
