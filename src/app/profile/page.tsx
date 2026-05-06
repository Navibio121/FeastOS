"use client";

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/globals/Navbar';
import { 
  User, 
  Package, 
  Calendar, 
  Settings, 
  LogOut, 
  ChevronRight, 
  CreditCard,
  Bell,
  ShieldCheck,
  Loader2,
  Star,
  Trophy,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { LoyaltyCard } from '@/components/profile/LoyaltyCard';
import { MenuCardSkeleton, TableRowSkeleton } from '@/components/globals/Skeleton';

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: { name: string; quantity: number }[];
}

interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  zone: string;
  createdAt: string;
}

interface UserProfile {
  points: number;
  name: string;
  email: string;
  role: string;
}

function getLoyaltyTier(points: number) {
  if (points >= 1000) return { name: 'Platinum', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', next: null, needed: 0 };
  if (points >= 500) return { name: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', next: 'Platinum', needed: 1000 - points };
  if (points >= 200) return { name: 'Silver', color: 'text-zinc-300', bg: 'bg-zinc-500/10', border: 'border-zinc-400/20', next: 'Gold', needed: 500 - points };
  return { name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', next: 'Silver', needed: 200 - points };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loadingOrders, setLoadingOrders] = React.useState(true);
  const [loadingReservations, setLoadingReservations] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'orders' | 'reservations' | 'loyalty'>('orders');
  const [claiming, setClaiming] = React.useState<string | null>(null);
  const [claimedCode, setClaimedCode] = React.useState<{id: string, code: string} | null>(null);


  React.useEffect(() => {
    if (status === 'authenticated') {
      // Fetch orders
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => { setOrders(Array.isArray(data) ? data : []); setLoadingOrders(false); })
        .catch(() => setLoadingOrders(false));

      // Fetch reservations
      fetch('/api/reservations')
        .then(res => res.json())
        .then(data => { setReservations(Array.isArray(data) ? data : []); setLoadingReservations(false); })
        .catch(() => setLoadingReservations(false));

      // Fetch profile with points
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(() => {});

      // Setup SSE for real-time order updates
      const eventSource = new EventSource('/api/events');
      eventSource.addEventListener('ORDER_UPDATED', (event) => {
        const updatedOrder = JSON.parse(event.data);
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      });

      return () => eventSource.close();
    }
  }, [status]);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }


  const handleClaimPerk = async (perkId: string) => {
    setClaiming(perkId);
    try {
      const res = await fetch('/api/loyalty/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perkId })
      });
      const data = await res.json();
      if (res.ok) {
        setClaimedCode({ id: perkId, code: data.code });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to claim perk');
    } finally {
      setClaiming(null);
    }
  };

  const tier = getLoyaltyTier(profile?.points || 0);
  const tierProgress = tier.next
    ? Math.round(((profile?.points || 0) / (profile?.points || 0 + tier.needed)) * 100)
    : 100;

  return (
    <div className="bg-black min-h-screen pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Card */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl" />
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center text-black text-3xl font-bold shadow-lg shadow-yellow-500/20">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-2xl font-bold text-white">{session?.user?.name}</h2>
              <div className="flex flex-col gap-1 mb-4">
                <p className="text-zinc-500 text-sm">{session?.user?.email}</p>
                <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">{session?.user?.role}</span>
              </div>
              
              {/* Loyalty Tier Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${tier.bg} ${tier.border}`}>
                <Trophy className={`w-4 h-4 ${tier.color}`} />
                <span className={`text-sm font-bold ${tier.color}`}>{tier.name} Member</span>
              </div>

              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>

            {/* Nav Tabs */}
            <nav className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
              {[
                { id: 'orders' as const, icon: Package, label: 'My Orders', count: orders.length },
                { id: 'reservations' as const, icon: Calendar, label: 'Reservations', count: reservations.length },
                { id: 'loyalty' as const, icon: Star, label: 'Loyalty Points', count: profile?.points },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-5 transition-all border-b border-white/5 last:border-0 ${
                    activeTab === item.id 
                      ? 'bg-yellow-500/5 text-yellow-500' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.count !== undefined && (
                      <span className={`text-xs px-2 py-1 rounded-full ${activeTab === item.id ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800'}`}>
                        {item.count}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                </button>
              ))}
              <button className="w-full flex items-center justify-between p-5 transition-all text-zinc-400 hover:bg-white/5 hover:text-white border-b border-white/5">
                <div className="flex items-center gap-4"><Bell className="w-5 h-5" /><span className="font-medium">Notifications</span></div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>
              <button className="w-full flex items-center justify-between p-5 transition-all text-zinc-400 hover:bg-white/5 hover:text-white">
                <div className="flex items-center gap-4"><Settings className="w-5 h-5" /><span className="font-medium">Account Settings</span></div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Recent Orders</h3>
                  <button onClick={() => router.push('/menu')} className="text-yellow-500 text-sm font-bold hover:underline">Order Again</button>
                </div>
                
                {loadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex gap-4">
                          <MenuCardSkeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
                          <div className="space-y-2">
                            <MenuCardSkeleton className="w-32 h-4" />
                            <MenuCardSkeleton className="w-24 h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-12 text-center">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4"><Package className="w-8 h-8 text-zinc-600" /></div>
                    <h4 className="text-white font-bold mb-2">No orders yet</h4>
                    <p className="text-zinc-500 text-sm mb-6">Ready for some delicious food?</p>
                    <button onClick={() => router.push('/menu')} className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all">Browse Menu</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-white/10 transition-all">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-yellow-500 flex-shrink-0">
                            <Package className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-white font-bold">Order #{order.id.slice(-6).toUpperCase()}</p>
                            <p className="text-zinc-500 text-xs mb-2">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-zinc-400 text-xs mb-2">{order.items?.map(i => `${i.quantity}× ${i.name}`).join(', ')}</p>
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                              order.status === 'PENDING' ? 'bg-red-500/10 text-red-500' :
                              order.status === 'READY' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {order.status === 'PREPARING' ? '🍳 Preparing' : order.status === 'READY' ? '✅ Ready' : order.status === 'PENDING' ? '⏳ Pending' : '✓ Completed'}
                            </span>
                            <button 
                              onClick={() => router.push(`/orders/${order.id}`)}
                              className="mt-3 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-md border border-white/10 transition-all flex items-center gap-1 w-fit"
                            >
                              Track Order <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col justify-between items-end">
                          <p className="text-xl font-bold text-white">${order.total.toFixed(2)}</p>
                          <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                            <Star className="w-3 h-3 fill-yellow-500" />
                            +{Math.floor(order.total)} pts
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Upcoming Reservations</h3>
                  <button onClick={() => router.push('/reservations')} className="flex items-center gap-1 text-yellow-500 text-sm font-bold hover:underline">
                    Book a Table <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
                
                {loadingReservations ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                        <MenuCardSkeleton className="w-full h-12" />
                      </div>
                    ))}
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-12 text-center">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-8 h-8 text-zinc-600" /></div>
                    <h4 className="text-white font-bold mb-2">No reservations yet</h4>
                    <p className="text-zinc-500 text-sm mb-6">You don&apos;t have any upcoming reservations.</p>
                    <button onClick={() => router.push('/reservations')} className="px-8 py-3 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all">Make a Reservation</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((r) => (
                      <div key={r.id} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-bold text-lg mb-1">{r.date} at {r.time}</p>
                            <p className="text-zinc-500 text-sm">{r.guests} guest{r.guests > 1 ? 's' : ''} • <span className="capitalize">{r.zone}</span> Dining</p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20">Confirmed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'loyalty' && (
              <section>
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Loyalty Program</h3>
                    <p className="text-zinc-500 text-sm">Exclusive rewards for our most valued guests.</p>
                  </div>
                </div>

                <div className="mb-12">
                  <LoyaltyCard points={profile?.points || 0} />
                </div>

                {/* Tier Benefits */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { tier: 'Bronze', pts: '0+', color: 'text-orange-400', icon: '🥉', perk: '10% Welcome Discount', id: 'p1' },
                    { tier: 'Silver', pts: '200+', color: 'text-zinc-300', icon: '🥈', perk: 'Free Delivery', id: 'p2' },
                    { tier: 'Gold', pts: '500+', color: 'text-yellow-400', icon: '🥇', perk: 'Priority Booking', id: 'p3' },
                    { tier: 'Platinum', pts: '1000+', color: 'text-cyan-400', icon: '💎', perk: 'Private Chef Event', id: 'p4' },
                  ].map(t => {
                    const isUnlocked = (profile?.points || 0) >= parseInt(t.pts);
                    return (
                      <div key={t.tier} className={`bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-center transition-all ${
                        tier.name === t.tier ? 'ring-1 ring-yellow-500/30 bg-yellow-500/5' : ''
                      } ${!isUnlocked ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                        <div className="text-2xl mb-2">{t.icon}</div>
                        <p className={`font-bold text-sm ${t.color}`}>{t.tier}</p>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{t.pts} pts</p>
                        <p className="text-white text-xs mt-2 font-medium">{t.perk}</p>
                        
                        {isUnlocked && (
                          <div className="mt-4">
                            {claimedCode?.id === t.id ? (
                              <div className="bg-yellow-500 p-2 rounded-lg text-black font-mono text-[10px] font-bold select-all">
                                {claimedCode.code}
                              </div>
                            ) : (
                              <button 
                                disabled={claiming !== null}
                                className="w-full py-2 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-50"
                                onClick={() => handleClaimPerk(t.id)}
                                >
                                {claiming === t.id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Claim Now'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* How to earn */}
                <div className="mt-6 bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> How to Earn Points</h4>
                  <div className="space-y-3">
                    {[
                      { action: 'Place an order', pts: '1 pt per $1 spent' },
                      { action: 'Make a reservation', pts: '+10 pts per visit' },
                      { action: 'Refer a friend', pts: '+50 pts per referral' },
                      { action: 'Birthday bonus', pts: '+100 pts on birthday' },
                    ].map(item => (
                      <div key={item.action} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-zinc-400 text-sm">{item.action}</span>
                        <span className="text-yellow-500 text-sm font-bold">{item.pts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
