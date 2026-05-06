"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`
                relative overflow-hidden flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px]
                ${t.type === 'success' ? 'bg-green-500/10 border-green-500/20' : 
                  t.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 
                  'bg-zinc-900/80 border-white/10'}
              `}>
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  t.type === 'success' ? 'bg-green-500' : 
                  t.type === 'error' ? 'bg-red-500' : 
                  'bg-yellow-500'
                }`} />

                <div className={`flex-shrink-0 ${
                  t.type === 'success' ? 'text-green-500' : 
                  t.type === 'error' ? 'text-red-500' : 
                  'text-yellow-500'
                }`}>
                  {t.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                  {t.type === 'error' && <AlertCircle className="w-6 h-6" />}
                  {t.type === 'info' && <Sparkles className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <p className="text-white font-bold text-sm tracking-tight">{t.message}</p>
                </div>

                <button 
                  onClick={() => removeToast(t.id)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Auto-dismiss Progress Line */}
                <motion.div 
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-[2px] w-full origin-left ${
                    t.type === 'success' ? 'bg-green-500/50' : 
                    t.type === 'error' ? 'bg-red-500/50' : 
                    'bg-yellow-500/50'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
