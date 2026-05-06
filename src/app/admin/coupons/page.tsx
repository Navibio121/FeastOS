"use client";

import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  Percent, 
  Calendar,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discount: '10',
    isActive: true,
    expiresAt: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon: Coupon | null = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount: coupon.discount.toString(),
        isActive: coupon.isActive,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discount: '10',
        isActive: true,
        expiresAt: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingCoupon ? 'PATCH' : 'POST';
      const body = editingCoupon ? { id: editingCoupon.id, ...formData } : formData;

      const res = await fetch('/api/admin/coupons', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchCoupons();
        setIsModalOpen(false);
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      if (res.ok) setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('An error occurred');
    }
  };

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
          <h1 className="text-4xl font-bold text-white tracking-tight">PROMOTIONS</h1>
          <p className="text-zinc-500 font-medium">Manage loyalty incentives and seasonal campaigns.</p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div 
            key={coupon.id} 
            className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 hover:border-white/10 transition-all group relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-all" />
            
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-yellow-500 border border-white/5 group-hover:scale-110 transition-transform">
                <Ticket className="w-7 h-7" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(coupon)}
                  className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-xl transition-all text-zinc-400"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(coupon.id)}
                  className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-xl transition-all text-zinc-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-black text-white tracking-tighter mb-2 group-hover:text-yellow-500 transition-colors">
                {coupon.code}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  coupon.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                  Created {new Date(coupon.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  <Percent className="w-3 h-3" /> Discount
                </div>
                <div className="text-xl font-bold text-white">{coupon.discount}% OFF</div>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  <Calendar className="w-3 h-3" /> Expires
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-2xl font-bold text-white">
                {editingCoupon ? 'Edit Promotion' : 'New Promotion'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Promotion Code</label>
                <input 
                  required
                  type="text" 
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  placeholder="FEAST25"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none uppercase font-bold tracking-widest"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Discount (%)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.discount}
                    onChange={e => setFormData({...formData, discount: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Expiry Date</label>
                  <input 
                    type="date" 
                    value={formData.expiresAt}
                    onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-4 border-y border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="hidden"
                  />
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-zinc-800'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">
                    Campaign is Active
                  </span>
                </label>
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
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingCoupon ? 'Update Campaign' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
