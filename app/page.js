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
  RotateCcw,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Heart
} from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import ScrollReveal from '@/components/ScrollReveal';
import { getProducts, CATEGORIES, submitContact } from '@/lib/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Home Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Atelier Inquiry',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

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
        subject: 'Bespoke Atelier Inquiry',
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

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. Full-Width Cinematic European Luxury Hero Banner */}
      <HeroBanner />

      {/* 2. Curated Categories / Silhouettes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-down" className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Curated Collections
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Shop by Silhouette
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-stone-600 flex items-center gap-1">
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.slice(0, 4).map((cat, idx) => {
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
                  className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-stone-100 border border-stone-200/80 shadow-xs hover:shadow-2xl transition-all duration-500 sheen-effect hover:-translate-y-2 block h-full"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                      {liveCount > 0 ? `${liveCount} Creations` : 'Atelier Line'}
                    </span>
                    <h3 className="font-serif-luxury text-base sm:text-lg font-bold tracking-wide mt-0.5">
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
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Signature Line
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Creations
            </h2>
          </div>

          {/* Category Filter Tabs */}
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
        </ScrollReveal>

        {/* 6 Cards Grid (3 in a row on Desktop, 2 on Mobile) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-3xl bg-stone-100 aspect-[3/4] animate-pulse" />
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-stone-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md active:scale-95"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>
      </section>

      {/* 4. About & The 72-Hour Artisanal Craft Story Spotlight */}
      <section className="bg-stone-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Visual Box (Slides in smoothly from left) */}
            <ScrollReveal animation="fade-right" duration={800}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-stone-900 border border-stone-800">
                <img
                  src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop"
                  alt="Handloom weaving in Kashmir"
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-stone-950/80 backdrop-blur-md rounded-2xl border border-white/10 text-xs flex items-center justify-between">
                  <span className="text-stone-300 font-semibold text-[11px]">Srinagar Loom Atelier Custodians</span>
                  <span className="text-amber-300 text-[10px] font-bold uppercase">15th Century Lineage</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Narrative (Slides in smoothly from right) */}
            <ScrollReveal animation="fade-left" duration={800} delay={150} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/15 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Our Heritage Story</span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold leading-tight text-white">
                Handcrafted With 72 Hours Of Devotion
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Founded on the banks of Dal Lake in Srinagar, <strong>Al Hayy Kashmir</strong> is dedicated to preserving centuries of Kashmiri textile artistry. Every cotton kurti, silk jacket, and Pashmina stole is shaped entirely by hand, honoring generational needlework traditions while offering effortless European silhouettes.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
                  <span className="text-base font-bold text-white font-serif-luxury">Natural Fibers</span>
                  <p className="text-[11px] text-stone-400">Pure combed cotton, mulberry silk & Changthangi pashmina</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1">
                  <span className="text-base font-bold text-white font-serif-luxury">Fair Trade</span>
                  <p className="text-[11px] text-stone-400">Directly sustaining 80+ artisan families in Srinagar valley</p>
                </div>
              </div>

              <div>
                <Link
                  href="/our-story"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 hover:text-white transition-colors"
                >
                  <span>Read The Full Heritage Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. Luxury VIP / Bespoke Bridal CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-14 relative overflow-hidden shadow-xl border border-stone-800">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">
                Bespoke Concierge
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Bespoke Bridal Ensembles & Custom Tailoring
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Looking for custom bridal sizes, tailored color palettes, or bulk luxury festive gifting? Connect directly with our Srinagar master artisan team for personalized consultations.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                <a
                  href="https://wa.me/919876543210?text=Hello%20Al%20Hayy%20Kashmir,%20I%20would%20like%20a%20bespoke%20bridal%20consultation."
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Atelier Concierge</span>
                </a>

                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Submit Inquiry Online</span>
                </Link>
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-900/20 to-transparent pointer-events-none" />
          </div>
        </ScrollReveal>
      </section>

      {/* 6. Direct Contact Form on Home Page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Info */}
          <ScrollReveal animation="fade-right" className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Direct Contact
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Connect With Our Srinagar Atelier
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2 font-light">
                Have a question regarding sizing, custom bridal orders, or shipping timelines? Reach out and our concierge will assist you promptly.
              </p>
            </div>

            <div className="space-y-4 text-xs text-stone-700 p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-stone-900 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-stone-950 font-semibold">Flagship Atelier & Loom:</strong>
                  <span className="text-stone-500">Boulevard Road, Near Dal Lake Gate 2, Srinagar, J&K 190001</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-stone-900 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-stone-950 font-semibold">Concierge Email:</strong>
                  <span className="text-stone-500">contact@alhayyinternational.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-stone-900 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-stone-950 font-semibold">Customer Care:</strong>
                  <span className="text-stone-500">+91 98765 43210 (Mon – Sat: 10 AM – 7:30 PM IST)</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Contact Form */}
          <ScrollReveal animation="fade-left" delay={150} className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
              <h3 className="font-serif-luxury text-xl font-bold text-stone-950">
                Send an Atelier Inquiry
              </h3>

              {contactSuccess ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in zoom-in-95">
                  <CheckCircle2 className="w-10 h-10 text-emerald-800 mx-auto" />
                  <h4 className="font-serif-luxury text-lg font-bold text-stone-900">Inquiry Received</h4>
                  <p className="text-xs text-stone-600 max-w-xs mx-auto">
                    Shukriya! Our master atelier representative will get back to you within 24 hours.
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
                        className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
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
                      className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Your Message / Inquiry *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Tell us about the bespoke bridal styling, custom size, or catalog query you have..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3.5 px-6 rounded-full bg-stone-950 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-md disabled:opacity-50"
                  >
                    {contactSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
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

      {/* 7. Client Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-down" className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
            Client Accolades
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
            What Our Patrons Say
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Aisha Mir',
              city: 'New Delhi',
              review: 'The embroidery on the Red Cotton Kurti is absolutely exquisite. You can immediately feel the weight and purity of authentic Kashmiri needlework.',
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
            <ScrollReveal
              key={idx}
              animation="fade-up"
              delay={idx * 150}
              duration={700}
              className="h-full"
            >
              <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4 h-full hover:shadow-lg transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
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
                    Verified Patron
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 8. SEO Rich-Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ScrollReveal animation="fade-up" className="p-8 sm:p-10 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Artisan Knowledge & Heritage
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-950 mt-1">
              Authentic Kashmiri Handcrafted Fashion & Heritage Couture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600 leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">Master Aari Needlecraft</h3>
              <p>
                Our kurtis and kaftans feature genuine Aari threadwork, guided by master craftsmen with specialized hooked needles (crewels) across fine natural cottons and silks.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">Authentic Changthangi Pashmina</h3>
              <p>
                Woven from the underfleece of high-altitude Himalayan Changthangi goats, our pashmina stoles pass the classic ring test and offer featherlight warmth.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">Pan-India Express Delivery</h3>
              <p>
                Every order is carefully packaged with certificate tags and dispatched with 256-bit encrypted checkout via Razorpay, Stripe, and UPI Direct across India.
              </p>
            </div>
          </div>
        </ScrollReveal>
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
