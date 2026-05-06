"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/globals/Navbar';

interface OrderTrackingProps {
  params: { id: string };
}

const STAGES = [
  { id: 'PENDING', label: 'Order Confirmed', icon: Package, color: 'text-blue-500' },
  { id: 'PREPARING', label: 'In the Kitchen', icon: ChefHat, color: 'text-yellow-500' },
  { id: 'READY', label: 'On the Way', icon: Bike, color: 'text-orange-500' },
  { id: 'COMPLETED', label: 'Delivered', icon: CheckCircle2, color: 'text-green-500' },
];

export default function OrderTrackingPage({ params }: OrderTrackingProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (!res.ok) throw new Error('Failed to load order');
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // In a real app, you would subscribe to SSE or WebSocket here
    const interval = setInterval(fetchOrder, 10000); // Poll every 10s for demo
    return () => clearInterval(interval);
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4 opacity-50" />
        <h1 className="text-2xl font-bold text-white mb-2">Order Not Found</h1>
        <p className="text-zinc-500 mb-8 max-w-sm">We couldn&apos;t find the tracking details for order #{params.id.slice(-6).toUpperCase()}.</p>
        <button 
          onClick={() => router.push('/profile')}
          className="px-8 py-3 bg-zinc-900 border border-white/10 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all"
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex(s => s.id === order.status);
  const progress = ((currentStageIndex + 1) / STAGES.length) * 100;

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to History
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Tracking Info */}
          <div>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-500/20">
                  Live Tracking
                </span>
                <span className="text-zinc-500 text-xs font-mono">#{order.id.slice(-6).toUpperCase()}</span>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
                WE ARE <span className="text-zinc-700 italic">ON IT.</span>
              </h1>
              <p className="text-zinc-500">Your culinary experience is being prepared with precision.</p>
            </div>

            {/* Stages Tracker */}
            <div className="relative space-y-10 mb-16">
              {/* Vertical Progress Line */}
              <div className="absolute left-[1.35rem] top-2 bottom-2 w-[2px] bg-zinc-900">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${progress}%` }}
                  className="w-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                />
              </div>

              {STAGES.map((stage, idx) => {
                const isActive = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <motion.div 
                    key={stage.id}
                    initial={{ opacity: 0.3, x: -10 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.3,
                      x: 0,
                      scale: isCurrent ? 1.05 : 1
                    }}
                    className="relative flex items-center gap-6"
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${
                      isActive ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-zinc-900 text-zinc-600'
                    }`}>
                      <stage.icon className="w-5 h-5" />
                      {isCurrent && (
                        <motion.div 
                          layoutId="pulse"
                          className="absolute inset-0 rounded-full border-2 border-yellow-500"
                          animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                        {stage.label}
                      </h4>
                      {isCurrent && (
                        <p className="text-yellow-500/80 text-xs font-medium">Updated just now</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Details Card */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" /> Order Summary
              </h3>
              <div className="space-y-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400"><span className="text-white font-bold">{item.quantity}x</span> {item.name}</span>
                    <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-white font-black uppercase tracking-widest text-xs">Total Amount</span>
                  <span className="text-yellow-500 font-black text-xl">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Simulated Map */}
          <div className="relative min-h-[500px] rounded-[3rem] overflow-hidden border border-white/5 group shadow-2xl">
            {/* Map Placeholder Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }} />

            {/* Simulated Path & Pins */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 400 400" className="opacity-40">
                <motion.path
                  d="M 50,300 Q 150,250 200,150 T 350,100"
                  fill="none"
                  stroke="#3f3f46"
                  strokeWidth="4"
                  strokeDasharray="10 10"
                />
                <motion.path
                  d="M 50,300 Q 150,250 200,150 T 350,100"
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 2 }}
                />
              </svg>

              {/* Destination Pin */}
              <div className="absolute top-[80px] right-[40px] text-center">
                <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">Your Home</p>
              </div>

              {/* Restaurant Pin */}
              <div className="absolute bottom-[80px] left-[40px] text-center">
                <div className="bg-yellow-500 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.5)] mb-2">
                  <Navigation className="w-5 h-5 text-black" />
                </div>
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">FeastOS Kitchen</p>
              </div>

              {/* Moving Driver (Simulated) */}
              <motion.div 
                className="absolute z-20"
                animate={{ 
                  left: `${(progress / 100) * 280 + 50}px`,
                  top: `${300 - (progress / 100) * 180}px`
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <div className="bg-white p-2 rounded-xl shadow-2xl border border-white/20">
                  <Bike className="w-6 h-6 text-black" />
                </div>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] font-bold text-white whitespace-nowrap">
                  Courier is {order.status === 'READY' ? 'on the way' : 'moving'}
                </div>
              </motion.div>
            </div>

            {/* Map Controls (Overlay) */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase">Assigned Courier</p>
                    <p className="text-white font-bold text-sm">Chidi &apos;The Swift&apos;</p>
                  </div>
                </div>
              </div>
              <button className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                Contact
              </button>
            </div>

            {/* Live Camera Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
            <div className="absolute top-8 left-8 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Live Feed</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
