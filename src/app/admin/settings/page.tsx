"use client";

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Building2, 
  DollarSign, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ShieldCheck,
  Loader2,
  Bell,
  Clock
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Configuration updated successfully.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update configuration.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
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
    <div className="max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">PLATFORM SETTINGS</h1>
          <p className="text-zinc-500 font-medium">Control global parameters and brand identity.</p>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Apply Changes
        </button>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-2xl border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
        } text-sm font-bold animate-in fade-in slide-in-from-top-2`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Brand Identity */}
        <section className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Brand Identity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Restaurant Name</label>
              <input 
                type="text" 
                value={settings.restaurantName}
                onChange={e => setSettings({...settings, restaurantName: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Global Currency</label>
              <input 
                type="text" 
                value={settings.currency}
                onChange={e => setSettings({...settings, currency: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Financials & Operations */}
        <section className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
              <DollarSign className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Financials & Logistics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Tax Rate (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={settings.taxRate}
                onChange={e => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Flat Delivery Fee ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={settings.deliveryFee}
                onChange={e => setSettings({...settings, deliveryFee: parseFloat(e.target.value)})}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Contact & Global Presence */}
        <section className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Contact & Location</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Support Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                  <input 
                    type="email" 
                    value={settings.contactEmail}
                    onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Support Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                  <input 
                    type="text" 
                    value={settings.contactPhone}
                    onChange={e => setSettings({...settings, contactPhone: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">HQ Physical Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                <input 
                  type="text" 
                  value={settings.address}
                  onChange={e => setSettings({...settings, address: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-yellow-500/50 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Global Operational Status */}
        <section className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Operational Mode</h2>
                <p className="text-zinc-500 text-xs font-medium">Control the global availability of the platform.</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.isOpen}
                onChange={e => setSettings({...settings, isOpen: e.target.checked})}
              />
              <div className="w-14 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-500"></div>
              <span className="ml-3 text-sm font-bold text-zinc-400 peer-checked:text-white uppercase tracking-widest">
                {settings.isOpen ? 'Publicly Open' : 'Maintenance'}
              </span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
