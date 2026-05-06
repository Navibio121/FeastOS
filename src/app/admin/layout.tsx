"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2, Bell, ShoppingBag, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'booking';
  data: any;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user && session.user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user.role === 'ADMIN') {
      const eventSource = new EventSource('/api/events');

      eventSource.addEventListener('NEW_ORDER', (event) => {
        const order = JSON.parse(event.data);
        addToast({
          id: Math.random().toString(36).substr(2, 9),
          title: 'New Order Received',
          message: `Order #${order.id.slice(-6).toUpperCase()} for $${order.total.toFixed(2)}`,
          type: 'order',
          data: order
        });
        // Optional: Play sound
        try { new Audio('/notification.mp3').play(); } catch(e) {}
      });

      eventSource.addEventListener('NEW_RESERVATION', (event) => {
        const res = JSON.parse(event.data);
        addToast({
          id: Math.random().toString(36).substr(2, 9),
          title: 'New Reservation',
          message: `${res.name} - ${res.guests} Guests at ${res.time}`,
          type: 'booking',
          data: res
        });
        try { new Audio('/notification.mp3').play(); } catch(e) {}
      });

      return () => eventSource.close();
    }
  }, [status, session]);

  const addToast = (toast: Toast) => {
    setToasts(prev => [toast, ...prev]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 8000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (status === 'loading') {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="bg-black min-h-screen flex">
      {/* Toast Notifications */}
      <div className="fixed top-8 right-8 z-[200] space-y-4 w-96 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="pointer-events-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative group overflow-hidden"
            >
              {/* Progress Bar */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 8, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-yellow-500/50"
              />

              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  toast.type === 'order' ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'
                }`}>
                  {toast.type === 'order' ? <ShoppingBag className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                </div>
                <div className="flex-1 pr-6">
                  <h4 className="text-white font-bold mb-1">{toast.title}</h4>
                  <p className="text-zinc-500 text-sm font-medium">{toast.message}</p>
                  <button 
                    onClick={() => {
                      router.push(toast.type === 'order' ? '/admin/orders' : '/admin/reservations');
                      removeToast(toast.id);
                    }}
                    className="mt-3 text-xs font-black text-yellow-500 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                </div>
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-full text-zinc-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative">
        <div className="lg:hidden p-4 border-b border-white/5 flex justify-between items-center bg-zinc-950">
           <h1 className="text-white font-black tracking-tighter">FEAST<span className="text-yellow-500 italic">OS</span></h1>
           <div className="relative">
             <Bell className="w-6 h-6 text-zinc-500" />
             {toasts.length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-500 rounded-full border-2 border-zinc-950" />}
           </div>
        </div>

        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
