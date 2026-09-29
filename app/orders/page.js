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
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Check
} from 'lucide-react';
import { getUserOrders } from '@/lib/api';

function normalizePhone(val) {
  if (!val) return '';
  return String(val).replace(/[^0-9]/g, '').slice(-10);
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('phone') || searchParams.get('id') || searchParams.get('order_id') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-fill from recent order if present in localStorage and no query in URL
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    } else if (typeof window !== 'undefined') {
      const lastPhone = localStorage.getItem('alhayy_last_order_phone');
      const lastOrderId = localStorage.getItem('alhayy_last_order_id');
      if (lastOrderId) {
        setSearchQuery(lastOrderId);
        handleSearch(lastOrderId);
      } else if (lastPhone) {
        setSearchQuery(lastPhone);
        handleSearch(lastPhone);
      }
    }
  }, [initialQuery]);

  const handleSearch = async (queryOverride) => {
    const rawQuery = (queryOverride !== undefined ? queryOverride : searchQuery).trim();
    if (!rawQuery) return;

    setLoading(true);
    setSearched(true);

    try {
      const cleanInput = rawQuery.replace(/^#/, '').replace(/^ALH-/i, '').trim();
      const normInputPhone = normalizePhone(rawQuery);

      // Fetch all backend orders
      const remoteOrders = await getUserOrders();
      
      // Also get local storage cache orders for immediate display
      let localOrders = [];
      try {
        const stored = localStorage.getItem('alhayy_customer_orders');
        if (stored) localOrders = JSON.parse(stored);
      } catch (e) {}

      // Combine orders, preferring remote over local by ID
      const allOrdersMap = new Map();
      (remoteOrders || []).forEach(o => allOrdersMap.set(String(o.id), o));
      (localOrders || []).forEach(o => {
        if (!allOrdersMap.has(String(o.id))) {
          allOrdersMap.set(String(o.id), o);
        }
      });

      const allOrders = Array.from(allOrdersMap.values());

      // Filter by Order ID OR by Phone
      const matched = allOrders.filter(ord => {
        const ordId = String(ord.id || '').replace(/^ALH-/i, '');
        const ordPhone = normalizePhone(ord.phone || '');

        const matchesId = ordId === cleanInput || String(ord.id) === rawQuery || `ALH-${ord.id}`.toLowerCase() === rawQuery.toLowerCase();
        const matchesPhone = normInputPhone && ordPhone === normInputPhone;

        return matchesId || matchesPhone;
      });

      setOrders(matched);
    } catch (e) {
      console.error('Order tracking search failed:', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status, paymentStatus) => {
    const s = `${status}`.toLowerCase().trim();
    if (s.includes('deliver')) return 5;
    if (s.includes('on_the_way') || s.includes('transit') || s.includes('way') || s.includes('dispatch') || s.includes('ship')) return 4;
    if (s.includes('pick')) return 3;
    if (s.includes('process') || s.includes('craft') || s.includes('paid')) return 2;
    return 1; // Placed / Pending
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received & confirmed' },
    { title: 'Processing', desc: 'Artisan handcrafting' },
    { title: 'Picked Up', desc: 'Handed to logistics' },
    { title: 'On the Way', desc: 'In express transit' },
    { title: 'Delivered', desc: 'At your doorstep' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Package className="w-3.5 h-3.5 text-amber-800" /> Live Kashmir Valley Dispatch
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#022C22]">
          Track Your Royal Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Enter your <strong className="text-slate-900">Order Reference ID</strong> (e.g. <code>#6</code> or <code>ALH-6</code>) or registered <strong className="text-slate-900">10-Digit Mobile Number</strong> to view live atelier updates and dispatch progress.
        </p>
      </div>

      {/* Unified Search Bar */}
      <div className="max-w-xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2 p-1.5 bg-white rounded-2xl border border-[#EADBCC] shadow-lg shadow-amber-950/5"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="Enter Order ID (#6) or 10-digit Mobile Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-2.5 rounded-xl bg-[#022C22] text-amber-200 text-xs font-bold uppercase tracking-wider hover:bg-[#064E3B] transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-8 pt-2">
          {orders.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-[#EADBCC] space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                  No orders found for &ldquo;{searchQuery}&rdquo;
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Please check if the Order ID or phone number was typed correctly, or connect with our WhatsApp concierge for direct assistance.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <a
                  href={`https://wa.me/919622480276?text=${encodeURIComponent(`Hi, I need assistance tracking my Al Hayy order for: ${searchQuery}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#070E1E] hover:bg-[#102142] text-[#F7E7B6] border border-[#D4AF37]/40 rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> Message WhatsApp Concierge (+91 96224 80276)
                </a>
              </div>
            </div>
          ) : (
            orders.map((order, idx) => {
              const currentStep = getStatusStep(order.order_status, order.payment_status);
              const displayId = order.id ? (String(order.id).startsWith('ALH-') ? order.id : `ALH-${order.id}`) : `ALH-${1000 + idx}`;

              return (
                <div
                  key={order.id || idx}
                  className="p-6 sm:p-8 bg-white rounded-3xl border border-[#EADBCC] shadow-md space-y-8"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">Reference</span>
                        <span className="text-[11px] text-stone-400">• {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}</span>
                      </div>
                      <h3 className="font-serif-luxury text-xl font-bold text-slate-900 font-mono">
                        #{displayId}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] border ${
                        String(order.payment_status).toLowerCase() === 'paid'
                          ? 'bg-[#D4AF37]/15 text-[#AA7E18] border-[#D4AF37]/30'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {order.payment_status || 'Paid / Confirmed'}
                      </span>
                      <span className="font-bold text-[#070E1E] text-lg font-sans">
                        ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* 5-Stage Live Kashmir Valley Progress Tracker */}
                  <div className="py-2">
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2 relative">
                      {/* Connecting line */}
                      <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone-200 -z-0" />
                      <div
                        className="absolute top-4 left-6 h-0.5 bg-[#AA7E18] transition-all duration-500 -z-0"
                        style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                      />

                      {steps.map((st, i) => {
                        const stepNum = i + 1;
                        const isDone = stepNum <= currentStep;
                        const isCurrent = stepNum === currentStep;

                        return (
                          <div key={st.title} className="text-center relative z-10 space-y-2">
                            <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all ${
                              isDone
                                ? 'bg-[#070E1E] text-[#F7E7B6] shadow-sm ring-4 ring-[#D4AF37]/20 border border-[#D4AF37]'
                                : 'bg-stone-100 text-stone-400 border border-stone-300'
                            }`}>
                              {isDone ? <Check className="w-4 h-4 text-[#D4AF37]" /> : stepNum}
                            </div>
                            <div>
                              <span className={`block text-[11px] font-bold ${isCurrent ? 'text-[#070E1E]' : isDone ? 'text-stone-900' : 'text-stone-400'}`}>
                                {st.title}
                              </span>
                              <span className="hidden sm:block text-[10px] text-stone-400 leading-tight">
                                {st.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Line Items List */}
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Ordered Artifacts ({order.items.length})
                      </span>
                      <div className="divide-y divide-stone-100 bg-stone-50/70 rounded-2xl border border-stone-200/80 p-4 space-y-3">
                        {order.items.map((item, itmIdx) => (
                          <div key={item.id || itmIdx} className="flex items-center justify-between pt-3 first:pt-0 gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt=""
                                  className="w-12 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-14 bg-stone-200 rounded-xl flex items-center justify-center text-stone-500 shrink-0">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-semibold text-stone-900 line-clamp-1">{item.title}</h4>
                                <span className="text-[11px] text-stone-500">
                                  Size: <strong className="text-stone-800">{item.size || 'Free Size'}</strong> • Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-stone-950 font-sans text-sm">
                              ₹{Number(item.price || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shipping Info Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-700" /> Delivery Address
                      </span>
                      <p className="text-stone-900 font-medium leading-relaxed">
                        {order.customer_name}<br />
                        {order.address}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-amber-700" /> Patron Contact
                      </span>
                      <p className="text-stone-900 font-medium">
                        {order.phone}<br />
                        <span className="text-[11px] text-stone-500">Dispatch Hub: Srinagar, Kashmir Valley</span>
                      </p>
                    </div>
                  </div>

                  {/* Direct WhatsApp Concierge CTA */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-stone-100">
                    <span className="text-stone-500 text-[11px]">
                      Need urgent dispatch updates or address changes?
                    </span>
                    <a
                      href={`https://wa.me/919622480276?text=${encodeURIComponent(`Salam Al Hayy, I need help with my Order #${displayId}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#070E1E] hover:bg-[#102142] text-[#F7E7B6] border border-[#D4AF37]/40 rounded-xl font-semibold shadow-xs transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" /> WhatsApp Concierge (+91 96224 80276)
                    </a>
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
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-xs text-stone-400">Loading Order Tracking...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
