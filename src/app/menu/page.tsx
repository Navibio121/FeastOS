"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/globals/Navbar';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { MenuDetailsSidebar } from '@/components/menu/MenuDetailsSidebar';
import { MenuCardSkeleton } from '@/components/globals/Skeleton';
import { Search, Filter, ChevronRight, Loader2, Sparkles, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useMoodStore } from '@/store/moodStore';
import { AIChat } from '@/components/menu/AIChat';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/providers/ToastProvider';
import { useUIStore } from '@/store/uiStore';

export default function MenuPage() {
  const { data: session, status } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showVeganOnly, setShowVeganOnly] = useState(false);
  const [showSpicyOnly, setShowSpicyOnly] = useState(false);
  const { selectedMoodId, setMood } = useMoodStore();

  useEffect(() => {
    fetch(`/api/menu/recommendations${selectedMoodId ? `?moodId=${selectedMoodId}` : ''}`)
      .then(res => res.json())
      .then(data => setRecommendations(data))
      .catch(err => console.error(err));
  }, [selectedMoodId]);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch menu", err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVegan = !showVeganOnly || item.isVegan;
    const matchesSpicy = !showSpicyOnly || item.isSpicy;
    return matchesCategory && matchesSearch && matchesVegan && matchesSpicy;
  });

  const featuredItems = menuItems.filter(item => item.isFeatured);

  const isAuthenticated = status === 'authenticated';

  return (
    <div className="bg-black min-h-screen pb-20">
      <Navbar />
      
      {/* Premium Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-yellow-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-6">
                <Sparkles className="w-4 h-4" /> The Collection
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
                CURATED <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-yellow-500 to-zinc-500">EXCELLENCE</span>
              </h1>
              <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">
                Explore a fusion of high-end international cuisine and authentic Nigerian heritage. 
                {!isAuthenticated && " Sign in to view exclusive ingredients and pricing."}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-[450px] group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="What are you craving today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-white focus:outline-none focus:border-yellow-500/50 transition-all text-lg font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-[72px] z-40 bg-black/60 backdrop-blur-2xl border-y border-white/5 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-10">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === category 
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                  : 'bg-white/5 text-zinc-500 hover:text-white border border-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setShowVeganOnly(!showVeganOnly)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all ${
                showVeganOnly ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${showVeganOnly ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">Vegan Only</span>
            </button>
            
            <button 
              onClick={() => setShowSpicyOnly(!showSpicyOnly)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all ${
                showSpicyOnly ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${showSpicyOnly ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">Spicy Only</span>
            </button>

            {(showVeganOnly || showSpicyOnly || activeCategory !== 'All' || searchQuery) && (
              <button 
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                  setShowVeganOnly(false);
                  setShowSpicyOnly(false);
                }}
                className="text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:underline px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {!loading && featuredItems.length > 0 && activeCategory === 'All' && !searchQuery && (
        <section className="max-w-7xl mx-auto px-4 pt-16 pb-8">
          <div className="flex items-center gap-2 text-yellow-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-8">
            <Star className="w-4 h-4" /> Chef&apos;s Recommendations
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredItems.slice(0, 3).map((item) => (
              <MenuItemCard 
                key={`featured-${item.id}`} 
                {...item} 
                isAuthenticated={isAuthenticated}
                onClick={() => {
                  if (!isAuthenticated) {
                    useUIStore.getState().openAuthModal();
                  } else {
                    setSelectedItem(item);
                  }
                }}
              />
            ))}
          </div>
          <div className="w-full h-px bg-white/5 mt-20" />
        </section>
      )}

      {/* Menu Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {/* AI Recommendations */}
        <AnimatePresence>
          {!loading && recommendations.length > 0 && activeCategory === 'All' && !searchQuery && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">SUGGESTED <span className="text-zinc-600">FOR YOU</span></h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Feast-AI Personal Selection</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((item) => (
                  <MenuItemCard 
                    key={`rec-${item.id}`} 
                    {...item} 
                    isAuthenticated={isAuthenticated}
                    onClick={() => {
                      if (!isAuthenticated) {
                        useUIStore.getState().openAuthModal();
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                  />
                ))}
              </div>
              <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <MenuCardSkeleton key={i} />)}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredItems.map((item) => (
              <MenuItemCard 
                key={item.id} 
                {...item} 
                isAuthenticated={isAuthenticated}
                onClick={() => {
                  if (!isAuthenticated) {
                    useUIStore.getState().openAuthModal();
                  } else {
                    setSelectedItem(item);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-zinc-900/20 rounded-[3rem] border border-white/5">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 text-zinc-700">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-3 tracking-tight">No flavors matched your search</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">Try adjusting your filters or exploring another delicious category.</p>
          </div>
        )}
      </section>

      {/* Details Sidebar */}
      <MenuDetailsSidebar 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)}
        onAddToCart={(item) => {
          addItem(item);
          toast(`${item.name} added to your feast!`, 'success');
          setSelectedItem(null);
        }}
        isAuthenticated={isAuthenticated}
      />
      <AIChat />
    </div>
  );
}
