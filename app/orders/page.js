'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  ChevronRight, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { getUserOrders } from '@/lib/api';

function OrdersContent() {
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get('phone') || '';

  const [phone, setPhone] = useState(initialPhone);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialPhone) {
      handleSearch(initialPhone);
    }
  }, [initialPhone]);

  const handleSearch = async (queryPhone) => {
    const p = (queryPhone || phone).trim();
    if (!p) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await getUserOrders(p);
      setOrders(data || []);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('deliver')) return 4;
    if (s.includes('ship') || s.includes('dispatch')) return 3;
    if (s.includes('process') || s.includes('paid')) return 2;
    return 1; // Placed / Pending
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Package className="w-3.5 h-3.5 text-amber-700" /> Kashmir Valley Dispatch
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#022C22]">
          Track Your Royal Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Enter the mobile phone number used during checkout to view live artisan packaging and shipment progress.
        </p>
      </div>

      {/* Phone Search Bar */}
      <div className="max-w-xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2 p-1.5 bg-white rounded-2xl border border-[#EADBCC] shadow-md"
        >
          <div className="relative flex-1">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="tel"
              required
              placeholder="Enter your 10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#022C22] text-amber-200 text-xs font-bold uppercase tracking-wider hover:bg-[#064E3B] transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-6 pt-4">
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#EADBCC] space-y-3">
              <Clock className="w-10 h-10 text-amber-600 mx-auto stroke-1" />
              <h3 className="font-serif-luxury text-lg font-bold text-slate-900">
                No orders found for this number
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please double check the phone number or message our WhatsApp concierge for instant support.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Support
              </a>
            </div>
          ) : (
            orders.map((order, idx) => {
              const currentStep = getStatusStep(order.payment_status || order.status);
              return (
                <div
                  key={order.id || idx}
                  className="p-6 sm:p-8 bg-white rounded-3xl border border-[#EADBCC] shadow-md space-y-6"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Order Reference</span>
                      <h3 className="font-serif-luxury text-lg font-bold text-slate-900">
                        #{order.id || `ALH-${1000 + idx}`}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                        {order.payment_status || 'Paid / Confirmed'}
                      </span>
                      <span className="font-bold text-[#064E3B] text-base">
                        ₹{Number(order.total_amount || 899).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Visual Tracker Timeline */}
                  <div className="py-4">
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-medium text-slate-600 relative">
                      {/* Connecting line */}
                      <div className="absolute top-4 inset-x-8 h-0.5 bg-stone-200 -z-0">
                        <div
                          className="h-full bg-[#064E3B] transition-all"
                          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                        />
                      </div>

                      {[
                        { step: 1, label: 'Order Placed' },
                        { step: 2, label: 'Artisan Prep' },
                        { step: 3, label: 'Dispatched (Srinagar)' },
                        { step: 4, label: 'Delivered' },
                      ].map((st) => {
                        const isDone = currentStep >= st.step;
                        return (
                          <div key={st.step} className="flex flex-col items-center space-y-2 z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                                isDone
                                  ? 'bg-[#064E3B] text-amber-200 shadow-md'
                                  : 'bg-stone-100 text-slate-400 border border-slate-200'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : st.step}
                            </div>
                            <span className={isDone ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="p-4 bg-[#FAF6EE] rounded-2xl text-xs space-y-1 border border-[#EADBCC]">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>Delivery Address:</span>
                    </div>
                    <p className="text-slate-600 pl-5">{order.address || 'Address provided during order placement'}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading Tracking Engine...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
