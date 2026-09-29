'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Images, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Eye, 
  Filter,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { getProducts, getLiveLookbookArchive } from '@/lib/api';
import QuickViewModal from '@/components/QuickViewModal';
import ScrollReveal from '@/components/ScrollReveal';

export default function LookbookPage() {
  const [products, setProducts] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function loadLiveLookbook() {
      try {
        setLoading(true);
        const liveProducts = await getProducts();
        setProducts(liveProducts || []);

        // 1. Build dynamic gallery items from live Database products
        const dynamicProductItems = [];
        (liveProducts || []).forEach((prod) => {
          const prodImages = Array.isArray(prod.images) && prod.images.length > 0 
            ? prod.images 
            : [prod.image];

          prodImages.forEach((imgUrl, imgIdx) => {
            if (imgUrl) {
              dynamicProductItems.push({
                id: `prod-${prod.id}-${imgIdx}`,
                src: imgUrl,
                title: prod.title,
                category: prod.category || 'Atelier Collection',
                price: prod.price,
                discount_price: prod.discount_price,
                productId: prod.id,
                slug: prod.slug,
                isProduct: true,
                fabric: prod.fabric,
                craft_details: prod.craft_details,
                tag: prod.category ? `${prod.category} • Handcrafted` : 'Atelier Pure'
              });
            }
          });
        });

        // 2. Add atelier live lookbook archive items (managed via admin)
        const liveArchive = getLiveLookbookArchive();
        const archiveItems = liveArchive.map((item) => ({
          ...item,
          isProduct: false,
          productId: null
        }));

        // Merge: Dynamic DB products first, followed by archive captures
        const combined = [...dynamicProductItems, ...archiveItems];
        
        // Remove duplicates by image src
        const unique = [];
        const seenSrc = new Set();
        for (const it of combined) {
          if (it.src && !seenSrc.has(it.src)) {
            seenSrc.add(it.src);
            unique.push(it);
          }
        }

        setGalleryItems(unique);
      } catch (err) {
        console.error('Failed to load lookbook data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveLookbook();
  }, []);

  // Filter Categories
  const categoriesList = ['All', ...new Set(galleryItems.map(item => item.category).filter(Boolean))];

  // Filter items by category and search query
  const filteredGallery = galleryItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (item.title && item.title.toLowerCase().includes(q)) || (item.tag && item.tag.toLowerCase().includes(q)) || (item.category && item.category.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 text-stone-900 overflow-x-hidden">
      {/* 1. Header Banner */}
      <section className="relative bg-[#070E1E] text-white py-14 sm:py-20 border-b border-[#D4AF37]/30 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.12),transparent_70%)]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B162C] border border-[#D4AF37]/40 text-[#F7E7B6] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Official Atelier Archive &bull; Live Database Gallery</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            The Haute Couture Lookbook
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            High-resolution visual documentation of our authentic Kashmiri mastercraft, bespoke unboxing packaging, flowing kaftans, tailored co-ords, and pure Changthangi pashmina weaves.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search silhouettes, fabrics, packaging..."
                className="w-full pl-11 pr-4 py-3 bg-[#0B162C]/90 border border-[#D4AF37]/40 rounded-full text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Controls & Categories Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5D9C8]">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map((cat) => {
              const count = cat === 'All' ? galleryItems.length : galleryItems.filter(i => i.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#070E1E] text-[#F7E7B6] shadow-md border border-[#D4AF37]'
                      : 'bg-white text-stone-700 hover:text-[#070E1E] border border-stone-200 hover:border-[#D4AF37]/40'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-[#D4AF37]/20 text-[#F7E7B6]' : 'bg-stone-100 text-stone-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-stone-500 shrink-0">
            <span className="font-mono font-bold text-[#AA7E18] bg-[#D4AF37]/10 px-3 py-1 rounded-xl border border-[#D4AF37]/20">
              Showing {filteredGallery.length} Photographs
            </span>
          </div>
        </div>
      </section>

      {/* 3. The Lookbook Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-stone-500 font-mono">
              Loading Live Atelier Visual Database...
            </p>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-[#E5D9C8] p-8 max-w-lg mx-auto">
            <Images className="w-12 h-12 text-[#AA7E18] mx-auto opacity-50" />
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900">No Photographs Match Your Search</h3>
            <p className="text-xs text-stone-500">Try selecting another silhouette category or clearing your search keywords.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-[#070E1E] text-[#F7E7B6] font-bold text-xs uppercase tracking-wider border border-[#D4AF37]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGallery.map((item, idx) => (
              <ScrollReveal
                key={item.id || idx}
                animation="fade-up"
                delay={Math.min((idx % 8) * 40, 320)}
                duration={500}
              >
                <div 
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#070E1E] border border-[#E5D9C8] shadow-xs hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-end"
                  onClick={() => setLightboxIndex(idx)}
                >
                  {/* Blurred Backdrop so zero empty space or cropping */}
                  <img
                    src={item.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-35"
                    aria-hidden="true"
                  />

                  {/* Main Crisp Image Top-Aligned so no head/face cutting */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className="relative z-10 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/95 via-[#070E1E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col justify-between p-4" />

                  {/* Top Badges & Maximize Icon */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[9px] font-mono text-[#F7E7B6] bg-[#070E1E]/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#D4AF37]/40 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="p-1.5 rounded-full bg-[#070E1E]/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#F7E7B6] flex items-center justify-center shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Bottom Card Content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white z-30 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 space-y-1.5">
                    <span className="text-[9px] uppercase tracking-widest text-[#F7E7B6] font-bold block">
                      {item.tag || item.category}
                    </span>
                    <h4 className="font-serif-luxury text-xs sm:text-sm font-bold text-white line-clamp-1">
                      {item.title}
                    </h4>

                    {item.price && (
                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <span className="text-xs font-bold text-[#F7E7B6]">
                          ₹{(item.discount_price || item.price).toLocaleString('en-IN')}
                        </span>
                        {item.productId && (
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              const matched = products.find(p => p.id === item.productId);
                              if (matched) setQuickViewProduct(matched);
                            }}
                            className="text-[10px] uppercase font-bold text-white hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer bg-white/10 px-2 py-0.5 rounded"
                          >
                            <ShoppingBag className="w-3 h-3" /> Quick View
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>

      {/* 4. Fullscreen Interactive Lightbox */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#070E1E]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-12 right-0 sm:-right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-[#D4AF37]/50 transition-all cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Image Frame with Ambient Blurred Glow */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 bg-[#0B162C] max-h-[75vh] aspect-[3/4] sm:aspect-auto sm:max-w-xl sm:h-[75vh] flex items-center justify-center">
              {/* Blurred Ambient Backdrop */}
              <img
                src={filteredGallery[lightboxIndex].src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-30"
                aria-hidden="true"
              />
              {/* Crisp Uncropped Image */}
              <img
                src={filteredGallery[lightboxIndex].src}
                alt={filteredGallery[lightboxIndex].title}
                className="relative z-10 w-full h-full object-contain"
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length)}
              className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#070E1E]/80 hover:bg-[#D4AF37] hover:text-[#070E1E] text-white border border-[#D4AF37]/40 backdrop-blur-md transition-all cursor-pointer"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setLightboxIndex((prev) => (prev + 1) % filteredGallery.length)}
              className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#070E1E]/80 hover:bg-[#D4AF37] hover:text-[#070E1E] text-white border border-[#D4AF37]/40 backdrop-blur-md transition-all cursor-pointer"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Photo Info Bar & Shop Link */}
            <div className="mt-4 px-6 py-3 bg-[#0B162C]/95 rounded-2xl border border-[#D4AF37]/40 backdrop-blur-md text-center flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-xl">
              <div className="text-left space-y-0.5">
                <span className="text-[10px] font-mono text-[#F7E7B6] uppercase tracking-widest px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/30 inline-block">
                  {filteredGallery[lightboxIndex].category}
                </span>
                <h3 className="font-serif-luxury text-sm font-bold text-white">
                  {filteredGallery[lightboxIndex].title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-400 font-mono">
                  {lightboxIndex + 1} / {filteredGallery.length}
                </span>
                {filteredGallery[lightboxIndex].productId ? (
                  <Link
                    href={`/product/${filteredGallery[lightboxIndex].productId}`}
                    className="px-4 py-2 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
                  >
                    <span>Shop Piece</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href="/shop"
                    className="px-4 py-2 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
                  >
                    <span>Browse Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
