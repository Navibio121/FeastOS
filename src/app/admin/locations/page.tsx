"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  Image as ImageIcon,
  Phone,
  Navigation,
  Globe
} from 'lucide-react';
import Image from 'next/image';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  image: string;
  lat: number;
  lng: number;
  isOpen: boolean;
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Location | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Lagos',
    phone: '',
    image: '',
    lat: '6.5244',
    lng: '3.3792',
    isOpen: true,
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations');
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (loc: Location | null = null) => {
    if (loc) {
      setEditingLoc(loc);
      setFormData({
        name: loc.name,
        address: loc.address,
        city: loc.city,
        phone: loc.phone,
        image: loc.image,
        lat: loc.lat.toString(),
        lng: loc.lng.toString(),
        isOpen: loc.isOpen,
      });
    } else {
      setEditingLoc(null);
      setFormData({
        name: '',
        address: '',
        city: 'Lagos',
        phone: '',
        image: '',
        lat: '6.5244',
        lng: '3.3792',
        isOpen: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingLoc ? 'PATCH' : 'POST';
      const body = editingLoc ? { id: editingLoc.id, ...formData } : formData;

      const res = await fetch('/api/admin/locations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchLocations();
        setIsModalOpen(false);
      } else {
        alert('Failed to save location');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location? This may affect orders and reservations.')) return;

    try {
      const res = await fetch(`/api/admin/locations?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setLocations(prev => prev.filter(loc => loc.id !== id));
      } else {
        alert('Failed to delete location');
      }
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
          <h1 className="text-4xl font-bold text-white tracking-tight text-white">BRANCH NETWORK</h1>
          <p className="text-zinc-500 font-medium">Manage geographic expansion and operational status.</p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus className="w-5 h-5" />
          Add New Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div 
            key={loc.id} 
            className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/10 transition-all group"
          >
            <div className="h-48 relative overflow-hidden">
              <Image src={loc.image} alt={loc.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${
                  loc.isOpen ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'
                }`}>
                  {loc.isOpen ? 'Active' : 'Closed'}
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{loc.name}</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                    <Globe className="w-3 h-3 text-yellow-500" /> {loc.city}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(loc)}
                    className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-xl transition-all text-zinc-400"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(loc.id)}
                    className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-xl transition-all text-zinc-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <p className="text-zinc-400 text-sm leading-relaxed">{loc.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-zinc-600" />
                  <p className="text-zinc-400 text-sm font-mono">{loc.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Navigation className="w-4 h-4 text-zinc-600" />
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">GPS: {loc.lat}, {loc.lng}</p>
                </div>
              </div>

              <button className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-2xl transition-all uppercase tracking-widest border border-white/5">
                View Performance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-2xl font-bold text-white">
                {editingLoc ? 'Edit Branch' : 'Register New Branch'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Branch Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Victoria Island Elite"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">City</label>
                  <input 
                    required
                    type="text" 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    placeholder="Lagos"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Full Address</label>
                  <input 
                    required
                    type="text" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="123 Culinary Way, VI, Lagos"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Phone Number</label>
                  <input 
                    required
                    type="text" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+234 ..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Header Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                    <input 
                      required
                      type="text" 
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      placeholder="https://unsplash.com/..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-yellow-500/50 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Latitude</label>
                  <input 
                    required
                    type="text" 
                    value={formData.lat}
                    onChange={e => setFormData({...formData, lat: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Longitude</label>
                  <input 
                    required
                    type="text" 
                    value={formData.lng}
                    onChange={e => setFormData({...formData, lng: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-4 border-y border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isOpen}
                    onChange={e => setFormData({...formData, isOpen: e.target.checked})}
                    className="hidden"
                  />
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isOpen ? 'bg-green-500' : 'bg-zinc-800'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isOpen ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">
                    Operational (Accepting Orders)
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
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingLoc ? 'Update Branch' : 'Register Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
