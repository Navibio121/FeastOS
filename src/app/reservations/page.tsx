"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/globals/Navbar';
import { Calendar, Users, Clock, MapPin, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useUIStore } from '@/store/uiStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TIME_SLOTS = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
const ZONES = [
  { id: 'indoor', name: 'Indoor Dining', description: 'Cozy and elegant main hall' },
  { id: 'outdoor', name: 'Terrace Garden', description: 'Fresh air and city views' },
  { id: 'private', name: 'Private Suite', description: 'Exclusive intimate space' },
];

export default function ReservationsPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    guests: '2',
    time: '',
    zone: 'indoor',
    name: '',
    email: '',
    phone: '',
    specialRequest: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create reservation');
      }
      nextStep();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen pb-20">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center justify-center gap-2 text-zinc-500 text-sm mb-4">
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-yellow-500">Reservations</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">RESERVE A TABLE</h1>
          <p className="text-zinc-400">
            Secure your spot for an unforgettable culinary journey. 
            We recommend booking at least 48 hours in advance for weekend dinners.
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="max-w-4xl mx-auto px-4">
        {step <= 2 && (
          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 -z-10" />
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 border-2",
              step >= 1 ? "bg-yellow-500 border-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]" : "bg-zinc-900 border-zinc-700 text-zinc-500"
            )}>1</div>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 border-2",
              step >= 2 ? "bg-yellow-500 border-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]" : "bg-zinc-900 border-zinc-700 text-zinc-500"
            )}>2</div>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 border-2",
              step >= 3 ? "bg-yellow-500 border-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]" : "bg-zinc-900 border-zinc-700 text-zinc-500"
            )}>3</div>
          </div>
        )}

        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Select Date
                  </label>
                  <input 
                    type="date" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                {/* Guest Selection */}
                <div className="space-y-2">
                  <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" /> Party Size
                  </label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                    ))}
                    <option value="9+">Large Party (9+)</option>
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-4">
                <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Available Times
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {TIME_SLOTS.map(time => (
                    <button
                      key={time}
                      onClick={() => setFormData({...formData, time})}
                      className={cn(
                        "py-3 rounded-xl text-sm font-bold border transition-all",
                        formData.time === time 
                        ? "bg-yellow-500 border-yellow-500 text-black" 
                        : "bg-black/50 border-white/10 text-zinc-400 hover:border-yellow-500/50 hover:text-white"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone Selection */}
              <div className="space-y-4">
                <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Dining Zone
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {ZONES.map(zone => (
                    <button
                      key={zone.id}
                      onClick={() => setFormData({...formData, zone: zone.id})}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all",
                        formData.zone === zone.id 
                        ? "bg-yellow-500/10 border-yellow-500" 
                        : "bg-black/50 border-white/10 hover:border-white/20"
                      )}
                    >
                      <h4 className={cn("font-bold mb-1", formData.zone === zone.id ? "text-yellow-500" : "text-white")}>
                        {zone.name}
                      </h4>
                      <p className="text-zinc-500 text-xs">{zone.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={!formData.date || !formData.time}
                onClick={() => {
                  if (!session) {
                    useUIStore.getState().openAuthModal();
                  } else {
                    nextStep();
                  }
                }}
                className="w-full py-4 bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-yellow-500/10"
              >
                Continue to Personal Details
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-400 text-sm font-medium">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-sm font-medium">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-zinc-400 text-sm font-medium">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-zinc-400 text-sm font-medium">Special Requests (Optional)</label>
                  <textarea 
                    rows={4}
                    placeholder="Birthdays, allergies, or table preferences..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none resize-none"
                    value={formData.specialRequest}
                    onChange={e => setFormData({...formData, specialRequest: e.target.value})}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className="w-1/3 py-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-70 text-black font-bold rounded-2xl transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Confirming...</> : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(234,179,8,0.4)]">
                <CheckCircle2 className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">RESERVATION CONFIRMED!</h2>
              <p className="text-zinc-400 mb-8">
                We&apos;ve sent a confirmation email to <span className="text-white font-medium">{formData.email}</span>.
              </p>
              
              <div className="bg-black/50 rounded-2xl p-6 text-left max-w-sm mx-auto border border-white/5 space-y-4 mb-10">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">Date</span>
                  <span className="text-white font-bold">{formData.date}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">Time</span>
                  <span className="text-white font-bold">{formData.time}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">Guests</span>
                  <span className="text-white font-bold">{formData.guests} People</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location</span>
                  <span className="text-white font-bold capitalize">{formData.zone}</span>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = '/'}
                className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
