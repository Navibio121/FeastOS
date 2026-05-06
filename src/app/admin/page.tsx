"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useRouter } from 'next/navigation';
import { TableRowSkeleton } from '@/components/globals/Skeleton';

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [topDishes, setTopDishes] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [wasteData, setWasteData] = useState<any>({ byReason: [], byItem: [] });
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch locations for the filter
    fetch('/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = selectedLocation !== 'all' ? `?locationId=${selectedLocation}` : '';
        const [ordersRes, analyticsRes, revenueRes, peakRes, wasteRes] = await Promise.all([
          fetch(`/api/orders/all${query}`),
          fetch(`/api/admin/analytics/top-dishes${query}`),
          fetch(`/api/admin/analytics/revenue${query}`),
          fetch(`/api/admin/analytics/peak-hours${query}`),
          fetch(`/api/admin/analytics/waste`)
        ]);
        const ordersData = await ordersRes.json();
        const analyticsData = await analyticsRes.json();
        const revenueData = await revenueRes.json();
        const peakData = await peakRes.json();
        const wasteAnalytics = await wasteRes.json();
        setOrders(ordersData);
        setTopDishes(analyticsData);
        setRevenueData(revenueData);
        setPeakHours(peakData);
        setWasteData(wasteAnalytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedLocation]);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">OVERVIEW</h1>
          <p className="text-zinc-500 font-medium">Global performance and real-time insights</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Location Selector */}
          <select 
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2.5 bg-zinc-900 border border-white/10 text-white text-sm font-bold rounded-xl outline-none focus:border-yellow-500/50 appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJ3aGl0ZSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xOSA5bC03IDctNy03Ii8+PC9zdmc+')] bg-[length:20px] bg-[right_10px_center] bg-no-repeat"
          >
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>

          <button 
            onClick={() => {
              const q = selectedLocation !== 'all' ? `&locationId=${selectedLocation}` : '';
              window.open(`/api/admin/export?type=orders${q}`, '_blank');
            }}
            className="px-5 py-2.5 bg-zinc-900 border border-white/5 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: BarChart3, color: 'text-green-500', trend: '+12.5%' },
          { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-yellow-500', trend: '+8.2%' },
          { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'text-blue-500', trend: '-2.1%' },
          { label: 'Active Customers', value: '1,284', icon: Users, color: 'text-purple-500', trend: '+15.3%' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-black rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h4>
            <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Top Dishes */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">Top Selling Dishes</h3>
          <div className="space-y-6">
            {topDishes.length === 0 ? (
              <p className="text-zinc-500 text-sm">No data available yet.</p>
            ) : (
              topDishes.map((dish, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-medium">{dish.name}</span>
                    <span className="text-zinc-500 font-bold">{dish.count} orders</span>
                  </div>
                  <div className="h-2 bg-black rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${(dish.count / topDishes[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Revenue Over Time */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Revenue Overview</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              7-DAY TREND
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#EAB308' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#EAB308" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peak Hours Section */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Peak Hours Heatmap</h3>
            <p className="text-zinc-500 text-xs font-medium">Identify the busiest times of the day for staff allocation.</p>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 9, fontWeight: 700 }}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#09090b', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {peakHours.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.count > 10 ? '#EAB308' : entry.count > 5 ? '#EAB308aa' : '#EAB30844'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Waste Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-2">Inventory Waste by Reason</h3>
          <p className="text-zinc-500 text-xs mb-8">Understanding the causes of stock depletion.</p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteData.byReason} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-2">Top Wasted Items</h3>
          <p className="text-zinc-500 text-xs mb-8">Items with the highest volume of reported waste.</p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteData.byItem}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 9, fontWeight: 700 }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="quantity" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search orders..."
                className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:border-yellow-500/50 outline-none"
              />
            </div>
            <button className="p-2.5 bg-black/50 border border-white/10 rounded-xl text-zinc-400 hover:text-white">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20">
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Branch</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Customer</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Date</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Status</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest text-right">Total</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5].map(i => <TableRowSkeleton key={i} />)}
                </>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-zinc-500">
                    No orders found in the database.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-6 py-4">
                      <span className="text-white font-mono text-xs">#{order.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-bold text-[10px] uppercase tracking-tighter">{order.location?.name || 'Central'}</div>
                      <div className="text-zinc-600 text-[10px]">{order.location?.city || 'Lagos'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium text-sm">{order.address?.split(',')[0] || 'Unknown'}</div>
                      <div className="text-zinc-500 text-xs">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-zinc-500 text-xs">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                        order.status === 'PENDING' ? 'bg-red-500/10 text-red-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-white font-bold">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-black/10 border-t border-white/5 flex justify-between items-center">
          <span className="text-zinc-500 text-xs">Showing 1 to {orders.length} of {orders.length} orders</span>
          <div className="flex gap-2">
            <button disabled className="px-4 py-2 bg-zinc-900 border border-white/5 text-zinc-500 text-xs font-bold rounded-lg opacity-50 cursor-not-allowed">Previous</button>
            <button disabled className="px-4 py-2 bg-zinc-900 border border-white/5 text-zinc-500 text-xs font-bold rounded-lg opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

