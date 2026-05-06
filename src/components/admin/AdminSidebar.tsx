"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  ChefHat,
  ChevronRight,
  Calendar,
  Ticket,
  MapPin,
  Package
} from 'lucide-react';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { signOut } from 'next-auth/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { name: 'Menu Management', icon: UtensilsCrossed, href: '/admin/menu' },
    { name: 'Inventory', icon: Package, href: '/admin/inventory' },
    { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Bookings', icon: Calendar, href: '/admin/reservations' },
    { name: 'Customers', icon: Users, href: '/admin/customers' },
    { name: 'Promotions', icon: Ticket, href: '/admin/coupons' },
    { name: 'Locations', icon: MapPin, href: '/admin/locations' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];


  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-zinc-950 border-r border-white/5 flex flex-col z-50">
      {/* Brand */}
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            <ChefHat className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter">FEAST<span className="text-yellow-500 italic">OS</span></h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Management Hub</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group",
                isActive 
                  ? "bg-yellow-500 text-black font-extrabold shadow-lg shadow-yellow-500/10" 
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-black" : "text-zinc-500 group-hover:text-yellow-500")} />
                <span className="text-sm">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-6 border-t border-white/5">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 w-full px-4 py-3 text-zinc-500 hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-sm font-bold">Logout Session</span>
        </button>
      </div>
    </aside>
  );
}

