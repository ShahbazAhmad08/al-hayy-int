'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  X, 
  Sparkles, 
  ChevronRight,
  RotateCcw,
  Feather,
  BookOpen,
  ShieldCheck,
  Truck,
  ArrowRight
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import SEOStructuredData from '@/components/SEOStructuredData';
import ScrollReveal from '@/components/ScrollReveal';
import { getProducts, getCategories, getLiveCategoriesArchive, CATEGORIES as INITIAL_CATEGORIES } from '@/lib/api';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSeason, setSelectedSeason] = useState('All'); // 'All' | 'Summer Collection' | 'Winter Collection'
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'
  const [maxPrice, setMaxPrice] = useState(10000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    // Initial sync with live archive
    const liveCats = getLiveCategoriesArchive();
    if (liveCats && liveCats.length > 0) {
      setCategories(liveCats);
    }

    async function load() {
      setLoading(true);
      try {
        const [data, cats] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(data || []);
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      } catch (e) {
        console.error('Failed to load shop products', e);
      } finally {
        setLoading(false);
      }
    }
    load();

    const handleCatsUpdated = (e) => {
      if (e?.detail) setCategories(e.detail);
      else setCategories(getLiveCategoriesArchive());
    };
    window.addEventListener('alhayy_categories_updated', handleCatsUpdated);
    return () => window.removeEventListener('alhayy_categories_updated', handleCatsUpdated);
  }, []);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('season')) {
      setSelectedSeason(searchParams.get('season'));
    }
  }, [searchParams]);

  // Filtering & Sorting Logic
  const filteredProducts = products.filter((p) => {
    // Category match
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    // Season match
    const isSummer = (p.season === 'summer' || (!p.season && (p.category?.toLowerCase().includes('kurti') || p.category?.toLowerCase().includes('kaftaan') || p.category?.toLowerCase().includes('co-ord') || p.title?.toLowerCase().includes('kurti') || p.title?.toLowerCase().includes('kaftan') || p.title?.toLowerCase().includes('co-ord') || p.title?.toLowerCase().includes('cotton') || p.title?.toLowerCase().includes('summer'))));
    const isWinter = (p.season === 'winter' || (!p.season && (p.category?.toLowerCase().includes('jacket') || p.category?.toLowerCase().includes('pashmina') || p.category?.toLowerCase().includes('shawl') || p.title?.toLowerCase().includes('jacket') || p.title?.toLowerCase().includes('pashmina') || p.title?.toLowerCase().includes('shawl') || p.title?.toLowerCase().includes('velvet') || p.title?.toLowerCase().includes('silk') || p.title?.toLowerCase().includes('shrug') || p.title?.toLowerCase().includes('winter'))));

    const matchesSeason =
      selectedSeason === 'All' ||
      (selectedSeason === 'Summer Collection' && (p.season === 'summer' || isSummer || p.season === 'all')) ||
      (selectedSeason === 'Winter Collection' && (p.season === 'winter' || isWinter || p.season === 'all'));

    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);

    // Price match
    const effectivePrice = Number(p.discount_price || p.price);
    const matchesPrice = effectivePrice <= maxPrice;

    return matchesCategory && matchesSeason && matchesSearch && matchesPrice;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.discount_price || a.price);
    const priceB = Number(b.discount_price || b.price);

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.is_featured || 0) - (a.is_featured || 0);
  });

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSeason('All');
    setSearchQuery('');
    setMaxPrice(10000);
    setSortBy('featured');
    setMobileFilterOpen(false);
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Shop All Collections', url: '/shop' },
    ...(selectedCategory !== 'All' ? [{ name: selectedCategory, url: `/shop?category=${encodeURIComponent(selectedCategory)}` }] : [])
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      <SEOStructuredData type="BreadcrumbList" data={breadcrumbs} />

      {/* Breadcrumb Path */}
      <nav className="flex items-center space-x-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold">Shop Collections</span>
        {selectedCategory !== 'All' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-950 font-bold">{selectedCategory}</span>
          </>
        )}
      </nav>

      {/* Shop Header Banner */}
      <ScrollReveal animation="fade-down" duration={750}>
        <div className="rounded-3xl bg-stone-950 p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-lg border border-stone-800">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-200 border border-white/15 text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Artisanal Atelier Catalog</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {selectedCategory === 'All' ? 'All Atelier Collections' : selectedCategory}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Discover master-embroidered cotton kurtis, airy kaftans, tailored co-ords, and authentic Changthangi pashmina handwoven by heritage master weavers.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-900/10 to-transparent pointer-events-none" />
        </div>
      </ScrollReveal>

      {/* Filter and Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 font-serif-luxury font-bold text-base text-stone-950">
                <SlidersHorizontal className="w-4 h-4 text-stone-700" />
                <span>Refine Styles</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-stone-500 hover:text-stone-950 font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Collections
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-medium">All Pieces</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] opacity-70 font-mono">{products.length}</span>
                    <div className="w-6 h-6 rounded-md bg-stone-200/60 flex items-center justify-center text-[10px]">
                      ✨
                    </div>
                  </div>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-stone-950 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate pr-1.5 font-medium">{cat.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] opacity-70 font-mono">
                        {products.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length}
                      </span>
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt=""
                          className="w-6 h-6 rounded-md object-cover border border-stone-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-stone-200/60 flex items-center justify-center text-[9px] text-stone-600">
                          {cat.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-stone-700">Max Price</span>
                <span className="font-bold text-stone-950">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={800}
                max={10000}
                step={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-stone-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>₹800</span>
                <span>₹10,000</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Product Showcase */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Season Toggle Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Summer Collection', 'Winter Collection'].map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  selectedSeason === season
                    ? 'bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/50 shadow-md transform scale-[1.02]'
                    : 'bg-white text-stone-600 border border-stone-200 hover:text-stone-950 hover:bg-stone-50 shadow-2xs'
                }`}
              >
                {season}
              </button>
            ))}
          </div>

          {/* Top Sort & Mobile Filter Bar */}
          <div className="p-3.5 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-900 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <span className="text-xs text-stone-500">
                Showing <strong className="text-stone-950">{sortedProducts.length}</strong> creations
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-stone-500 whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:outline-none focus:ring-1 focus:ring-stone-950 cursor-pointer"
              >
                <option value="featured">✨ Featured Atelier Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated & Loved</option>
              </select>
            </div>
          </div>

          {/* Product Grid (Exact 2-column mobile, 3-column desktop) */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-2xl sm:rounded-3xl bg-stone-100 aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200/80 space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                  No creations match your filters
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your price range or exploring all heritage categories.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {sortedProducts.map((p, idx) => (
                <ScrollReveal
                  key={p.id}
                  animation="fade-up"
                  delay={(idx % 6) * 90}
                  duration={650}
                  className="h-full"
                >
                  <ProductCard
                    product={p}
                    onQuickView={(item) => setQuickViewProduct(item)}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO Collection Guide & Buying Advice */}
      <section className="pt-8 border-t border-stone-200">
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5D9C8] shadow-xs space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#AA7E18] border border-[#E5D9C8] text-[10px] font-bold uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Atelier Buying &amp; Styling Guide</span>
              </div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#070E1E]">
                Choosing Your Perfect Kashmiri Handcrafted Silhouette
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light max-w-4xl">
                Whether you are curating a festive bridal trousseau, elevating your daily ethnic wardrobe, or seeking the perfect luxury gift, our collections are handcrafted using pure natural fibers, delicate needlework, and timeless Kashmiri craftsmanship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8]/70 space-y-2">
                <h3 className="font-serif-luxury text-sm font-bold text-[#070E1E]">
                  Embroidered Kurtis &amp; Tunics
                </h3>
                <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                  Tailored in premium 60s combed cotton with intricate Aari threadwork along necklines and cuffs. Pair with palazzo trousers or fitted pants for effortless formal grace.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8]/70 space-y-2">
                <h3 className="font-serif-luxury text-sm font-bold text-[#070E1E]">
                  Luxury Flowing Kaftans
                </h3>
                <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                  Free-flowing silhouettes with adjustable waist drawstrings. Breathable fabrics ensure comfort for day-to-night festive occasions, resort evenings, and intimate gatherings.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8]/70 space-y-2">
                <h3 className="font-serif-luxury text-sm font-bold text-[#070E1E]">
                  Contemporary Co-Ord Sets
                </h3>
                <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                  Matched two-piece ensembles combining modern crop and tunic cuts with traditional needlecraft. Flattering cuts tailored for effortless modern styling.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8]/70 space-y-2">
                <h3 className="font-serif-luxury text-sm font-bold text-[#070E1E]">
                  Modal Silk Jackets &amp; Pashmina
                </h3>
                <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                  Structured layering pieces crafted from mulberry silk and authentic Kashmiri loom weaves. Embellished with metallic zari cords and fine thread embroidery.
                </p>
              </div>
            </div>

            {/* Sizing & Concierge Box */}
            <div className="p-5 rounded-2xl bg-[#070E1E] text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="font-serif-luxury font-bold text-sm text-[#F7E7B6] block">
                  Need Help Finding the Ideal Size or Custom Fit?
                </span>
                <p className="text-stone-300 font-light text-[11px]">
                  Our Srinagar atelier provides personalized sizing consultations, bridal alterations, and custom colorways.
                </p>
              </div>
              <a
                href="https://wa.me/919622480276?text=Salam%20Al%20Hayy%20Concierge,%20I%20need%20help%20choosing%20the%20right%20size%20and%20silhouette."
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-all shadow-md shrink-0"
              >
                WhatsApp Stylist
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* MOBILE FILTER SLIDE-OUT DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2 font-serif-luxury font-bold text-base text-stone-950">
                  <SlidersHorizontal className="w-4 h-4 text-stone-700" />
                  <span>Filter Collections</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category Selection */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                  Categories
                </span>
                <div className="space-y-1.5">
                  <button
                    onClick={() => { setSelectedCategory('All'); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedCategory === 'All'
                        ? 'bg-stone-950 text-white'
                        : 'bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>All Pieces</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono">{products.length}</span>
                      <div className="w-6 h-6 rounded-md bg-stone-200/60 flex items-center justify-center text-[10px]">
                        ✨
                      </div>
                    </div>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.name); setMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedCategory.toLowerCase() === cat.name.toLowerCase()
                          ? 'bg-stone-950 text-white'
                          : 'bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="truncate pr-1.5">{cat.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono">
                          {products.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length}
                        </span>
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt=""
                            className="w-6 h-6 rounded-md object-cover border border-stone-200 shadow-2xs"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-stone-200/60 flex items-center justify-center text-[9px]">
                            {cat.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Slider */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-stone-700">Max Price</span>
                  <span className="font-bold text-stone-950">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={800}
                  max={10000}
                  step={200}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-stone-950 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>₹800</span>
                  <span>₹10,000</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-stone-950 text-white text-xs font-bold"
              >
                Apply Filters
              </button>
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-500">Loading Kashmiri Collections...</div>}>
      <ShopContent />
    </Suspense>
  );
}
