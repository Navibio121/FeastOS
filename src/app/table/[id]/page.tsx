"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Loader2, Sparkles } from 'lucide-react';

export default function TableRedirectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const setTableId = useCartStore((state) => state.setTableId);

  useEffect(() => {
    if (params.id) {
      setTableId(params.id);
      // Wait a moment for premium feel
      setTimeout(() => {
        router.push('/menu');
      }, 1500);
    }
  }, [params.id, setTableId, router]);

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative w-20 h-20 bg-zinc-900 border border-white/5 rounded-3xl flex items-center justify-center text-yellow-500 shadow-2xl">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">
          WELCOMING YOU <span className="text-zinc-600">TO TABLE {params.id}</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Syncing digital menu...</p>
      </div>
      <Loader2 className="w-6 h-6 text-yellow-500 animate-spin mt-4" />
    </div>
  );
}
