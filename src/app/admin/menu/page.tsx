"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  Image as ImageIcon,
  Flame,
  Leaf,
  Eye,
  EyeOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVegan: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  stock: number;
  ingredients?: string;
  originStory?: string;
}

export default function AdminMenuPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Mains',
    image: '',
    isVegan: false,
    isSpicy: false,
    isAvailable: true,
    stock: '99',
    ingredients: '',
    originStory: '',
  });


  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch menu items", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item: MenuItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        image: item.image,
        isVegan: item.isVegan,
        isSpicy: item.isSpicy,
        isAvailable: item.isAvailable,
        stock: item.stock.toString(),
        ingredients: item.ingredients || '',
        originStory: item.originStory || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Starters',
        image: '',
        isVegan: false,
        isSpicy: false,
        isAvailable: true,
        stock: '99',
        ingredients: '',
        originStory: '',
      });
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingItem ? 'PATCH' : 'POST';
      const body = editingItem ? { id: editingItem.id, ...formData } : formData;

      const res = await fetch('/api/menu/admin', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchItems();
        setIsModalOpen(false);
      } else {
        alert('Failed to save menu item');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/menu/admin?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">MENU MANAGEMENT</h1>
          <p className="text-zinc-500 font-medium">Add, edit, or remove dishes from your live menu.</p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-500 text-black font-bold rounded-2xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus className="w-5 h-5" />
          Add New Dish
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
          />
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Total Dishes</p>
          <p className="text-2xl font-bold text-white">{items.length}</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Active Categories</p>
          <p className="text-2xl font-bold text-white">{new Set(items.map(i => i.category)).size}</p>
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Dish</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Category</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Price</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Stock</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Status</th>
                <th className="px-6 py-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/10 flex-shrink-0 shadow-xl relative">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{item.name}</p>
                        <div className="flex gap-2 mt-1">
                          {item.isVegan && <Leaf className="w-3 h-3 text-green-500" />}
                          {item.isSpicy && <Flame className="w-3 h-3 text-red-500" />}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-full border border-white/5">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-yellow-500 font-bold">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}>
                      {item.stock} left
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.isAvailable ? (
                      <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                        <Check className="w-3 h-3" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        <X className="w-3 h-3" /> Sold Out
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-lg transition-all text-zinc-400"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg transition-all text-zinc-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-2xl font-bold text-white">
                {editingItem ? 'Edit Dish' : 'Add New Dish'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Dish Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Lobster Carbonara"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Price ($)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="19.99"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                    <input 
                      required
                      type="text" 
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      placeholder="https://unsplash.com/..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-yellow-500/50 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Current Stock</label>
                <input 
                  required
                  type="number" 
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  placeholder="99"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Ingredients (Comma separated)</label>
                <input 
                  type="text" 
                  value={formData.ingredients}
                  onChange={e => setFormData({...formData, ingredients: e.target.value})}
                  placeholder="Lobster, Cream, Pasta, Garlic..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Dish Backstory (The Story)</label>
                <textarea 
                  rows={2}
                  value={formData.originStory}
                  onChange={e => setFormData({...formData, originStory: e.target.value})}
                  placeholder="Inspired by the coastal flavors of..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none resize-none"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the dish ingredients and flavors..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none resize-none"
                />
              </div>


              <div className="flex flex-wrap gap-6 py-4 border-y border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isVegan}
                    onChange={e => setFormData({...formData, isVegan: e.target.checked})}
                    className="hidden"
                  />
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isVegan ? 'bg-green-500' : 'bg-zinc-800'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isVegan ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                    <Leaf className="w-4 h-4" /> Vegan
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isSpicy}
                    onChange={e => setFormData({...formData, isSpicy: e.target.checked})}
                    className="hidden"
                  />
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isSpicy ? 'bg-red-500' : 'bg-zinc-800'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isSpicy ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                    <Flame className="w-4 h-4" /> Spicy
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isAvailable}
                    onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
                    className="hidden"
                  />
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isAvailable ? 'bg-yellow-500' : 'bg-zinc-800'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isAvailable ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                    {formData.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {formData.isAvailable ? 'Available' : 'Sold Out'}
                  </span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-yellow-500 disabled:opacity-50 text-black font-extrabold rounded-2xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingItem ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
