"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, History, MapPin, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


const STORIES = [
  {
    title: "The Legend of Jollof",
    origin: "Ancient Senegal/Nigeria",
    body: "More than just a dish, Jollof is a cultural identity. Born in the Jolof Empire, it has traveled across West Africa, sparking friendly 'wars' and uniting millions over its smoky, spicy red grains.",
    image: "/slider/slide_1_jollof_1777427720491.png",
  },
  {
    title: "The Wagyu Standard",
    origin: "Hyogo, Japan",
    body: "Wagyu, meaning 'Japanese Cow', represents the pinnacle of beef breeding. Each steak is a result of meticulous care, specialized diets, and a tradition of excellence that dates back centuries.",
    image: "/slider/slide_2_wagyu_1777427734214.png",
  },
  {
    title: "The Efik Legacy",
    origin: "Cross River, Nigeria",
    body: "Edikaikong was traditionally a soup for royalty and the wealthy, reflecting the abundance of the land and sea. Its preparation is a slow, sacred dance of chopping, seasoning, and waiting.",
    image: "/slider/slide_6_edikaikong_1777428079255.png",
  }
];

export const DishBackstory = () => {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-6">
              <History className="w-4 h-4" /> Culinary Heritage
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">THE DISH <br /> <span className="text-zinc-600 italic">BACKSTORY</span></h2>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 max-w-sm">
            <Quote className="w-8 h-8 text-yellow-500/50 mb-4" />
            <p className="text-zinc-500 text-sm italic">&quot;Food is our common ground, a universal experience that tells the story of who we are.&quot;</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STORIES.map((story, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group"
            >
              <div className="relative h-64 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl">
                <Image src={story.image} alt={story.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] font-bold">
                  <MapPin className="w-3 h-3 text-yellow-500" /> {story.origin}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-500 transition-colors uppercase">{story.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                {story.body}
              </p>
              <Link href="/philosophy" className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest border-b border-yellow-500 pb-1 hover:gap-4 transition-all w-fit">
                Read Full Legend <BookOpen className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
