import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock, MapPin, Feather, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import SEOStructuredData from '@/components/SEOStructuredData';

export const metadata = {
  title: 'Our Story & Artisanal Craft Heritage | Al Hayy International',
  description: 'Learn about Al Hayy International, our master artisan families, and the timeless hand-embroidery process behind our luxury kurtis, kaftans, and designer fashion.',
  openGraph: {
    title: 'Our Story & Artisan Heritage | Al Hayy International',
    description: 'Learn about Al Hayy International, our master artisan families, and the bespoke hand-embroidery process.',
    url: 'https://www.alhayyinternational.com/our-story',
  }
};

export default function OurStoryPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Our Story', url: '/our-story' }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <SEOStructuredData type="BreadcrumbList" data={breadcrumbs} />

      {/* Hero */}
      <section className="relative bg-stone-950 text-white py-20 sm:py-28 px-4 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1600&auto=format&fit=crop"
            alt="Loom Atelier"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/60" />

        <div className="relative max-w-3xl mx-auto space-y-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 border border-white/20 text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Preserving Artisan Heritage</span>
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold leading-tight text-white">
            The Artisanal Devotion
          </h1>
          <p className="text-xs sm:text-base text-stone-300 leading-relaxed font-light">
            Behind every delicate curve of needlecraft and every pure silk fold lies decades of generational devotion and contemporary luxury couture.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Chapter I</span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
              The Genesis of Al Hayy
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              <strong>Al Hayy International</strong> was envisioned as a sanctuary for traditional textile arts and high-end couture. We work directly with generational master weavers, needlework artisans, and loom custodians to bring bespoke, handcrafted fashion to modern discerning wardrobes worldwide.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Every kurti, flowing kaftan, and tailored co-ord is conceptualized to harmonize heritage grandeur with breezy, contemporary European silhouette wearability.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg border border-stone-200/80 aspect-[4/3] bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop"
              alt="Artisan embroidery"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-stone-900">
              72h Needlework
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              No machine printing or synthetic shortcuts. Each piece is guided by needle and wooden loom.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-stone-900">
              Direct Artisan Impact
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Fair-trade wages directly sustaining 80+ indigenous weaver families in Srinagar.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-stone-900">
              100% Purity Certified
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Combed natural cotton, mulberry silk, and authentic Changthangi goat pashmina.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-stone-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md active:scale-95"
          >
            <span>Explore the Handcrafted Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
