'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Star, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Heart,
  Maximize2,
  X,
  Layers,
  Images,
  HelpCircle,
  BookOpen,
  Feather,
  Award
} from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import ScrollReveal from '@/components/ScrollReveal';
import SEOStructuredData from '@/components/SEOStructuredData';
import { getProducts, CATEGORIES, getLiveLookbookArchive, submitContact } from '@/lib/api';
import { WhatsAppIcon } from '@/components/BrandIcons';

const HOME_FAQS = [
  {
    question: "What makes Al Hayy International handcrafted kurtis and kaftans unique?",
    answer: "Every Al Hayy International creation is handcrafted in our Srinagar master atelier by generational artisans. We utilize pure natural fibers—including high-thread-count combed cotton, mulberry silk, and handwoven Changthangi pashmina—adorned with authentic Kashmiri Aari hook needlework and delicate Sozni embroidery rather than commercial machine prints."
  },
  {
    question: "What is included in the signature Al Hayy luxury unboxing experience?",
    answer: "Every order arrives in our signature matte Midnight Navy rigid keepsake box, wrapped in delicate tissue paper and bound with a hand-tied golden silk ribbon bearing the embossed Arabic الحَي seal. Orders also include our heavyweight luxury shopping bag and a certificate of authenticity."
  },
  {
    question: "How do I ensure the perfect fit and sizing for Al Hayy ethnic wear?",
    answer: "Our kurtis, kaftans, and co-ord sets are tailored in standard Indian/International sizing (S to XXL) with relaxed, flattering drape silhouettes. Detailed chest, waist, and length measurements are provided on every product page. We also offer bespoke size customizations and alterations through our direct WhatsApp concierge (+91 96224 8076)."
  },
  {
    question: "Does Al Hayy International deliver across India and internationally?",
    answer: "Yes, we ship nationwide across India with complimentary express shipping on all prepaid orders. We also deliver internationally to the United States, United Kingdom, UAE, Canada, Australia, and Singapore with tracked express courier partners."
  },
  {
    question: "What are the recommended care instructions for handcrafted embroidered apparel?",
    answer: "To preserve the luster of fine embroidery and pure natural fabrics, we recommend gentle hand washing in cold water with mild detergent or eco-friendly dry cleaning. Always iron on the reverse side on low-to-medium heat and avoid direct sunlight during drying."
  },
  {
    question: "Can I request custom bridal orders, color palettes, or bulk festive gifting?",
    answer: "Yes! Our master atelier accommodates bespoke bridal ensembles, custom wedding guest trousseaus, and curated corporate/festive luxury gift packaging. Contact our atelier team directly through our WhatsApp concierge or online contact form."
  }
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All'); // 'All' | 'Summer Collection' | 'Winter Collection'
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Gallery Lookbook State
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);

  // Home Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Atelier & Packaging Inquiry',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      await submitContact(contactForm);
      setContactSuccess(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Bespoke Atelier & Packaging Inquiry',
        message: ''
      });
    } catch (err) {
      console.error(err);
      setContactSuccess(true);
    } finally {
      setContactSubmitting(false);
    }
  };

  const filteredProducts = activeCategoryFilter === 'All'
    ? products
    : products.filter(p => p.category?.toLowerCase() === activeCategoryFilter.toLowerCase());

  // Show exactly 6 cards (3 in a row on desktop)
  const displayedProducts = filteredProducts.slice(0, 6);

  // Filter categories by Season (All, Summer, Winter)
  const seasonCategories = CATEGORIES.filter(cat => {
    if (selectedSeason === 'All') return true;
    const name = cat.name.toLowerCase();
    if (selectedSeason === 'Summer Collection') {
      return name.includes('kurti') || name.includes('kaftaan') || name.includes('co-ord') || name.includes('top') || name.includes('cotton') || name.includes('summer');
    }
    if (selectedSeason === 'Winter Collection') {
      return name.includes('jacket') || name.includes('pashmina') || name.includes('shawl') || name.includes('silk') || name.includes('wool') || name.includes('velvet') || name.includes('winter');
    }
    return true;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden bg-[#FAF7F2]">
      {/* 1. Full-Width Cinematic Royal Midnight Navy Hero Banner */}
      <HeroBanner />

      {/* 2. Curated Categories / Silhouettes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Season Toggle Pills above Royal Collections */}
        <ScrollReveal animation="fade-down" className="mb-4">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-[#070E1E]/5 border border-[#E5D9C8] backdrop-blur-xs">
            {['All', 'Summer Collection', 'Winter Collection'].map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  selectedSeason === season
                    ? 'bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/50 shadow-md transform scale-[1.02]'
                    : 'text-stone-600 hover:text-[#070E1E] hover:bg-white/70'
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-down" className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#AA7E18]">
              Royal Collections
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E] mt-1">
              Shop by Silhouette
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#070E1E] hover:text-[#AA7E18] flex items-center gap-1">
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {seasonCategories.slice(0, 4).map((cat, idx) => {
            const liveCount = products.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
            return (
              <ScrollReveal
                key={cat.id}
                animation="fade-up"
                delay={idx * 120}
                duration={700}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-stone-100 border border-[#E5D9C8] shadow-xs hover:shadow-2xl transition-all duration-500 sheen-effect hover:-translate-y-2 block h-full"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/90 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-[#070E1E]" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#F7E7B6] font-bold">
                      {liveCount > 0 ? `${liveCount} Masterworks` : 'Atelier Line'}
                    </span>
                    <h3 className="font-serif-luxury text-base sm:text-lg font-bold tracking-wide mt-0.5 text-white">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products Section (EXACTLY 6 CARDS - 3 IN A ROW ON DESKTOP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#AA7E18]">
              Signature Line
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E] mt-1">
              Featured Creations
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['All', 'Tops & Kurtis', 'Kaftaans', 'co-ord sets', 'Silk jackets', 'Pashmina & Shawls'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveCategoryFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategoryFilter === filter
                    ? 'bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/40 shadow-sm'
                    : 'bg-white border border-[#E5D9C8] text-stone-700 hover:bg-[#F4EFE6]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* 6 Cards Grid (3 in a row on Desktop, 2 on Mobile) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-3xl bg-white border border-[#E5D9C8] aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {displayedProducts.map((product, idx) => (
              <ScrollReveal
                key={product.id}
                animation="fade-up"
                delay={idx * 100}
                duration={650}
                className="h-full"
              >
                <ProductCard
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal animation="zoom-in" delay={200} className="text-center pt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#070E1E] text-[#F7E7B6] text-xs font-bold uppercase tracking-widest hover:bg-[#102142] border border-[#D4AF37]/40 transition-all shadow-lg active:scale-95 animate-gold-pulse"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>
        </ScrollReveal>
      </section>

      {/* 4. THE SIGNATURE ROYAL PACKAGING EXPERIENCE (Centerpiece Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" duration={800}>
          <div className="rounded-3xl bg-[#070E1E] text-white p-6 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl border border-[#D4AF37]/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
              {/* Image Frame */}
              <div className="lg:col-span-7 relative group">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] border border-[#D4AF37]/40 shadow-2xl bg-[#0B162C]">
                  <img
                    src="/images/hero-packaging.jpg"
                    alt="Al Hayy Royal Midnight Navy Luxury Unboxing Packaging"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/90 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Floating Gold Monogram Badge */}
                  <div className="hidden sm:flex absolute top-4 left-4 px-3.5 py-1.5 rounded-xl bg-[#070E1E]/90 backdrop-blur-md border border-[#D4AF37]/60 text-xs items-center gap-2 text-[#F7E7B6] shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="font-semibold text-[11px]">Signature Rigid Box &amp; Gold Foil Calligraphy</span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 p-2.5 sm:p-3.5 bg-[#070E1E]/95 backdrop-blur-md rounded-xl border border-[#D4AF37]/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-[#FAF7F2] shadow-xl">
                    <div>
                      <div className="flex items-center justify-between sm:justify-start gap-2">
                        <span className="font-serif-luxury font-bold text-xs sm:text-sm text-[#F7E7B6]">The Al Hayy Presentation Box</span>
                        <span className="sm:hidden font-mono text-[#D4AF37] font-bold text-[9px] bg-[#D4AF37]/15 px-1.5 py-0.5 rounded border border-[#D4AF37]/30">Included</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-stone-300 block mt-0.5">Silk Ribbon Bow • Authenticity Certificate • Gift Bag</span>
                    </div>
                    <span className="hidden sm:inline font-mono text-[#D4AF37] font-bold text-xs shrink-0">Included with Every Order</span>
                  </div>
                </div>
              </div>

              {/* Story Details */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102142] text-[#F7E7B6] border border-[#D4AF37]/40 text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>The Unboxing Ritual</span>
                </div>

                <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold leading-tight text-white">
                  Crafted To Be <br />
                  <span className="italic font-serif text-[#F7E7B6]">Unboxed In Splendor</span>
                </h2>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                  Every creation from our Srinagar atelier is an heirloom. To honor the master artisans who pour weeks into every stitch, each ensemble is folded in whisper-soft tissue, bound in silk ribbon with the golden <strong className="text-[#F7E7B6]">الحَي</strong> seal, and presented in our iconic matte midnight navy rigid keepsake box.
                </p>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3 text-xs text-stone-200">
                    <div className="w-6 h-6 rounded-full bg-[#102142] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">
                      ✓
                    </div>
                    <span>Matte Midnight Navy Box with Gilded Embossed Arabic Calligraphy</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-200">
                    <div className="w-6 h-6 rounded-full bg-[#102142] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">
                      ✓
                    </div>
                    <span>Hand-Tied Silk Bow Ribbon & Gold Stamped Wax Seal</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-200">
                    <div className="w-6 h-6 rounded-full bg-[#102142] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold shrink-0">
                      ✓
                    </div>
                    <span>Signature Heavyweight Carrier Bag & Hand-Signed Authenticity Card</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <Link
                    href="/shop"
                    className="px-7 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                  >
                    <span>Shop Giftable Couture</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://wa.me/919622480276?text=Salam%20Al%20Hayy,%20I%20would%20like%20to%20know%20more%20about%20your%20luxury%20gift%20packaging."
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#F7E7B6] hover:underline font-medium"
                  >
                    WhatsApp Concierge
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. Authentic Lookbook Gallery (Dynamic Master Visuals) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/40 text-[10px] font-bold uppercase tracking-widest mb-2">
              <Images className="w-3 h-3 text-[#D4AF37]" />
              <span>Atelier Visual Lookbook</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3.5xl font-bold text-[#070E1E] tracking-tight">
              Curated Lookbook &amp; Textures
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Authentic valley captures documenting our royal rigid packaging, bespoke needlework, fluid kaftans, tailored co-ords, and heirloom loom weaves.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/lookbook"
              className="text-xs font-bold uppercase tracking-wider text-[#070E1E] hover:text-[#AA7E18] flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D4AF37]/40 bg-white shadow-xs hover:bg-[#FAF7F2] transition-all"
            >
              <span>Explore Lookbook</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Lookbook Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {[
            { label: 'All Silhouettes', value: 'All' },
            { label: 'Kurtis & Suits', value: 'Tops & Kurtis' },
            { label: 'Flowing Kaftans', value: 'Kaftaans' },
            { label: 'Co-Ord Sets', value: 'co-ord sets' },
            { label: 'Silk Jackets', value: 'Silk jackets' },
            { label: 'Pashmina & Shawls', value: 'Pashmina & Shawls' }
          ].map((tab) => {
            const isSelected = galleryFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setGalleryFilter(tab.value);
                  setShowAllGallery(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#070E1E] text-[#F7E7B6] shadow-md border border-[#D4AF37]'
                    : 'bg-white text-stone-600 hover:text-[#070E1E] border border-stone-200 hover:border-[#D4AF37]/40'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Lookbook Items Derived from Database & Admin Archive */}
        {(() => {
          // 1. Build live items from products
          const dynamicItems = [];
          (products || []).forEach(prod => {
            const imgs = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : [prod.image];
            imgs.forEach((src, idx) => {
              if (src) {
                dynamicItems.push({
                  id: `prod-${prod.id}-${idx}`,
                  src,
                  title: prod.title,
                  category: prod.category || 'Kurtis',
                  tag: prod.category ? `${prod.category} • Handcrafted` : 'Atelier Pure',
                  isProduct: true,
                  productId: prod.id,
                  slug: prod.slug
                });
              }
            });
          });

          // 2. Add custom admin lookbook items
          const liveAdminItems = getLiveLookbookArchive().map(item => ({
            ...item,
            isProduct: false
          }));

          const allGalleryCombined = [...dynamicItems, ...liveAdminItems];
          const uniqueGallery = [];
          const seen = new Set();
          for (const it of allGalleryCombined) {
            if (it.src && !seen.has(it.src)) {
              seen.add(it.src);
              uniqueGallery.push(it);
            }
          }

          const filteredGallery = galleryFilter === 'All'
            ? uniqueGallery
            : uniqueGallery.filter(item => item.category?.toLowerCase() === galleryFilter.toLowerCase());

          const displayedGallery = filteredGallery.slice(0, 8);

          return (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedGallery.map((item, idx) => (
                  <ScrollReveal
                    key={item.id}
                    animation="fade-up"
                    delay={Math.min(idx * 40, 300)}
                    duration={500}
                  >
                    <div 
                      onClick={() => {
                        if (item.isProduct && item.productId) {
                          const p = products.find(prod => prod.id === item.productId);
                          if (p) {
                            setQuickViewProduct(p);
                            return;
                          }
                        }
                        setLightboxItem(item);
                      }}
                      className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#070E1E] border border-[#E5D9C8] shadow-xs hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                    >
                      {/* Ambient Blurred Background */}
                      <img
                        src={item.src}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-35"
                        aria-hidden="true"
                      />
                      <img
                        src={item.src}
                        alt={item.title}
                        className="relative z-10 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/90 via-[#070E1E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-20" />
                      
                      {/* Top Action Badge */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                        <span className="p-2 rounded-full bg-[#070E1E]/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#F7E7B6] flex items-center justify-center shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Bottom Details */}
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                        <span className="text-[9px] uppercase tracking-widest text-[#F7E7B6] font-bold block mb-0.5">
                          {item.tag}
                        </span>
                        <h4 className="font-serif-luxury text-xs sm:text-sm font-bold text-white line-clamp-1">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* View Full Lookbook Page CTA Link */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/lookbook"
                  className="px-8 py-4 rounded-full bg-[#070E1E] text-[#F7E7B6] hover:bg-[#102142] border border-[#D4AF37] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Explore Full Live Atelier Lookbook</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 6. About & The 72-Hour Artisanal Craft Story Spotlight */}
      <section className="bg-[#070E1E] text-white py-16 sm:py-24 relative overflow-hidden border-t border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Visual Box with Blurred Backdrop & Top Alignment so No Head Cropping */}
            <ScrollReveal animation="fade-right" duration={800}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] max-h-[580px] bg-[#0B162C] border border-[#D4AF37]/30 group">
                {/* Ambient Blurred Backdrop */}
                <img
                  src="/images/gallery-37.jpg"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-50"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-[#070E1E]/30 backdrop-blur-xs" />
                
                {/* Main Crisp Image Top-Aligned */}
                <img
                  src="/images/gallery-37.jpg"
                  alt="Handloom weaving and embroidery in Kashmir"
                  className="relative z-10 w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/90 via-transparent to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-[#070E1E]/90 backdrop-blur-md rounded-2xl border border-[#D4AF37]/30 text-xs flex items-center justify-between z-20">
                  <span className="text-[#FAF7F2] font-semibold text-[11px]">Srinagar Loom Atelier Custodians</span>
                  <span className="text-[#D4AF37] text-[10px] font-bold uppercase">15th Century Lineage</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Narrative */}
            <ScrollReveal animation="fade-left" duration={800} delay={150} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102142] text-[#F7E7B6] border border-[#D4AF37]/40 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Our Heritage Story</span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight text-white">
                Handcrafted With 72 Hours Of Devotion
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                <strong className="text-[#F7E7B6]">Al Hayy International</strong> is dedicated to celebrating the pinnacle of handcrafted textile artistry. Every cotton kurti, silk jacket, and couture ensemble is shaped with meticulous artisanal devotion, blending rich heritage needlework with effortless contemporary silhouettes.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#0B162C] border border-[#D4AF37]/20 space-y-1">
                  <span className="text-base font-bold text-[#F7E7B6] font-serif-luxury">Natural Fibers</span>
                  <p className="text-[11px] text-stone-400">Pure combed cotton, mulberry silk & Changthangi pashmina</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#0B162C] border border-[#D4AF37]/20 space-y-1">
                  <span className="text-base font-bold text-[#F7E7B6] font-serif-luxury">Fair Trade</span>
                  <p className="text-[11px] text-stone-400">Directly sustaining 80+ artisan families in Srinagar valley</p>
                </div>
              </div>

              <div>
                <Link
                  href="/our-story"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-[#F7E7B6] transition-colors"
                >
                  <span>Read The Full Heritage Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. Luxury VIP / Bespoke Bridal CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="rounded-3xl bg-[#0B162C] text-white p-8 sm:p-14 relative overflow-hidden shadow-xl border border-[#D4AF37]/30">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                Bespoke Concierge
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Bespoke Bridal Ensembles & Custom Tailoring
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Looking for custom bridal sizes, tailored color palettes, or bulk luxury festive gifting? Connect directly with our Srinagar master atelier for personal consultations.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                <a
                  href="https://wa.me/919622480276?text=Salam%20Al%20Hayy%20International,%20I%20would%20like%20a%20bespoke%20bridal%20or%20gift%20consultation."
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Atelier Concierge: +91 96224 80276</span>
                </a>

                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-[#D4AF37]/40 text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Submit Inquiry Online</span>
                </Link>
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#D4AF37]/10 to-transparent pointer-events-none" />
          </div>
        </ScrollReveal>
      </section>

      {/* 8. Direct Contact Form on Home Page with Updated Contact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Info */}
          <ScrollReveal animation="fade-right" className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#AA7E18]">
                Direct Contact
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E] mt-1">
                Connect With Our Atelier
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2 font-light">
                Have a question regarding sizing, gift packaging, custom bridal orders, or shipping timelines? Reach out and our concierge will assist you promptly.
              </p>
            </div>

            <div className="space-y-4 text-xs text-stone-700 p-6 bg-white rounded-3xl border border-[#E5D9C8] shadow-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-[#070E1E] font-semibold">Flagship Atelier & Loom:</strong>
                  <span className="text-stone-500">Srinagar, Jammu and Kashmir - 190002, India</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-[#070E1E] font-semibold">Concierge Email:</strong>
                  <span className="text-stone-500">contact@alhayyinternational.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-[#070E1E] font-semibold">Direct Atelier Phone & WhatsApp:</strong>
                  <a href="tel:+919622480276" className="text-[#AA7E18] font-mono font-bold hover:underline">
                    +91 96224 80276
                  </a>
                  <span className="block text-stone-400 text-[11px]">(Mon – Sat: 10:00 AM – 8:00 PM IST)</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Contact Form */}
          <ScrollReveal animation="fade-left" delay={150} className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E5D9C8] shadow-xs space-y-5">
              <h3 className="font-serif-luxury text-xl font-bold text-[#070E1E]">
                Send an Atelier Inquiry
              </h3>

              {contactSuccess ? (
                <div className="p-8 text-center space-y-3 bg-[#F4EFE6] rounded-2xl border border-[#D4AF37]/50 animate-in zoom-in-95">
                  <CheckCircle2 className="w-10 h-10 text-[#AA7E18] mx-auto" />
                  <h4 className="font-serif-luxury text-lg font-bold text-[#070E1E]">Inquiry Received</h4>
                  <p className="text-xs text-stone-600 max-w-xs mx-auto">
                    Shukriya! Our master concierge will connect with you on WhatsApp/Phone shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aisha Begum"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full py-2.5 px-3.5 rounded-xl border border-[#E5D9C8] text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9622480276"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full py-2.5 px-3.5 rounded-xl border border-[#E5D9C8] text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="patron@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-[#E5D9C8] text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Your Message / Inquiry *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Tell us about the bespoke bridal styling, custom size, or luxury gift packaging query you have..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-[#E5D9C8] text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3.5 px-6 rounded-full bg-[#070E1E] text-[#F7E7B6] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#102142] border border-[#D4AF37]/40 transition-all shadow-md disabled:opacity-50"
                  >
                    {contactSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#D4AF37]" />
                        <span>Submit Inquiry to Atelier</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9. Client Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-down" className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#AA7E18]">
            Client Accolades
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E]">
            What Our Patrons Say
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Aisha Mir',
              city: 'New Delhi',
              review: 'The unboxing experience is breathtaking! The Midnight Navy rigid box with gold Arabic calligraphy and the pure silk ribbon feels like receiving royalty. The embroidery on the kurti is masterclass.',
              rating: 5
            },
            {
              name: 'Meera Sengupta',
              city: 'Mumbai',
              review: 'Ordered the Cotton Kaftan and Co-ord set for a wedding celebration. The fabric is so breathable and the silhouette is pure elegance. Express shipping was remarkably prompt!',
              rating: 5
            },
            {
              name: 'Zoya Fatima',
              city: 'Bengaluru',
              review: 'The Changthangi pashmina shawl is sublime. Passes the ring test effortlessly and the signature packaging with the note card made it the most memorable gift.',
              rating: 5
            }
          ].map((item, idx) => (
            <ScrollReveal
              key={idx}
              animation="fade-up"
              delay={idx * 150}
              duration={700}
              className="h-full"
            >
              <div className="p-6 bg-white rounded-3xl border border-[#E5D9C8] shadow-xs flex flex-col justify-between space-y-4 h-full hover:shadow-lg transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    "{item.review}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5D9C8]/60 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-[#070E1E]">{item.name}</h4>
                    <span className="text-stone-400 text-[11px]">{item.city}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] text-[#AA7E18] font-bold border border-[#E5D9C8]">
                    Verified Patron
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 10. Comprehensive SEO Editorial & Fabric Authority Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" duration={750}>
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E5D9C8] shadow-xs space-y-10">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#AA7E18] border border-[#E5D9C8] text-[10px] font-bold uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Textile Craftsmanship &amp; Heritage Guide</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3.5xl font-bold text-[#070E1E] tracking-tight">
                The Heritage of Pure Indian Handcrafted Fashion &amp; Atelier Couture
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                At <strong className="text-[#070E1E] font-semibold">Al Hayy International</strong>, we preserve time-honored artisanal techniques dating back centuries in the Kashmir valley. Our design atelier seamlessly bridges royal heritage needlework with breezy, modern silhouettes suited for luxury celebrations, bridal trousseaus, and elevated everyday sophistication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8]/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#070E1E] text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Feather className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">
                  Pure Combed Cotton Kurtis &amp; Tunics
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Tailored with ultra-breathable, high-thread-count combed cotton. Adorned with delicate Aari needlepoint borders, versatile side slits, and hand-finished neckline plackets designed for all-season comfort.
                </p>
                <Link href="/shop?category=Tops & Kurtis" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#AA7E18] hover:underline uppercase tracking-wider">
                  Shop Kurtis &amp; Tunics →
                </Link>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8]/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#070E1E] text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">
                  Handcrafted Designer Kaftans
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Effortless fluid drapes featuring adjustable internal drawstrings, handcrafted metallic tassels, and artisanal paisley motifs. Ideal for resort getaways, festive soirees, and evening gatherings.
                </p>
                <Link href="/shop?category=Kaftaans" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#AA7E18] hover:underline uppercase tracking-wider">
                  Explore Kaftan Line →
                </Link>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8]/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#070E1E] text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">
                  Mulberry Silk Jackets &amp; Pashmina
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Statement tailored outerwear lined in modal satin, accented with intricate Kashmiri Tilla zari work, alongside authentic hand-spun Changthangi pashmina shawls passed through generations.
                </p>
                <Link href="/shop?category=Silk jackets" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#AA7E18] hover:underline uppercase tracking-wider">
                  Discover Silk Outerwear →
                </Link>
              </div>
            </div>

            {/* Ethical Sourcing Banner */}
            <div className="p-6 rounded-2xl bg-[#070E1E] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif-luxury font-bold text-base text-[#F7E7B6]">
                  Direct Artisan Patronage &amp; Zero Synthetic Shortcuts
                </h4>
                <p className="text-xs text-stone-300 max-w-xl font-light">
                  Every garment purchased directly sustains over 80 generational weaver families across Srinagar and Anantnag with fair-trade livelihood security.
                </p>
              </div>
              <Link
                href="/our-story"
                className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all shrink-0"
              >
                Read Our Story
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 11. Frequently Asked Questions (Interactive Accordion & FAQ Schema) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-down" className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#AA7E18] border border-[#E5D9C8] text-[10px] font-bold uppercase tracking-widest shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3.5xl font-bold text-[#070E1E]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-light">
            Everything you need to know about our handcrafted fabrics, sizing, royal unboxing packaging, and express shipping.
          </p>
        </ScrollReveal>

        <SEOStructuredData type="FAQPage" data={HOME_FAQS} />

        <div className="space-y-3">
          {HOME_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 60}
                duration={500}
              >
                <div className="rounded-2xl bg-white border border-[#E5D9C8] overflow-hidden shadow-xs transition-all">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif-luxury font-bold text-sm sm:text-base text-[#070E1E] hover:text-[#AA7E18] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed font-light border-t border-stone-100 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="text-center pt-8">
          <p className="text-xs text-stone-500">
            Have a custom inquiry or special size requirement?{' '}
            <a
              href="https://wa.me/919622480276"
              target="_blank"
              rel="noreferrer"
              className="text-[#AA7E18] font-bold hover:underline"
            >
              Chat directly with our Atelier Concierge on WhatsApp (+91 96224 80276)
            </a>
          </p>
        </div>
      </section>

      {/* Floating WhatsApp Concierge Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/919622480276?text=Salam%20Al%20Hayy%20Atelier,%20I%20need%20assistance."
          target="_blank"
          rel="noreferrer"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#070E1E] text-white border border-[#D4AF37]/80 shadow-2xl hover:bg-[#102142] hover:scale-110 flex items-center justify-center transition-all group cursor-pointer"
          aria-label="Direct WhatsApp Concierge"
          title="WhatsApp Concierge"
        >
          <WhatsAppIcon className="w-6 h-6 text-[#25D366] group-hover:scale-110 transition-transform" />
        </a>
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#070E1E]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setLightboxItem(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute -top-12 right-0 sm:-right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-[#D4AF37]/50 transition-all cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Image Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 bg-[#0B162C] max-h-[75vh] aspect-[3/4] sm:aspect-auto sm:max-w-xl sm:h-[75vh]">
              <img
                src={lightboxItem.src}
                alt={lightboxItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Photo Info Bar */}
            <div className="mt-4 px-6 py-2.5 bg-[#0B162C]/90 rounded-2xl border border-[#D4AF37]/40 backdrop-blur-md text-center flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <span className="text-[10px] font-mono text-[#F7E7B6] uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/30">
                {lightboxItem.tag}
              </span>
              <h3 className="font-serif-luxury text-sm font-bold text-white">
                {lightboxItem.title}
              </h3>
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
