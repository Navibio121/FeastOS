"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation, Phone, Check, Loader2 } from 'lucide-react';
import { useLocationStore, Location } from '@/store/locationStore';
import Image from 'next/image';


export const LocationSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedLocation, setLocation } = useLocationStore();

  useEffect(() => {
    // Show modal if no location is selected
    if (!selectedLocation) {
      setIsOpen(true);
    }
  }, [selectedLocation]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/locations');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLocations(data);
      } else {
        console.error("Invalid locations data:", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen]);

  return (
    <>
      {/* Navbar Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 rounded-full transition-all group"
      >
        <MapPin className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest hidden md:block">
          {selectedLocation ? selectedLocation.name : 'Select Location'}
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => selectedLocation && setIsOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-zinc-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">SELECT YOUR <span className="text-zinc-600 italic">BRANCH</span></h2>
                  <p className="text-zinc-500 text-sm mt-1">Experience the FeastOS standard at your nearest location.</p>
                </div>
                {selectedLocation && (
                  <button onClick={() => setIsOpen(false)} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all">
                    <X className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>

              {/* Grid */}
              <div className="p-8 max-h-[60vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 custom-scrollbar">
                {loading ? (
                  <div className="col-span-full py-20 flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Locating Branches...</p>
                  </div>
                ) : (
                  locations.map((loc) => (
                    <motion.div 
                      key={loc.id}
                      whileHover={{ y: -5 }}
                      onClick={() => {
                        setLocation(loc);
                        setIsOpen(false);
                      }}
                      className={`relative group cursor-pointer rounded-3xl overflow-hidden border-2 transition-all duration-500 ${
                        selectedLocation?.id === loc.id ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      {/* Image Background */}
                      <div className="absolute inset-0">
                        <Image 
                          src={loc.image} 
                          alt={loc.name} 
                          fill
                          className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="relative p-8 h-64 flex flex-col justify-end">
                        <div className="flex justify-between items-end">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">{loc.name}</h3>
                            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                              <MapPin className="w-3 h-3 text-yellow-500" /> {loc.address}
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                              <Phone className="w-3 h-3 text-yellow-500" /> {loc.phone}
                            </div>
                          </div>
                          
                          {selectedLocation?.id === loc.id ? (
                            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Check className="w-6 h-6 text-black" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Navigation className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-8 bg-black/20 border-t border-white/5 flex justify-center">
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">FeastOS Global Operations — 2026</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
