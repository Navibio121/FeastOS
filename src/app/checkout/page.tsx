"use client";

import React, { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useLocationStore } from '@/store/locationStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
import { Navbar } from '@/components/globals/Navbar';
import { 
  CreditCard, 
  Truck, 
  ShoppingBag, 
  CheckCircle2, 
  ChevronRight, 
  MapPin, 
  Phone,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { selectedLocation } = useLocationStore();
  const { data: session } = useSession();
  const router = useRouter();

  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    phone: '',
    note: ''
  });


  const total = getTotal();
  const discountAmount = coupon ? (total * (coupon.discount / 100)) : 0;
  const deliveryFee = 2.99;
  const finalTotal = (total - discountAmount) + deliveryFee;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch(`/api/coupons/validate?code=${couponCode}`);
      const data = await res.json();
      if (res.ok) {
        setCoupon(data);
        setCouponCode('');
      } else {
        setCouponError(data.message || 'Invalid coupon');
      }
    } catch (err) {
      setCouponError('Error validating coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          locationId: selectedLocation?.id,
          address: `${formData.address}, ${formData.city}`,
          phone: formData.phone,
        }),
      });

      const { id } = await res.json();
      
      const result = await (stripe as any).redirectToCheckout({
        sessionId: id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-black min-h-screen pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-32">
        {items.length === 0 && step !== 3 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <ShoppingBag className="w-16 h-16 text-zinc-800 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-zinc-500 mb-8">Add some items before checking out!</p>
            <button 
              onClick={() => router.push('/menu')}
              className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-2xl"
            >
              Go to Menu
            </button>
          </div>
        ) : (
          <>
            {/* Progress Stepper */}
            {step < 3 && (
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                  step === 1 ? "bg-yellow-500 border-yellow-500 text-black font-bold" : "bg-zinc-900 border-white/5 text-zinc-500"
                )}>
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">1</span>
                  Details
                </div>
                <div className="w-12 h-px bg-zinc-800" />
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                  step === 2 ? "bg-yellow-500 border-yellow-500 text-black font-bold" : "bg-zinc-900 border-white/5 text-zinc-500"
                )}>
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">2</span>
                  Payment
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Form Area */}
          <div className={cn(
            "lg:col-span-8",
            step === 3 && "lg:col-span-12"
          )}>
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full text-zinc-400">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-3xl font-bold text-white">Delivery Details</h2>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Street Address
                      </label>
                      <input 
                        type="text" 
                        placeholder="123 Feast Street"
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-zinc-400 text-sm font-medium">City / Area</label>
                      <input 
                        type="text" 
                        placeholder="Lagos Island"
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Phone Number
                      </label>
                      <input 
                        type="tel" 
                        placeholder="+234 800 000 0000"
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-zinc-400 text-sm font-medium">Delivery Note (Optional)</label>
                      <textarea 
                        rows={3}
                        placeholder="Leave at the front gate, code is 1234..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500/50 outline-none resize-none"
                        value={formData.note}
                        onChange={e => setFormData({...formData, note: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <button 
                    disabled={!formData.address || !formData.phone}
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-yellow-500 disabled:opacity-50 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep(1)} className="p-2 hover:bg-white/5 rounded-full text-zinc-400">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-3xl font-bold text-white">Review Order</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Review Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                      <div className="flex items-center gap-3 mb-4 text-yellow-500">
                        <MapPin className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Delivery Address</span>
                      </div>
                      <p className="text-white font-medium">{formData.address}</p>
                      <p className="text-zinc-500 text-sm">{formData.city}</p>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                      <div className="flex items-center gap-3 mb-4 text-yellow-500">
                        <Phone className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Contact Info</span>
                      </div>
                      <p className="text-white font-medium">{formData.phone}</p>
                      <p className="text-zinc-500 text-sm">We&apos;ll call this for updates</p>
                    </div>

                    <div className="md:col-span-2 bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                      <div className="flex items-center gap-3 mb-4 text-yellow-500">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Branch Selection</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{selectedLocation?.name || 'Central Kitchen'}</p>
                          <p className="text-zinc-500 text-sm">{selectedLocation?.city || 'Default Branch'}</p>
                        </div>
                        <button 
                          onClick={() => router.push('/menu')} 
                          className="text-xs font-bold text-zinc-400 hover:text-white underline"
                        >
                          Change Branch
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 text-center space-y-6">
                    <div className="flex justify-center mb-2">
                      <div className="p-4 bg-yellow-500/10 rounded-full text-yellow-500">
                        <CreditCard className="w-10 h-10" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Secure Stripe Checkout</h4>
                      <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                        You will be redirected to Stripe&apos;s secure payment portal to complete your transaction with encryption and 3D Secure.
                      </p>
                    </div>

                    <button 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full max-w-md mx-auto py-4 bg-yellow-500 disabled:opacity-50 text-black font-extrabold rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-yellow-500/20"
                    >
                      {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          Pay ${finalTotal.toFixed(2)} via Stripe
                        </>
                      )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                      <span>🔒 PCI Compliant</span>
                      <span>🛡️ Secure SSL</span>
                      <span>💳 All Cards Accepted</span>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {step === 3 && (
              <div className="text-center py-24 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(234,179,8,0.4)]">
                  <CheckCircle2 className="w-12 h-12 text-black" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">ORDER PLACED SUCCESSFULLY!</h2>
                <p className="text-zinc-400 max-w-md mx-auto mb-12">
                  Thank you for your order! Your delicious meal is being prepared and will be with you shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => router.push('/profile')}
                    className="px-8 py-4 bg-zinc-900 border border-white/10 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all"
                  >
                    Track Order
                  </button>
                  <button 
                    onClick={() => router.push('/')}
                    className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step < 3 && (
            <div className="lg:col-span-4">
              <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 sticky top-32">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-yellow-500" />
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-zinc-500 text-xs">{item.quantity} x ${item.price.toFixed(2)}</p>
                      </div>
                      <span className="text-white text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-white/5">
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-green-500 text-sm">
                      <span className="flex items-center gap-1">Discount ({coupon.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-yellow-500">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Input */}
                {!coupon ? (
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">Promo Code</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="ENTER CODE"
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-yellow-500/50 outline-none uppercase font-mono"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                      >
                        {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'APPLY'}
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-[10px] mt-2 font-bold">{couponError}</p>}
                  </div>
                ) : (
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center bg-green-500/5 p-3 rounded-xl border border-green-500/10">
                    <div>
                      <p className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Coupon Applied</p>
                      <p className="text-white text-xs font-mono">{coupon.code}</p>
                    </div>
                    <button onClick={() => setCoupon(null)} className="text-zinc-500 hover:text-white text-xs font-bold underline">Remove</button>
                  </div>
                )}

                <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex gap-3">
                  <Truck className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-xs text-zinc-400">
                    Est. delivery time: <span className="text-white font-bold">25-35 mins</span>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </>
    )}
  </main>
</div>
  );
}
