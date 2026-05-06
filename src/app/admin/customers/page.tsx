"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Users, 
  Search, 
  Trophy, 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  MoreVertical, 
  Loader2,
  Mail,
  ShieldCheck,
  User as UserIcon,
  Download,
  X
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  points: number;
  orderCount: number;
  reservationCount: number;
  totalSpend: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPoints, setNewPoints] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setNewPoints(customer.points.toString());
    setIsModalOpen(true);
  };

  const handleUpdatePoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCustomer.id, points: newPoints }),
      });

      if (res.ok) {
        setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, points: parseInt(newPoints) } : c));
        setIsModalOpen(false);
      }
    } catch (err) {
      alert('Failed to update points');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTier = (points: number) => {
    if (points >= 5000) return { name: 'Platinum', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' };
    if (points >= 1500) return { name: 'Gold', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    if (points >= 500) return { name: 'Silver', color: 'text-zinc-400', bg: 'bg-zinc-400/10', border: 'border-zinc-400/20' };
    return { name: 'Bronze', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">CUSTOMER CRM</h1>
          <p className="text-zinc-500 font-medium">Insights into user loyalty and lifetime value.</p>
        </div>
        <button
          onClick={() => window.open('/api/admin/export?type=customers', '_blank')}
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
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
          />
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Elite Members</p>
          <p className="text-2xl font-bold text-white">{customers.filter(c => c.points > 1000).length}</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Avg Lifetime Value</p>
          <p className="text-2xl font-bold text-white">
            ${(customers.reduce((acc, c) => acc + c.totalSpend, 0) / (customers.length || 1)).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => {
          const tier = getTier(customer.points);
          return (
            <div 
              key={customer.id} 
              className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-colors" />

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {customer.image ? (
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                        <Image src={customer.image} alt={customer.name || ''} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-black rounded-2xl border border-white/5 flex items-center justify-center text-zinc-500">
                        <UserIcon className="w-6 h-6" />
                      </div>
                    )}
                    {customer.role === 'ADMIN' && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-zinc-900 shadow-lg">
                        <ShieldCheck className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold tracking-tight">{customer.name || 'Anonymous'}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${tier.bg} ${tier.color} ${tier.border}`}>
                        {tier.name}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-xs flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3" /> {customer.email}
                    </p>
                  </div>
                </div>
              <button className="text-zinc-600 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/40 rounded-2xl p-3 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-none">Points</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-white leading-none">{customer.points}</p>
              </div>
              <div className="bg-black/40 rounded-2xl p-3 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-3 h-3 text-green-500" />
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-none">Spent</span>
                </div>
                <p className="text-lg font-bold text-white leading-none">${customer.totalSpend.toFixed(0)}</p>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-zinc-400 font-medium">
                  <ShoppingBag className="w-4 h-4 text-zinc-600" />
                  Total Orders
                </div>
                <span className="text-white font-bold">{customer.orderCount}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-zinc-400 font-medium">
                  <Calendar className="w-4 h-4 text-zinc-600" />
                  Reservations
                </div>
                <span className="text-white font-bold">{customer.reservationCount}</span>
              </div>
            </div>

            <button 
              onClick={() => handleOpenEdit(customer)}
              className="w-full mt-6 py-3 bg-white/5 hover:bg-yellow-500 hover:text-black text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5"
            >
              Adjust Loyalty Points
            </button>
          </div>
        )})}
      </div>

      {/* Edit Points Modal */}
      {isModalOpen && editingCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-zinc-900 border border-white/10 rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-2xl font-bold text-white">Adjust Points</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdatePoints} className="p-8 space-y-6">
              <div className="text-center mb-4">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Customer</p>
                <p className="text-white font-bold text-lg">{editingCustomer.name || editingCustomer.email}</p>
              </div>

              <div className="space-y-2">
                <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest text-center block">Total Loyalty Points</label>
                <input 
                  required
                  type="number" 
                  value={newPoints}
                  onChange={e => setNewPoints(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-center text-4xl font-black text-yellow-500 focus:border-yellow-500/50 outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-yellow-500 disabled:opacity-50 text-black font-extrabold rounded-2xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
