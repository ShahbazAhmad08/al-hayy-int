'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  Play,
  Volume2,
  VolumeX,
  Zap,
  Tag,
  Loader2
} from 'lucide-react';
import { getProducts, getLookbookReels } from '@/lib/api';
import QuickViewModal from '@/components/QuickViewModal';
import ScrollReveal from '@/components/ScrollReveal';

export default function LookbookPage() {
  const [products, setProducts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReelIndex, setActiveReelIndex] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    async function loadLiveLookbook() {
      try {
        setLoading(true);
        const [liveProducts, liveReels] = await Promise.all([
          getProducts(),
          getLookbookReels()
        ]);

        setProducts(liveProducts || []);

        let combinedReels = [];

        // 1. Live Database Lookbook Reels (Only those with actual video_url)
        if (Array.isArray(liveReels) && liveReels.length > 0) {
          liveReels.forEach(r => {
            if (r.video_url && typeof r.video_url === 'string' && r.video_url.trim() !== '') {
              let matchedProduct = r.product;
              if (!matchedProduct && r.product_id) {
                matchedProduct = (liveProducts || []).find(p => String(p.id) === String(r.product_id));
              }
              combinedReels.push({
                id: r.id,
                title: r.title,
                category: r.category || 'Kurtis',
                tag: r.tag || 'Atelier Reel',
                video_url: r.video_url.trim(),
                image_url: r.image_url || matchedProduct?.image || '/images/hero-packaging.jpg',
                product: matchedProduct || null,
                product_id: r.product_id
              });
            }
          });
        }

        // 2. Also include any products with direct video_url as interactive reels
        (liveProducts || []).forEach(p => {
          if (p.video_url && typeof p.video_url === 'string' && p.video_url.trim() !== '') {
            const alreadyExists = combinedReels.some(r => r.video_url === p.video_url.trim());
            if (!alreadyExists) {
              combinedReels.push({
                id: `prod-vid-${p.id}`,
                title: p.title,
                category: p.category || 'Atelier',
                tag: 'Craft Video',
                video_url: p.video_url.trim(),
                image_url: p.image,
                product: p,
                product_id: p.id
              });
            }
          }
        });

        setReels(combinedReels);
      } catch (err) {
        console.error('Failed to load lookbook data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveLookbook();
  }, []);

  // Keyboard navigation for reel viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeReelIndex === null) return;
      if (e.key === 'ArrowRight') {
        setActiveReelIndex((prev) => (prev + 1) % filteredReels.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveReelIndex((prev) => (prev - 1 + filteredReels.length) % filteredReels.length);
      } else if (e.key === 'Escape') {
        setActiveReelIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Filter Categories
  const categoriesList = ['All', ...new Set(reels.map(item => item.category).filter(Boolean))];

  // Filter items by category and search query
  const filteredReels = reels.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (item.title && item.title.toLowerCase().includes(q)) || (item.tag && item.tag.toLowerCase().includes(q)) || (item.category && item.category.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const activeReel = activeReelIndex !== null ? filteredReels[activeReelIndex] : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 text-stone-900 overflow-x-hidden">
      {/* 1. Header Banner */}
      <section className="relative bg-[#070E1E] text-white py-14 sm:py-20 border-b border-[#D4AF37]/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.12),transparent_70%)]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B162C] border border-[#D4AF37]/40 text-[#F7E7B6] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Official Atelier Video Reels &bull; Live Database Archive</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            The Haute Couture Lookbook
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Watch short video reels of our authentic Kashmiri mastercraft, flowing silhouettes, Sozni needlework, and click to view or shop any linked creation instantly.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reels, fabrics, silhouettes..."
                className="w-full pl-11 pr-4 py-3 bg-[#0B162C]/90 border border-[#D4AF37]/40 rounded-full text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-white text-xs p-1 cursor-pointer"
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
              const count = cat === 'All' ? reels.length : reels.filter(i => i.category === cat).length;
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
              Showing {filteredReels.length} Reels
            </span>
          </div>
        </div>
      </section>

      {/* 3. The Lookbook Reels Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-stone-500 font-mono">
              Loading Live Atelier Video Reels...
            </p>
          </div>
        ) : reels.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-[#E5D9C8] p-8 max-w-md mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#AA7E18]">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900">No Lookbook Videos Yet</h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
              Exclusive craft videos and fabric showcase reels uploaded via the Admin Dashboard will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 rounded-full bg-[#070E1E] text-[#F7E7B6] font-bold text-xs uppercase tracking-wider border border-[#D4AF37] cursor-pointer hover:bg-[#D4AF37] hover:text-[#070E1E] transition-all"
            >
              Explore Catalog
            </Link>
          </div>
        ) : filteredReels.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-[#E5D9C8] p-8 max-w-lg mx-auto">
            <Images className="w-12 h-12 text-[#AA7E18] mx-auto opacity-50" />
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900">No Reels Match Your Filter</h3>
            <p className="text-xs text-stone-500">Try selecting another category or resetting search keywords.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-[#070E1E] text-[#F7E7B6] font-bold text-xs uppercase tracking-wider border border-[#D4AF37] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredReels.map((reel, idx) => (
              <ScrollReveal
                key={reel.id || idx}
                animation="fade-up"
                delay={Math.min((idx % 8) * 40, 320)}
                duration={500}
              >
                <div 
                  className="group relative rounded-3xl overflow-hidden aspect-[9/16] sm:aspect-[3/4] bg-[#070E1E] border border-[#E5D9C8] shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
                  onClick={() => setActiveReelIndex(idx)}
                >
                  {/* Thumbnail Cover Image or Video Preview */}
                  <img
                    src={reel.image_url || '/images/hero-packaging.jpg'}
                    alt={reel.title}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/95 via-[#070E1E]/25 to-transparent z-10" />

                  {/* Play Reel Indicator Circle */}
                  <div className="relative z-20 p-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#F7E7B6] bg-[#070E1E]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D4AF37]/40 uppercase tracking-wider font-bold">
                      {reel.category}
                    </span>

                    <div className="w-9 h-9 rounded-full bg-[#070E1E]/80 backdrop-blur-md border border-[#D4AF37]/60 text-[#D4AF37] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-[#070E1E] transition-all">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Info & Linked Product Badge */}
                  <div className="relative z-20 p-4 space-y-2 text-white">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#F7E7B6] font-bold block">
                        {reel.tag}
                      </span>
                      <h4 className="font-serif-luxury text-xs sm:text-sm font-bold text-white line-clamp-2">
                        {reel.title}
                      </h4>
                    </div>

                    {/* Linked Product Chip if linked */}
                    {reel.product && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewProduct(reel.product);
                        }}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-between gap-2 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={reel.product.image || reel.image_url}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover shrink-0 border border-white/20"
                          />
                          <div className="truncate">
                            <span className="text-[10px] font-bold text-[#F7E7B6] block truncate">
                              {reel.product.title}
                            </span>
                            <span className="text-[9px] text-stone-300 font-mono">
                              ₹{(reel.product.discount_price || reel.product.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <span className="text-[9px] font-bold uppercase text-[#D4AF37] shrink-0 bg-[#070E1E]/80 px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                          Shop
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>

      {/* 4. FULLSCREEN IMMERSIVE REEL VIEWER WITH SWIPE & ARROW KEYS */}
      {activeReel && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#070E1E]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setActiveReelIndex(null)}
        >
          <div 
            className="relative max-w-lg w-full max-h-[92vh] h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar Controls */}
            <div className="absolute -top-12 inset-x-0 flex items-center justify-between text-white z-50">
              <span className="text-xs font-mono text-[#F7E7B6] font-bold">
                Reel {activeReelIndex + 1} of {filteredReels.length} • Use ← → Arrow Keys
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-[#D4AF37]/40 transition-all cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setActiveReelIndex(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-[#D4AF37]/40 transition-all cursor-pointer"
                  title="Close Reel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Left & Right Arrow Buttons */}
            <button
              onClick={() => setActiveReelIndex((prev) => (prev - 1 + filteredReels.length) % filteredReels.length)}
              className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#070E1E]/80 hover:bg-[#D4AF37] hover:text-[#070E1E] text-white border border-[#D4AF37]/50 backdrop-blur-md transition-all cursor-pointer z-50 shadow-xl"
              title="Previous Reel (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setActiveReelIndex((prev) => (prev + 1) % filteredReels.length)}
              className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#070E1E]/80 hover:bg-[#D4AF37] hover:text-[#070E1E] text-white border border-[#D4AF37]/50 backdrop-blur-md transition-all cursor-pointer z-50 shadow-xl"
              title="Next Reel (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Video Screen (9:16 Ratio Container) */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-2xl bg-black flex items-center justify-center">
              {activeReel.video_url ? (
                <video
                  ref={videoRef}
                  src={activeReel.video_url}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeReel.image_url}
                  alt={activeReel.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Dark Vignette Bottom Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/95 via-transparent to-transparent pointer-events-none" />

              {/* Reel Info & Connected Product Floating Box */}
              <div className="absolute inset-x-0 bottom-0 p-5 space-y-3 z-30">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#F7E7B6] bg-[#070E1E]/80 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 uppercase tracking-widest font-bold inline-block">
                    {activeReel.category} • {activeReel.tag}
                  </span>
                  <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-white drop-shadow-md">
                    {activeReel.title}
                  </h3>
                </div>

                {/* Linked Product Card with Instant Shop Button */}
                {activeReel.product && (
                  <div className="p-3 rounded-2xl bg-[#0B162C]/90 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-between gap-3 shadow-xl">
                    <div className="flex items-center gap-3 truncate">
                      <img
                        src={activeReel.product.image || activeReel.image_url}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/40 shrink-0"
                      />
                      <div className="truncate text-left">
                        <h4 className="font-serif-luxury text-xs font-bold text-white truncate">
                          {activeReel.product.title}
                        </h4>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-[#F7E7B6]">
                            ₹{(activeReel.product.discount_price || activeReel.product.price).toLocaleString('en-IN')}
                          </span>
                          {activeReel.product.discount_price && (
                            <span className="text-[10px] text-stone-400 line-through">
                              ₹{activeReel.product.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/product/${activeReel.product.id}`}
                      className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shrink-0 transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-[#070E1E]" />
                      <span>View & Buy</span>
                    </Link>
                  </div>
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
