"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/globals/Navbar';
import { 
  Users, 
  Shield, 
  UserCircle, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  ChefHat, 
  Loader2,
  Mail,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/providers/ToastProvider';
import { TableRowSkeleton } from '@/components/globals/Skeleton';

export default function StaffManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/staff');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        toast(`Role updated to ${newRole}`, 'success');
        fetchUsers();
      }
    } catch (err) {
      toast('Failed to update role', 'error');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              STAFF <span className="text-zinc-600">& ROLES</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Access Control & Team Permissions</p>
          </div>
          
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-500/50 transition-all text-sm"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Team Member</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Address</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Current Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5].map(i => <TableRowSkeleton key={i} />)}
                </>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 relative overflow-hidden">
                        {user.image ? (
                          <Image src={user.image} alt={user.name || ''} fill className="object-cover" />
                        ) : (
                          <UserCircle className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold">{user.name || 'Unnamed User'}</p>
                        <p className="text-[10px] font-black text-yellow-500/50 uppercase tracking-widest">{user.points} Loyalty Pts</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Mail className="w-4 h-4 opacity-50" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      user.role === 'ADMIN' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                      user.role === 'STAFF' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                      'bg-zinc-800 border-white/5 text-zinc-500'
                    }`}>
                      {user.role === 'ADMIN' && <ShieldCheck className="w-3 h-3" />}
                      {user.role === 'STAFF' && <ChefHat className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <select 
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="bg-zinc-800 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl px-3 py-2 outline-none focus:border-yellow-500/50"
                      >
                        <option value="USER">User</option>
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
