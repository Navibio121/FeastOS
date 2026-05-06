"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  AlertCircle,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Filter
} from 'lucide-react';

interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  zone: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  specialRequest: string | null;
  location?: { name: string };
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/admin/reservations');
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReservations = reservations.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.phone.includes(searchQuery) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'ARRIVED': return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'NO_SHOW': return <AlertCircle className="w-4 h-4 text-zinc-500" />;
      default: return null;
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
          <h1 className="text-4xl font-bold text-white tracking-tight">GUEST BOOKINGS</h1>
          <p className="text-zinc-500 font-medium">Manage table assignments and guest arrivals.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
            />
          </div>
          <button className="p-4 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white rounded-2xl transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredReservations.map((res) => (
          <div 
            key={res.id} 
            className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 hover:border-white/10 transition-all group"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              {/* Guest Meta */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-yellow-500 border border-white/5">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{res.name}</h3>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3 h-3 text-yellow-500" /> {res.location?.name || 'Main Branch'}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    res.status === 'ARRIVED' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    res.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    res.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    'bg-zinc-800 text-zinc-500'
                  }`}>
                    {getStatusIcon(res.status)}
                    {res.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Time
                    </p>
                    <p className="text-white font-bold">{res.date} • {res.time}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> Party Size
                    </p>
                    <p className="text-white font-bold">{res.guests} Guests</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Zone</p>
                    <p className="text-white font-bold uppercase tracking-tighter">{res.zone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Booking ID</p>
                    <p className="text-white font-mono text-xs opacity-50">#{res.id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>

                {res.specialRequest && (
                  <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl italic text-zinc-400 text-sm">
                    <span className="text-yellow-500 font-black not-italic text-[10px] uppercase tracking-widest block mb-1">Special Request</span>
                    &quot;{res.specialRequest}&quot;
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="w-full lg:w-72 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2 col-span-2">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-2 text-center">Contact Guest</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-px h-6 bg-white/5 mx-auto hidden lg:block" />

                {['ARRIVED', 'CONFIRMED', 'CANCELLED', 'NO_SHOW'].map((status) => (
                  <button
                    key={status}
                    disabled={res.status === status || updatingId === res.id}
                    onClick={() => handleStatusUpdate(res.id, status)}
                    className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      res.status === status 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50' 
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {updatingId === res.id && res.status !== status ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        {getStatusIcon(status)}
                        Mark {status}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
