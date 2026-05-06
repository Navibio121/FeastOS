"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, ChefHat } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
    { role: 'ai', content: "Welcome to FeastOS. I am your personal Culinary Concierge. How may I elevate your dining experience today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { items: cartItems } = useCartStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, cartItems }),
      });
      const data = await res.json();
      
      // Artificial delay for premium feel
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
        setIsTyping(false);
      }, 800);
    } catch (err) {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:scale-110 transition-transform group"
      >
        <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-20" />
        <ChefHat className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-[100] w-full max-w-[400px] bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="p-6 bg-yellow-500 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-yellow-500">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-black font-black text-sm uppercase tracking-widest">Culinary Concierge</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                    <span className="text-[10px] text-black/60 font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-black/5 hover:bg-black/10 rounded-full text-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-yellow-500 text-black font-bold rounded-tr-none shadow-lg' 
                    : 'bg-white/5 border border-white/5 text-zinc-300 rounded-tl-none italic'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-black/50 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask for a wine pairing..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white text-sm focus:border-yellow-500/50 outline-none transition-all"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-4 text-center">Powered by Feast-AI Sommelier</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
