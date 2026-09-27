'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Star, 
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { getProducts, CATEGORIES } from '@/lib/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error loading products on home:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = activeCategoryFilter === 'All'
    ? products
    : products.filter(p => p.category?.toLowerCase() === activeCategoryFilter.toLowerCase());

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. European Editorial Hero Banner */}
      <HeroBanner />

      {/* 2. Curated Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Curated Collections
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Shop by Silhouette
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-600 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-stone-100 border border-stone-200/80 shadow-xs"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-stone-300 font-medium">
                  Atelier
                </span>
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold tracking-wide">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products with Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              New Arrivals
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Creations
            </h2>
          </div>

          {/* Minimalist Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['All', 'Tops & Kurtis', 'Kaftaans', 'co-ord sets', 'Silk jackets'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveCategoryFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategoryFilter === filter
                    ? 'bg-stone-950 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-2xl bg-stone-100 aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

        <div className="text-center pt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors shadow-sm"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. The 72-Hour Artisanal Craft Story Spotlight */}
      <section className="bg-stone-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Visual Box */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-stone-800">
              <img
                src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop"
                alt="Handloom weaving"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Narrative */}
            <div className="space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-400">
                Artisanal Devotion
              </span>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight text-white">
                Handcrafted With 72 Hours Of Dedication
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Every piece in our atelier is meticulously shaped by master artisans, requiring up to 72 hours of intricate hand-needlework. We harmonize centuries of generational textile heritage with effortless modern silhouettes.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-1">
                  <span className="text-lg font-bold text-white font-serif-luxury">Natural Fibers</span>
                  <p className="text-[11px] text-stone-400">Pure combed cotton, mulberry silks & cashmere</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60 space-y-1">
                  <span className="text-lg font-bold text-white font-serif-luxury">Fair Trade</span>
                  <p className="text-[11px] text-stone-400">Directly empowering indigenous artisan guilds</p>
                </div>
              </div>

              <div>
                <Link
                  href="/our-story"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-stone-300 transition-colors"
                >
                  <span>Read The Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Client Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
            Client Accolades
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
            What Our Patrons Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Aisha Mir',
              city: 'New Delhi',
              review: 'The embroidery on the Red Cotton Kurti is absolutely exquisite. You can immediately feel the weight of authentic handwork compared to factory prints.',
              rating: 5
            },
            {
              name: 'Meera Sengupta',
              city: 'Mumbai',
              review: 'Ordered the Cotton Kaftan and Co-ord set for my holiday. The fabric is so breathable and the silhouette is pure elegance. Express shipping was super fast!',
              rating: 5
            },
            {
              name: 'Zoya Fatima',
              city: 'Bengaluru',
              review: 'The silk jacket is breathtaking. True royal craftsmanship. Packaged in a beautiful gift box with an authenticity tag.',
              rating: 5
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-stone-900">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
                  ))}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-stone-900">{item.name}</h4>
                  <span className="text-stone-400 text-[11px]">{item.city}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                  Verified Order
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
