"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  History, 
  Plus, 
  Search, 
  Loader2, 
  ArrowRight,
  Trash2,
  CheckCircle2,
  BarChart2,
  DollarSign,
  User as UserIcon,
  X,
  Download
} from 'lucide-react';
import Image from 'next/image';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

interface WasteLog {
  id: string;
  menuItemId: string;
  quantity: number;
  reason: string;
  createdAt: string;
  staffName: string | null;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [wasteFormData, setWasteFormData] = useState({
    quantity: '1',
    reason: 'Expired',
    staffName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, wasteRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/admin/inventory/waste')
      ]);
      const itemsData = await itemsRes.json();
      const wasteData = await wasteRes.json();
      setItems(itemsData);
      setWasteLogs(wasteData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWasteModal = (item: MenuItem) => {
    setSelectedItem(item);
    setIsWasteModalOpen(true);
  };

  const handleWasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/inventory/waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuItemId: selectedItem.id,
          ...wasteFormData
        }),
      });

      if (res.ok) {
        fetchData();
        setIsWasteModalOpen(false);
        setWasteFormData({ quantity: '1', reason: 'Expired', staffName: '' });
      }
    } catch (err) {
      alert('Failed to log waste');
    } finally {
      setIsSubmitting(false);
    }
  };

  const lowStockItems = items.filter(item => item.stock < 10);
  const totalStockValue = items.reduce((acc, item) => acc + (item.stock * item.price), 0);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">INVENTORY CONTROL</h1>
          <p className="text-zinc-500 font-medium">Real-time stock tracking and waste management.</p>
        </div>
        <button
          onClick={() => window.open('/api/admin/export?type=inventory', '_blank')}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-white/5 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Stock Value</p>
          <div className="text-3xl font-bold text-white tracking-tight">${totalStockValue.toLocaleString()}</div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Critical Stock</p>
          <div className="text-3xl font-bold text-white tracking-tight">{lowStockItems.length} <span className="text-sm font-medium text-zinc-500 italic">Items</span></div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <History className="w-6 h-6" />
            </div>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Waste Logs (30d)</p>
          <div className="text-3xl font-bold text-white tracking-tight">{wasteLogs.length} <span className="text-sm font-medium text-zinc-500 italic">Entries</span></div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Items Online</p>
          <div className="text-3xl font-bold text-white tracking-tight">{items.length} <span className="text-sm font-medium text-zinc-500 italic">SKUs</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stock Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
            <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-xl font-bold text-white">Stock Availability</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Filter by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-yellow-500/50 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-4">Item Details</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4">Current Stock</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/10 flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform relative">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-white font-bold">{item.name}</p>
                            <p className="text-zinc-600 text-[10px] font-mono tracking-tighter uppercase">ID: {item.id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-full border border-white/5">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[10px] font-black mb-1">
                            <span className={item.stock < 10 ? 'text-red-500' : item.stock < 30 ? 'text-yellow-500' : 'text-zinc-500'}>
                              {item.stock < 10 ? 'CRITICAL' : item.stock < 30 ? 'LOW STOCK' : 'OPTIMAL'}
                            </span>
                            <span className="text-white">{item.stock}</span>
                          </div>
                          <div className="h-1.5 bg-black rounded-full overflow-hidden w-32">
                            <div 
                              className={`h-full transition-all duration-1000 ${
                                item.stock < 10 ? 'bg-red-500' : item.stock < 30 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(item.stock, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleOpenWasteModal(item)}
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                        >
                          Log Waste
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Waste Logs & Quick Info */}
        <div className="space-y-8">
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Recent Waste
            </h3>
            <div className="space-y-6">
              {wasteLogs.length === 0 ? (
                <p className="text-zinc-500 text-sm italic">No waste logs recorded today.</p>
              ) : (
                wasteLogs.map((log) => {
                  const item = items.find(i => i.id === log.menuItemId);
                  return (
                    <div key={log.id} className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center text-red-500 shrink-0 group-hover:bg-red-500 group-hover:text-white transition-all">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-start">
                          <p className="text-white text-sm font-bold truncate">{item?.name || 'Unknown Item'}</p>
                          <span className="text-red-500 text-xs font-black">-{log.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-zinc-500 text-[10px] uppercase font-bold">{log.reason}</p>
                          <p className="text-zinc-600 text-[9px] font-mono">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5">
              View Full History
            </button>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-[2.5rem] p-8 shadow-xl shadow-yellow-500/10">
            <BarChart2 className="w-10 h-10 text-black mb-6" />
            <h4 className="text-2xl font-black text-black leading-tight mb-2">Inventory Insights</h4>
            <p className="text-black/70 text-sm font-medium mb-6">
              Your most wasted item this week is <span className="font-bold text-black italic">Avocado Toast</span>. Consider adjusting prep levels.
            </p>
            <button className="w-full py-4 bg-black text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform">
              Optimization Report
            </button>
          </div>
        </div>
      </div>

      {/* Waste Modal */}
      {isWasteModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsWasteModalOpen(false)} />
          <div className="relative bg-zinc-900 border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div>
                <h2 className="text-2xl font-bold text-white">Log Waste</h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Reporting for: {selectedItem.name}</p>
              </div>
              <button onClick={() => setIsWasteModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleWasteSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Quantity</label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    max={selectedItem.stock}
                    value={wasteFormData.quantity}
                    onChange={e => setWasteFormData({...wasteFormData, quantity: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-red-500/50 outline-none font-bold"
                  />
                  <p className="text-[10px] text-zinc-600">Available: {selectedItem.stock}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Reason</label>
                  <select 
                    value={wasteFormData.reason}
                    onChange={e => setWasteFormData({...wasteFormData, reason: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-red-500/50 outline-none appearance-none"
                  >
                    <option value="Expired">Expired</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Incorrect Prep">Incorrect Prep</option>
                    <option value="Spillage">Spillage</option>
                    <option value="Customer Return">Customer Return</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Reported By (Staff Name)</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="e.g. Chef Chidi"
                    value={wasteFormData.staffName}
                    onChange={e => setWasteFormData({...wasteFormData, staffName: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-red-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsWasteModalOpen(false)}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-red-500 disabled:opacity-50 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Loss'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
