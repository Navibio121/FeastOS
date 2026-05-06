"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/globals/Navbar';
import { 
  Sparkles, 
  ChefHat, 
  Loader2, 
  ArrowRight,
  Flame,
  Leaf,
  Star,
  RefreshCw,
  ShoppingCart,
  Heart,
  Info
} from 'lucide-react';
import Image from 'next/image';

const MOODS = [
  { id: 'adventurous', label: 'Adventurous', emoji: '🌶️', desc: 'Bold & Exciting', color: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
  { id: 'romantic', label: 'Romantic', emoji: '🥂', desc: 'Indulgent & Premium', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', glow: 'shadow-pink-500/20' },
  { id: 'comfort', label: 'Comfort', emoji: '🍲', desc: 'Warm & Satisfying', color: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
  { id: 'healthy', label: 'Healthy', emoji: '🥗', desc: 'Fresh & Nourishing', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', glow: 'shadow-green-500/20' },
  { id: 'celebratory', label: 'Celebratory', emoji: '🎉', desc: 'Showstopping', color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  { id: 'relaxed', label: 'Relaxed', emoji: '😌', desc: 'Easy & Casual', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
];

const DIETARY = [
  { id: 'none', label: 'No Preference', emoji: '🍽️' },
  { id: 'vegan', label: 'Vegan Only', emoji: '🌱' },
  { id: 'spicy', label: 'Extra Spicy', emoji: '🔥' },
];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVegan: boolean;
  isSpicy: boolean;
  stock: number;
}

interface MoodResult {
  mood: string;
  moodProfile: { description: string; emoji: string };
  curation: {
    starters: MenuItem[];
    mains: MenuItem[];
    desserts: MenuItem[];
    sides: MenuItem[];
  };
  topPicks: MenuItem[];
  totalItems: number;
}

function DishCard({ item, rank }: { item: MenuItem; rank?: number }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group bg-zinc-900/60 border border-white/5 rounded-3xl overflow-hidden hover:border-yellow-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1">
      <div className="relative h-40 overflow-hidden bg-black">
        <Image 
          src={item.image} 
          alt={item.name} 
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {rank && (
          <div className="absolute top-3 left-3 w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black text-xs shadow-lg">
            {rank}
          </div>
        )}

        <button 
          onClick={() => setLiked(!liked)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${liked ? 'bg-red-500 text-white' : 'bg-black/50 text-zinc-400 hover:text-white'}`}
        >
          <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {item.isSpicy && (
            <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-red-400 bg-black/70 backdrop-blur px-2 py-1 rounded-full border border-red-400/30">
              <Flame className="w-2.5 h-2.5" /> Spicy
            </span>
          )}
          {item.isVegan && (
            <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-green-400 bg-black/70 backdrop-blur px-2 py-1 rounded-full border border-green-400/30">
              <Leaf className="w-2.5 h-2.5" /> Vegan
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-white font-bold leading-tight flex-1 pr-2">{item.name}</h4>
          <span className="text-yellow-500 font-black text-lg">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 bg-zinc-800 px-2 py-1 rounded-full">
            {item.category}
          </span>
          <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-yellow-500 hover:text-yellow-400 transition-colors">
            <ShoppingCart className="w-3 h-3" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MoodToMealPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedDietary, setSelectedDietary] = useState('none');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MoodResult | null>(null);
  const [activeTab, setActiveTab] = useState<'topPicks' | 'starters' | 'mains' | 'desserts' | 'sides'>('topPicks');

  const handleGenerate = async () => {
    if (!selectedMood) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/mood-to-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, dietaryPreference: selectedDietary }),
      });
      const data = await res.json();
      setResult(data);
      setActiveTab('topPicks');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedMood(null);
    setSelectedDietary('none');
  };

  const activeMood = MOODS.find(m => m.id === selectedMood);
  const tabItems = result ? (activeTab === 'topPicks' ? result.topPicks : result.curation[activeTab]) : [];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500 text-[11px] font-black uppercase tracking-[0.2em]">AI-Powered Curation Engine</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6">
            MOOD TO<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">MEAL</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Tell us how you feel. Our culinary intelligence engine will curate a personalized dining experience 
            tailored precisely to your emotional state.
          </p>
        </div>
      </section>

      {/* Configurator */}
      {!result && (
        <section className="max-w-5xl mx-auto px-6 pb-24">
          {/* Step 1: Mood Selection */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black text-sm">1</div>
              <h2 className="text-2xl font-black text-white">How are you feeling tonight?</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`relative group p-6 rounded-3xl border text-left transition-all duration-300 ${
                    selectedMood === mood.id 
                      ? `bg-gradient-to-br ${mood.color} ${mood.border} shadow-2xl ${mood.glow} scale-105` 
                      : 'bg-zinc-900/50 border-white/5 hover:border-white/15 hover:bg-zinc-900'
                  }`}
                >
                  <div className="text-4xl mb-3">{mood.emoji}</div>
                  <h3 className="text-white font-black text-lg mb-1">{mood.label}</h3>
                  <p className="text-zinc-500 text-xs font-bold">{mood.desc}</p>
                  {selectedMood === mood.id && (
                    <div className="absolute top-4 right-4 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Dietary Preference */}
          {selectedMood && (
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black text-sm">2</div>
                <h2 className="text-2xl font-black text-white">Any dietary preferences?</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {DIETARY.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDietary(d.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl border font-bold text-sm transition-all ${
                      selectedDietary === d.id 
                        ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{d.emoji}</span>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          {selectedMood && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full group relative py-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-xl rounded-3xl hover:opacity-90 transition-all disabled:opacity-50 shadow-2xl shadow-yellow-500/20 flex items-center justify-center gap-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isLoading ? (
                  <>
                    <Loader2 className="w-7 h-7 animate-spin" />
                    <span>Curating Your Experience...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-7 h-7" />
                    <span>Generate My {activeMood?.emoji} {activeMood?.label} Menu</span>
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Results */}
      {result && (
        <section className="max-w-6xl mx-auto px-6 pb-24 animate-in fade-in duration-700">
          {/* Result Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl">{result.moodProfile.emoji}</span>
                <div>
                  <h2 className="text-4xl font-black text-white capitalize">{result.mood} Menu</h2>
                  <p className="text-zinc-400 font-medium">{result.moodProfile.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{result.totalItems} dishes analyzed · {result.topPicks.length} top picks curated</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-white/10 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Another Mood
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {(['topPicks', 'starters', 'mains', 'desserts', 'sides'] as const).map((tab) => {
              const count = tab === 'topPicks' ? result.topPicks.length : result.curation[tab].length;
              if (count === 0) return null;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                      : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab === 'topPicks' ? '⭐ Top Picks' : tab} ({count})
                </button>
              );
            })}
          </div>

          {/* Dish Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tabItems.map((item, idx) => (
              <DishCard 
                key={item.id} 
                item={item} 
                rank={activeTab === 'topPicks' ? idx + 1 : undefined}
              />
            ))}
          </div>

          {/* Chef Note */}
          <div className="mt-12 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-3xl p-8 flex gap-6 items-start">
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-6 h-6 text-black" />
            </div>
            <div>
              <h4 className="text-white font-black text-lg mb-2">Chef&apos;s Note</h4>
              <p className="text-zinc-400 leading-relaxed">
                This curation was tailored specifically for a <span className="text-yellow-500 font-bold capitalize">{result.mood}</span> dining experience. 
                Each dish has been scored across flavor profile, dietary alignment, price point, and seasonal availability 
                to ensure the perfect match for your mood tonight.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
