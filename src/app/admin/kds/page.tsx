"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/globals/Navbar';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Play, 
  AlertCircle, 
  Loader2,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/providers/ToastProvider';

export default function KDSPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/kds');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/kds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        toast(`Order updated to ${newStatus}`, 'success');
        fetchOrders();
      }
    } catch (err) {
      toast('Failed to update order', 'error');
    }
  };

  const columns = [
    { id: 'PENDING', title: 'New Orders', color: 'border-blue-500/30', bg: 'bg-blue-500/10', icon: AlertCircle, nextStatus: 'PREPARING', btnText: 'Start Prep', btnIcon: Play },
    { id: 'PREPARING', title: 'In Preparation', color: 'border-yellow-500/30', bg: 'bg-yellow-500/10', icon: ChefHat, nextStatus: 'READY', btnText: 'Mark Ready', btnIcon: CheckCircle2 },
    { id: 'READY', title: 'Ready for Pickup', color: 'border-green-500/30', bg: 'bg-green-500/10', icon: PackageCheck, nextStatus: 'COMPLETED', btnText: 'Complete', btnIcon: ChevronRight },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <div className="pt-32 px-6 pb-20 max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              KITCHEN <span className="text-zinc-600">DISPLAY SYSTEM</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Live Operational Queue</p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Live
            </div>
            <button 
              onClick={fetchOrders}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <Clock className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Syncing with Kitchen...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.id} className="flex flex-col gap-6">
                <div className={`p-4 rounded-2xl border ${col.color} ${col.bg} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <col.icon className="w-5 h-5" />
                    <h2 className="text-white font-black uppercase tracking-widest text-sm">{col.title}</h2>
                  </div>
                  <span className="bg-white/10 px-3 py-1 rounded-full text-white text-xs font-bold">
                    {orders.filter(o => o.status === col.id).length}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <AnimatePresence mode="popLayout">
                    {orders.filter(o => o.status === col.id).map((order) => (
                      <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Order #{order.id.slice(-6)}</p>
                            <h3 className="text-white font-bold">{order.user.name || 'Guest'}</h3>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-500 text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 bg-yellow-500 text-black rounded-lg flex items-center justify-center font-black text-xs">
                                  {item.quantity}
                                </span>
                                <span className="text-sm font-medium text-zinc-200">{item.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => updateStatus(order.id, col.nextStatus)}
                          className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em] transition-all group"
                        >
                          <col.btnIcon className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                          {col.btnText}
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
