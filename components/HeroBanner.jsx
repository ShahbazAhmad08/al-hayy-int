'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, ChevronLeft, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const HERO_SLIDES = [
  {
    tag: 'Signature Unboxing • Royal Kashmir Haute Couture',
    title: 'Unbox Royal',
    titleItalic: 'Kashmiri Opulence',
    subtitle: 'Each Al Hayy master creation arrives nested inside our bespoke Midnight Navy rigid box, hand-tied with pure silk ribbons, gold-embossed Arabic seals, and certificates of valley authenticity.',
    ctaPrimary: 'Shop Signature Collection',
    ctaPrimaryLink: '/shop',
    ctaSecondary: 'The Packaging Story',
    ctaSecondaryLink: '/our-story',
    image: '/images/hero-packaging.jpg',
    objectPosition: 'object-[center_center]',
    artisanNote: 'Bespoke Rigid Navy Box • Gold-Foil Embossed • Pure Silk Ribbon'
  },
  {
    tag: 'Atelier Needlework • Spring-Summer 2026',
    title: 'The Contemporary',
    titleItalic: 'Kurti & Suit Atelier',
    subtitle: 'Hand-tailored from pure combed cotton and raw silks with authentic Kashmiri needlecraft. Minimalist luxury crafted for modern silhouettes.',
    ctaPrimary: 'Explore Kurtis & Sets',
    ctaPrimaryLink: '/shop?category=Tops+%26+Kurtis',
    ctaSecondary: 'View All Catalog',
    ctaSecondaryLink: '/shop',
    image: '/images/gallery-4.jpg',
    objectPosition: 'object-[center_top]',
    artisanNote: '72h Hand Needlework • 100% Combed Cotton & Resham'
  },
  {
    tag: 'Resort & Evening Silhouettes',
    title: 'Flowing Kaftans &',
    titleItalic: 'Tailored Co-Ords',
    subtitle: 'Breezy silhouettes infused with saffron and botanical dyes. Effortlessly chic ensembles designed for festive celebrations and serene poise.',
    ctaPrimary: 'Discover Kaftans',
    ctaPrimaryLink: '/shop?category=Kaftaans',
    ctaSecondary: 'Shop Co-Ord Sets',
    ctaSecondaryLink: '/shop?category=co-ord+sets',
    image: '/images/gallery-19.jpg',
    objectPosition: 'object-[center_25%]',
    artisanNote: 'Pure Saffron Dye • Generational Handcraft'
  },
  {
    tag: 'Signature Heirloom',
    title: 'Mulberry Silk &',
    titleItalic: 'Changthangi Pashmina',
    subtitle: 'Century-old wooden loom weaving meets modern couture. Featherlight warmth, passes the ring test, and royal statement outerwear.',
    ctaPrimary: 'Explore Silk & Shawls',
    ctaPrimaryLink: '/shop?category=Pashmina+%26+Shawls',
    ctaSecondary: 'Read Our Story',
    ctaSecondaryLink: '/our-story',
    image: '/images/gallery-31.jpg',
    objectPosition: 'object-[center_20%]',
    artisanNote: 'Passes Ring Test • 100% Changthangi Cashmere'
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Auto-advance slides every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative w-full bg-[#070E1E] text-white overflow-hidden border-b border-[#D4AF37]/25">
      {/* Full-Width Hero Canvas with max-h 100vh on large screens */}
      <div 
        className="relative w-full min-h-[580px] sm:min-h-[660px] lg:h-[calc(100vh-84px)] lg:max-h-[880px] flex items-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ambient Blurred Background for depth on all viewports */}
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={s.tag}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt=""
              className="w-full h-full object-cover blur-2xl scale-125 opacity-25"
              aria-hidden="true"
            />
            {/* Mobile Background Image (Gentle bottom scrim so image remains crystal clear and visible) */}
            <div className="lg:hidden absolute inset-0">
              <img
                src={s.image}
                alt=""
                className={`w-full h-full object-cover ${s.objectPosition}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E] via-[#070E1E]/40 to-transparent" />
            </div>

            {/* Desktop Ambient Vignette */}
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#070E1E] via-[#070E1E]/95 to-[#0B162C]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_60%)]" />
          </div>
        ))}

        {/* Dual-Column Main Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:py-16 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Left Column: Editorial Narrative & CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-6">
              {/* Tag Badge - hidden on small mobile to maximize image visibility */}
              <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B162C]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[#F7E7B6] shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]">
                  {slide.tag}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif-luxury text-2xl sm:text-4.5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                {slide.title}{' '}
                <span className="font-normal italic font-serif text-[#F7E7B6] block sm:inline">
                  {slide.titleItalic}
                </span>
              </h1>

              {/* Subtitle - Visible on all screens with compact luxury 2-line clamp on mobile */}
              <p className="text-[11px] sm:text-sm lg:text-base text-[#FAF7F2]/90 leading-snug sm:leading-relaxed font-light max-w-xl line-clamp-2 sm:line-clamp-none drop-shadow-sm pt-0.5">
                {slide.subtitle}
              </p>

              {/* Action Buttons (Lower positioned with comfortable spacing) */}
              <div className="flex flex-row items-center gap-2.5 sm:gap-4 pt-3.5 sm:pt-4 w-full">
                <Link
                  href={slide.ctaPrimaryLink}
                  className="flex-1 w-1/2 py-2.5 sm:py-4 px-2.5 sm:px-8 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest flex items-center justify-center gap-1.5 shadow-xl hover:shadow-2xl transition-all transform active:scale-95 animate-gold-pulse cursor-pointer truncate text-center"
                >
                  <span className="truncate">{slide.ctaPrimary}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
                </Link>

                <Link
                  href={slide.ctaSecondaryLink}
                  className="flex-1 w-1/2 py-2.5 sm:py-4 px-2.5 sm:px-7 rounded-full bg-black/60 hover:bg-black/80 sm:bg-white/10 sm:hover:bg-white/20 backdrop-blur-md border border-[#D4AF37]/60 sm:border-[#D4AF37]/40 text-white font-semibold text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer truncate text-center"
                >
                  <span className="truncate">{slide.ctaSecondary}</span>
                </Link>
              </div>

              {/* Floating Artisan Note Pill - hidden on mobile */}
              <div className="hidden sm:block pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B162C]/90 backdrop-blur-md border border-[#D4AF37]/30 text-[11px] text-[#F7E7B6]">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shrink-0" />
                  <span>{slide.artisanNote}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Uncropped High-Res 3:4 Luxury Portrait Showcase (Desktop Only, 5 cols) */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
              <div className="relative w-full max-w-[400px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 bg-[#0B162C] group">
                <img
                  src={slide.image}
                  alt={`${slide.title} ${slide.titleItalic} - Al Hayy International Luxury Handcrafted Atelier`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/40 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>

              {/* Decorative Gold Glow around the showcase */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#D4AF37]/20 via-transparent to-[#F7E7B6]/15 rounded-3xl blur-xl -z-10 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Navigation Controls (Desktop Arrows + Slide Counters) */}
        <div className="absolute bottom-6 right-4 sm:right-10 z-20 flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-black/50 hover:bg-[#D4AF37] hover:text-[#070E1E] backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-black/50 hover:bg-[#D4AF37] hover:text-[#070E1E] backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Indicator Bars with Numbers */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#F7E7B6]">
              0{currentSlide + 1}
            </span>
            <div className="flex gap-1.5">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentSlide ? 'w-8 bg-[#D4AF37]' : 'w-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-white/40">
              0{HERO_SLIDES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Highlights Full-Width Micro-Bar */}
      <div className="border-t border-[#D4AF37]/20 bg-[#0B162C] text-[#F7E7B6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 justify-center sm:justify-start text-stone-200">
              <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Free Express Shipping Across India</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start text-stone-200">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>100% Authentic Hand Needlecraft</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 justify-start text-stone-200">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Signature Midnight Navy Packaging</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 justify-start text-stone-200">
              <RefreshCw className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Direct Atelier Concierge Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
