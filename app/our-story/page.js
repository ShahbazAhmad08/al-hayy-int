import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock, MapPin, Feather, Heart, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Our Heritage Story & 72h Craftsmanship Legacy',
  description: 'Learn about Al Hayy Kashmir, our indigenous artisan families, and the timeless 72-hour hand-embroidery process from Srinagar valley.',
};

export default function OurStoryPage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero */}
      <section className="relative bg-[#022C22] text-white py-20 sm:py-28 px-4 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1600&auto=format&fit=crop"
            alt="Kashmir Valley Loom"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#022C22] via-[#022C22]/80 to-[#022C22]/60" />

        <div className="relative max-w-3xl mx-auto space-y-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-900/40 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Preserving Kashmiri Heritage
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold leading-tight text-[#FDF8EE]">
            The 72-Hour Devotion
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
            Behind every delicate curve of Aari embroidery and every whisper-light pashmina fold lies centuries of generational devotion from the jewel of the Himalayas.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B45309]">Chapter I</span>
            <h2 className="font-serif-luxury text-3xl font-bold text-[#022C22]">
              Born on the Banks of Dal Lake
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Founded in Srinagar, Kashmir, <strong>Al Hayy Kashmir</strong> was envisioned as a sanctuary for traditional textile arts threatened by industrial fast fashion. We work closely with master weavers, needlework artisans, and loom custodians whose craft dates back to the 15th-century Mughal atelier era.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every kurti, flowing kaftan, and tailored co-ord is conceptualized to harmonize heritage grandeur with breezy modern wearability.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#EADBCC] aspect-[4/3] bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop"
              alt="Artisan embroidery"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-3xl bg-white border border-[#EADBCC] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-slate-900">72 Hours per Piece</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Master needlework requires patience. Our artisans spend up to 72 hours hand-embroidering intricate Chinar leaf and lotus motifs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EADBCC] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-slate-900">Pure Organic Fibers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From combed, breathable long-staple cotton to pure Changthangi cashmere and mulberry silks, we never compromise on raw purity.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EADBCC] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-slate-900">Fair Trade & Devotion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct-from-artisan pricing guarantees fair living wages for our Kashmiri guild families without middleman deductions.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#022C22] via-[#064E3B] to-[#022C22] text-white text-center space-y-4 shadow-2xl">
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#FDF8EE]">
            Embrace The Royal Kashmiri Lifestyle
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md mx-auto">
            Experience our timeless kurtis, kaftans, and silk masterpieces delivered straight from Srinagar to your doorstep.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg"
          >
            <span>Explore Heritage Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
