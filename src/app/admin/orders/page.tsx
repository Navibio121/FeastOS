"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MoreVertical, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Truck,
  ExternalLink,
  MapPin,
  Phone,
  Download,
  Printer
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  address: string;
  phone: string;
  location?: {
    name: string;
    city: string;
  };
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/all');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4 text-red-500" />;
      case 'PREPARING': return <ChefHat className="w-4 h-4 text-yellow-500" />;
      case 'READY': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.phone.includes(searchQuery) ||
                         order.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
      </div>
    );
  }

  const handleExportCSV = () => {
    window.open('/api/admin/export?type=orders', '_blank');
  };

  const handlePrintReceipt = (order: Order) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Receipt #${order.id.slice(-6).toUpperCase()}</title>
      <style>body{font-family:monospace;max-width:400px;margin:auto;padding:20px}h2{text-align:center}hr{border:1px dashed #ccc}.row{display:flex;justify-content:space-between}.total{font-size:1.2em;font-weight:bold}</style></head>
      <body>
        <h2>🍽️ FeastOS Elite Dining</h2><hr/>
        <p>Order: #${order.id.slice(-6).toUpperCase()}</p>
        <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
        <p>Status: ${order.status}</p><hr/>
        ${order.items.map(i => `<div class='row'><span>${i.quantity}x ${i.name}</span><span>$${(i.price * i.quantity).toFixed(2)}</span></div>`).join('')}
        <hr/><div class='row total'><span>TOTAL</span><span>$${order.total.toFixed(2)}</span></div>
        <hr/><p style='text-align:center;color:#888'>Thank you for dining with us!</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">ORDER LOGISTICS</h1>
          <p className="text-zinc-500 font-medium">Manage fulfillment and real-time delivery status.</p>
        </div>

        <div className="flex items-center gap-4 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
          {['ALL', 'PENDING', 'PREPARING', 'READY', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                selectedStatus === status 
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/10' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-white/5 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by ID, phone, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
          />
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Active Orders</p>
          <p className="text-2xl font-bold text-white">{orders.filter(o => o.status !== 'COMPLETED').length}</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Efficiency Rate</p>
          <p className="text-2xl font-bold text-white">98.4%</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-20 text-center">
            <ShoppingBag className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">No orders found matching your criteria.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all group"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                {/* Order Meta */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-yellow-500 font-bold border border-white/5">
                        {order.status === 'COMPLETED' ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <ShoppingBag className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          #{order.id.slice(-6).toUpperCase()}
                          <span className="px-2 py-0.5 bg-white/5 text-zinc-500 text-[10px] rounded uppercase font-mono">{order.id}</span>
                        </h3>
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                      order.status === 'PENDING' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    }`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-zinc-600 mt-0.5" />
                        <div>
                          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Delivery Address</p>
                          <p className="text-white text-sm font-medium">{order.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-zinc-600 mt-0.5" />
                        <div>
                          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Customer Phone</p>
                          <p className="text-white text-sm font-medium font-mono">{order.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                      <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-3">Order Items</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs">
                            <span className="text-zinc-400"><span className="text-white font-bold">{item.quantity}x</span> {item.name}</span>
                            <span className="text-zinc-500 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Total Value</span>
                        <span className="text-lg font-bold text-yellow-500">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full lg:w-64 flex flex-col gap-3">
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest text-center mb-2">Change Status</p>
                  
                  {['PENDING', 'PREPARING', 'READY', 'COMPLETED'].map((status) => (
                    <button
                      key={status}
                      disabled={order.status === status || updatingId === order.id}
                      onClick={() => handleStatusUpdate(order.id, status)}
                      className={`w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        order.status === status 
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50' 
                          : 'bg-white/5 text-white hover:bg-white/10 active:scale-95'
                      }`}
                    >
                      {updatingId === order.id && order.status !== status ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          {getStatusIcon(status)}
                          Set to {status}
                        </>
                      )}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePrintReceipt(order)}
                    className="mt-4 w-full py-3 border border-white/5 text-zinc-500 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:border-white/20"
                  >
                    <Printer className="w-3 h-3" />
                    Print Receipt
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
