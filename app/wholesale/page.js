import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CITIES_DATA } from '@/lib/citiesData';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  ArrowRight,
  Package,
  Layers
} from 'lucide-react';

export const metadata = {
  title: 'B2B Apparel Manufacturer & Wholesale Network India | Al Hayy International',
  description: 'Direct manufacturer and pan-India wholesale supplier of pure cotton embroidered kurtis, designer women co-ord sets, and luxury handcrafted kaftans. Low MOQ and express dispatch across 60+ cities.',
  keywords: [
    'Cotton Kurti Manufacturer India',
    'Women Co-ord Set Manufacturer India',
    'Cotton Kaftans Wholesale Supplier',
    'Kashmiri Embroidered Kurti Manufacturer',
    'B2B Apparel Supplier India',
    'Pure Cotton Kurti Factory',
    'Wholesale Kurti Supplier Delhi Mumbai Bangalore Hyderabad'
  ],
  alternates: {
    canonical: 'https://www.alhayyinternational.com/wholesale',
  },
};

export default function WholesaleDirectoryPage() {
  const whatsappInquiryUrl = `https://wa.me/919622480276?text=${encodeURIComponent(
    'Salam Al Hayy International, I am looking for wholesale B2B pricing, catalogs, and MOQ details for Cotton Kurtis, Kaftans, and Co-ord Sets.'
  )}`;

  // Group cities by state
  const citiesByState = CITIES_DATA.reduce((acc, city) => {
    if (!acc[city.state]) {
      acc[city.state] = [];
    }
    acc[city.state].push(city);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#070E1E]">
      {/* Hero Banner */}
      <section className="relative bg-[#070E1E] text-white py-16 sm:py-20 border-b border-[#D4AF37]/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#070E1E] via-[#0B162C] to-[#070E1E] opacity-95" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102142] border border-[#D4AF37]/40 text-[#F7E7B6] text-xs uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Pan-India B2B Manufacturing &amp; Wholesale Network</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF7F2] leading-tight max-w-3xl">
            Direct Loom Apparel Manufacturer &amp; <span className="text-[#D4AF37]">Wholesale Supply Hub</span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
            Al Hayy International manufactures master-crafted pure cotton kurtis, handcrafted kaftans, and designer women co-ord sets. Supplying over 60+ retail fashion centers across India with fast insured cargo dispatch and low MOQ for boutique growth.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-xl transition-all"
            >
              <MessageSquare className="w-4 h-4 text-[#070E1E]" />
              <span>Connect With B2B Desk: +91 96224 80276</span>
            </a>

            <Link
              href="/shop"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-[#FAF7F2] font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore Live Catalog</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADBCC] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18]">
              Verified Supply Network
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E] mt-1">
              Select Your City / Retail Market
            </h2>
          </div>
          <div className="text-xs text-stone-500 font-mono">
            {CITIES_DATA.length} Cities Active for Direct Dispatch
          </div>
        </div>

        <div className="space-y-10">
          {Object.entries(citiesByState).map(([state, cities]) => (
            <div key={state} className="bg-white rounded-3xl border border-[#EADBCC] p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                  {state}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/wholesale/${city.slug}`}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] hover:border-[#D4AF37] hover:bg-[#070E1E] hover:text-[#FAF7F2] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-serif-luxury font-bold text-sm text-[#070E1E] group-hover:text-[#F7E7B6]">
                          {city.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                      </div>
                      <span className="block text-[11px] text-stone-500 group-hover:text-stone-300 mt-1">
                        {city.hubType}
                      </span>
                    </div>

                    <div className="pt-3 mt-3 border-t border-stone-200/60 group-hover:border-white/10 text-[10px] text-[#AA7E18] group-hover:text-[#D4AF37] font-semibold flex items-center justify-between">
                      <span>Delivery: {city.deliveryTime}</span>
                      <span>Low MOQ</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
