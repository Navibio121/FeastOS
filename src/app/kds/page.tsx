"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/globals/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Check, 
  Loader2,
  Flame,
  Leaf
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  phone: string;
  address: string;
}

export default function KDSPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Real-time listener for new orders and status updates
  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user && session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      // router.push('/');
    }

    const fetchData = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          fetch('/api/orders/all'),
          fetch('/api/menu')
        ]);
        const ordersData = await ordersRes.json();
        const menuData = await menuRes.json();
        
        setMenuItems(menuData);
        setOrders(ordersData.filter((o: Order) => o.status !== 'COMPLETED'));
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Setup SSE connection
    const eventSource = new EventSource('/api/events');

    eventSource.addEventListener('NEW_ORDER', (event) => {
      const newOrder = JSON.parse(event.data);
      setOrders(prev => {
        // Prevent duplicates
        if (prev.find(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
      // Play notification sound
      try { new Audio('/notification.mp3').play(); } catch(e) {}
    });

    eventSource.addEventListener('ORDER_UPDATED', (event) => {
      const updatedOrder = JSON.parse(event.data);
      setOrders(prev => 
        prev.map(o => o.id === updatedOrder.id ? updatedOrder : o)
            .filter(o => o.status !== 'COMPLETED')
      );
    });

    eventSource.onerror = (err) => {
      console.error("SSE Connection failed:", err);
      eventSource.close();
      // Fallback to polling if SSE fails
      const interval = setInterval(fetchData, 30000);
      eventSource.onopen = () => clearInterval(interval);
    };

    return () => {
      eventSource.close();
    };
  }, [session, status]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o).filter(o => o.status !== 'COMPLETED'));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-red-500/20 text-red-500 border-red-500/20';
      case 'PREPARING': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
      case 'READY': return 'bg-green-500/20 text-green-500 border-green-500/20';
      default: return 'bg-zinc-800 text-zinc-500 border-white/5';
    }
  };

  const getTimeElapsed = (createdAt: string) => {
    const start = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - start) / 60000); // minutes
    return `${diff}m ago`;
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      
      <header className="pt-24 pb-8 px-6 bg-zinc-900/50 border-b border-white/5">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500 rounded-2xl text-black">
              <ChefHat className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Kitchen Display System</h1>
              <p className="text-zinc-500 text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Connection Active • {orders.length} Active Orders
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex items-center gap-6">
              <div className="text-center">
                <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Pending</div>
                <div className="text-2xl font-bold text-red-500">{orders.filter(o => o.status === 'PENDING').length}</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Preparing</div>
                <div className="text-2xl font-bold text-yellow-500">{orders.filter(o => o.status === 'PREPARING').length}</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Ready</div>
                <div className="text-2xl font-bold text-green-500">{orders.filter(o => o.status === 'READY').length}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {loading ? (
            <div className="w-full flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 opacity-50">
              <CheckCircle2 className="w-20 h-20 text-zinc-700 mb-4" />
              <h3 className="text-2xl font-bold text-white">Kitchen is Clear</h3>
              <p className="text-zinc-500">Waiting for incoming orders...</p>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id} 
                className="w-96 flex-shrink-0 flex flex-col bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500"
              >
                {/* Order Header */}
                <div className={cn("p-5 border-b border-white/5", getStatusColor(order.status))}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-70">Order #{order.id.slice(-4)}</span>
                    <div className="flex items-center gap-1.5 text-sm font-bold">
                      <Clock className="w-4 h-4" />
                      {getTimeElapsed(order.createdAt)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold uppercase">{order.status}</h3>
                    {order.status === 'PENDING' && <AlertCircle className="w-6 h-6 animate-bounce" />}
                  </div>
                </div>

                {/* Order Items */}
                <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[300px]">
                  {order.items.map((item, idx) => {
                    const menuItem = menuItems.find(m => m.name === item.name);
                    return (
                      <div key={idx} className="flex justify-between items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="flex gap-4 flex-1">
                          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-yellow-500 font-black text-lg flex-shrink-0 border border-yellow-500/20">
                            {item.quantity}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-bold leading-tight">{item.name}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              {menuItem?.isSpicy && (
                                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20">
                                  <Flame className="w-2.5 h-2.5" /> Spicy
                                </span>
                              )}
                              {menuItem?.isVegan && (
                                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                                  <Leaf className="w-2.5 h-2.5" /> Vegan
                                </span>
                              )}
                              {!menuItem?.isSpicy && !menuItem?.isVegan && (
                                <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Standard Prep</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Actions */}
                <div className="p-5 bg-black/50 border-t border-white/5">
                  <div className="mb-4 text-xs text-zinc-500 flex justify-between">
                    <span>{order.address.split(',')[0]}</span>
                    <span>{order.phone}</span>
                  </div>
                  
                  {updatingId === order.id ? (
                    <div className="w-full py-4 flex justify-center">
                      <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {order.status === 'PENDING' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'PREPARING')}
                          className="col-span-2 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <Play className="w-5 h-5 fill-current" />
                          START PREP
                        </button>
                      )}
                      {order.status === 'PREPARING' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'READY')}
                          className="col-span-2 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <Check className="w-6 h-6 stroke-[3px]" />
                          MARK AS READY
                        </button>
                      )}
                      {order.status === 'READY' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'COMPLETED')}
                          className="col-span-2 py-4 bg-white hover:bg-zinc-200 text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          COMPLETE ORDER
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
