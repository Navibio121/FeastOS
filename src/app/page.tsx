import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/globals/Navbar';
import { HeroSlider } from '@/components/home/HeroSlider';
import { MoodEngine } from '@/components/menu/MoodEngine';
import { DishBackstory } from '@/components/home/DishBackstory';
import { AtmospherePreviewer } from '@/components/home/AtmospherePreviewer';
import { ChefHat, ShoppingBag, Calendar, Trophy, ArrowUpRight, Star } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-zinc-800/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-yellow-500/5 rounded-full blur-[150px] animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10">
        <HeroSlider />

        {/* Mood Engine - NEW SECTION */}
        <MoodEngine />

        {/* Featured Philosophy Section */}
        <section id="menu" className="py-32 px-4 bg-black relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
              <div className="max-w-2xl">
                <span className="text-yellow-500 font-bold tracking-[0.4em] uppercase text-xs mb-6 block animate-pulse">Our Philosophy</span>
                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none mb-8">
                  CRAFTED WITH <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">PURE PASSION</span>
                </h2>
                <p className="text-zinc-500 text-lg md:text-xl leading-relaxed">
                  From the bustling streets of Lagos to the Michelin-starred kitchens of Europe, 
                  we bring together authentic heritage and modern luxury.
                </p>
              </div>
              <Link 
                href="/menu" 
                className="group flex items-center gap-3 text-white font-bold text-lg hover:text-yellow-500 transition-all border-b-2 border-white/10 pb-2 hover:border-yellow-500"
              >
                Discover the Menu 
                <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { 
                  title: 'NATIVE SOUL', 
                  desc: 'Authentic Nigerian flavors crafted with indigenous spices and modern techniques.', 
                  img: '/slider/slide_1_jollof_1777427720491.png',
                  tag: 'Nigerian'
                },
                { 
                  title: 'GLOBAL FLAIR', 
                  desc: 'A collection of world-class dishes featuring premium Wagyu and fresh seafood.', 
                  img: '/slider/slide_4_lobster_1777427881007.png',
                  tag: 'International'
                },
                { 
                  title: 'SWEET FINALE', 
                  desc: 'Exquisite desserts designed to be the perfect conclusion to your feast.', 
                  img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
                  tag: 'Pastry'
                }
              ].map((cat, i) => (
                <div key={i} className="group relative h-[550px] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                  <Image 
                    src={cat.img} 
                    alt={cat.title} 
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  
                  <div className="absolute inset-0 p-10 flex flex-col justify-end transform transition-transform duration-500 group-hover:-translate-y-4">
                    <span className="px-4 py-1.5 bg-yellow-500 text-black text-[10px] font-black uppercase rounded-full mb-6 w-fit shadow-lg">
                      {cat.tag}
                    </span>
                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{cat.title}</h3>
                    <p className="text-zinc-400 text-sm mb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 max-w-[250px]">
                      {cat.desc}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Link 
                        href="/menu" 
                        className="text-white font-bold text-sm underline-offset-8 hover:underline"
                      >
                        Explore Items
                      </Link>
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dish Backstory - NEW SECTION */}
        <DishBackstory />

        {/* Atmosphere Previewer - NEW SECTION */}
        <AtmospherePreviewer />

        {/* Experience Stats */}
        <section className="py-32 px-4 border-y border-white/5 bg-zinc-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 md:gap-8">
              {[
                { label: 'Master Chefs', val: '12+', icon: ChefHat },
                { label: 'Orders Served', val: '50k+', icon: ShoppingBag },
                { label: 'Daily Tables', val: '120+', icon: Calendar },
                { label: 'Loyal Members', val: '5k+', icon: Trophy }
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                  <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500 rotate-3 group-hover:rotate-12 shadow-xl border border-white/5 group-hover:border-yellow-500">
                    <stat.icon className="w-10 h-10" />
                  </div>
                  <div className="text-5xl font-black text-white mb-2 tracking-tighter group-hover:text-yellow-500 transition-colors">
                    {stat.val}
                  </div>
                  <div className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Footer */}
        <footer className="bg-black pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
              <div className="lg:col-span-1">
                <Link href="/" className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-white tracking-tighter leading-none">FEAST<span className="text-yellow-500">OS</span></span>
                    <span className="text-[8px] font-bold text-zinc-500 tracking-[0.3em] uppercase leading-none mt-1">Elite Dining</span>
                  </div>
                </Link>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Redefining luxury dining by blending authentic heritage with modern culinary excellence.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Explore</h4>
                <ul className="space-y-4 text-sm text-zinc-400">
                  <li><Link href="/menu" className="hover:text-yellow-500 transition-colors">Curated Menu</Link></li>
                  <li><Link href="/reservations" className="hover:text-yellow-500 transition-colors">Book a Table</Link></li>
                  <li><Link href="/philosophy" className="hover:text-yellow-500 transition-colors">Our Story</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
                <ul className="space-y-4 text-sm text-zinc-400">
                  <li>123 Culinary Avenue, Lagos</li>
                  <li>reservations@feastos.com</li>
                  <li>+234 800 FEAST OS</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
                <p className="text-zinc-400 text-sm mb-4">Subscribe for exclusive tasting menus and private events.</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-full focus:outline-none focus:border-yellow-500/50"
                  />
                  <button className="bg-yellow-500 text-black px-4 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs">
              <p className="text-zinc-600 font-medium uppercase tracking-widest mb-4 md:mb-0">
                © 2026 FeastOS Elite Dining. All rights reserved.
              </p>
              <div className="flex gap-6 text-zinc-500 font-bold uppercase tracking-widest">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
