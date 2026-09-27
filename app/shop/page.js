'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  ArrowUpDown, 
  X, 
  Sparkles, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import SEOStructuredData from '@/components/SEOStructuredData';
import { getProducts, CATEGORIES } from '@/lib/api';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'
  const [maxPrice, setMaxPrice] = useState(10000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (e) {
        console.error('Failed to load shop products', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
  }, [searchParams]);

  // Filtering & Sorting Logic
  const filteredProducts = products.filter((p) => {
    // Category match
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);

    // Price match
    const effectivePrice = Number(p.discount_price || p.price);
    const matchesPrice = effectivePrice <= maxPrice;

    return matchesCategory && matchesSearch && matchesPrice;
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
    setSearchQuery('');
    setMaxPrice(10000);
    setSortBy('featured');
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Shop All Collections', url: '/shop' },
    ...(selectedCategory !== 'All' ? [{ name: selectedCategory, url: `/shop?category=${selectedCategory}` }] : [])
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SEOStructuredData type="BreadcrumbList" data={breadcrumbs} />

      {/* Breadcrumb Path */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-[#064E3B]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold">Shop Collections</span>
        {selectedCategory !== 'All' && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-800 font-bold">{selectedCategory}</span>
          </>
        )}
      </nav>

      {/* Shop Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#022C22] via-[#064E3B] to-[#022C22] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/40 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Authentic Atelier
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight">
            {selectedCategory === 'All' ? 'All Heritage Collections' : selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-light">
            Discover master-embroidered cotton kurtis, airy kaftans, tailored co-ords, and pure mulberry silk jackets handwoven by generational weavers of Srinagar.
          </p>
        </div>
      </div>

      {/* Filter and Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-[#EADBCC] shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-serif-luxury font-bold text-base text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <span>Refine Styles</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-amber-800 hover:text-amber-900 font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Categories
              </span>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-[#022C22] text-amber-200 font-bold'
                      : 'text-slate-600 hover:bg-stone-100'
                  }`}
                >
                  <span>All Pieces</span>
                  <span className="text-[10px]">{products.length}</span>
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-[#022C22] text-amber-200 font-bold'
                        : 'text-slate-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px]">
                      {products.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-700">Max Price</span>
                <span className="font-bold text-[#064E3B]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={800}
                max={10000}
                step={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹800</span>
                <span>₹10,000</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Product Showcase */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Mobile Filter Bar */}
          <div className="p-4 bg-white rounded-2xl border border-[#EADBCC] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 rounded-xl text-xs font-semibold text-slate-800"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <span className="text-xs text-slate-500">
                Showing <strong className="text-slate-900">{sortedProducts.length}</strong> creations
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-500 whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-stone-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="featured">✨ Featured & Artisan Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated & Loved</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-2xl bg-stone-100 aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#EADBCC] space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                  No creations match your filters
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your price range or exploring all heritage categories.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-[#022C22] text-amber-200 text-xs font-bold uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(item) => setQuickViewProduct(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
    <Suspense fallback={<div className="p-12 text-center">Loading Kashmiri Collections...</div>}>
      <ShopContent />
    </Suspense>
  );
}
