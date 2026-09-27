'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, ChevronLeft, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const HERO_SLIDES = [
  {
    tag: 'Haute Couture • Summer 2026',
    title: 'The Contemporary',
    titleItalic: 'Kurti Atelier',
    subtitle: 'Hand-tailored from pure combed cotton with authentic Kashmiri needlecraft. Minimalist luxury crafted for modern silhouettes.',
    ctaPrimary: 'Explore Kurtis & Tops',
    ctaPrimaryLink: '/shop?category=Tops+%26+Kurtis',
    ctaSecondary: 'View All Catalog',
    ctaSecondaryLink: '/shop',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=2000&auto=format&fit=crop',
    objectPosition: 'object-[center_top]',
    artisanNote: '72h Hand Needlework • 100% Combed Cotton'
  },
  {
    tag: 'Resort & Evening Silhouettes',
    title: 'Flowing Kaftans &',
    titleItalic: 'Tailored Co-Ords',
    subtitle: 'Breezy silhouettes infused with saffron and botanical dyes. Effortlessly chic ensembles designed for festive poise.',
    ctaPrimary: 'Discover Kaftans',
    ctaPrimaryLink: '/shop?category=Kaftaans',
    ctaSecondary: 'Shop Co-Ord Sets',
    ctaSecondaryLink: '/shop?category=Co-ord+sets',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=85&w=2000&auto=format&fit=crop',
    objectPosition: 'object-[center_20%]',
    artisanNote: 'Pure Saffron Dye • Generational Handcraft'
  },
  {
    tag: 'Signature Heirloom',
    title: 'Mulberry Silk &',
    titleItalic: 'Changthangi Pashmina',
    subtitle: 'Century-old wooden loom weaving meets modern couture. Featherlight warmth and royal statement outerwear.',
    ctaPrimary: 'Explore Silk & Shawls',
    ctaPrimaryLink: '/shop?category=Silk+jackets',
    ctaSecondary: 'Read Our Story',
    ctaSecondaryLink: '/our-story',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=85&w=2000&auto=format&fit=crop',
    objectPosition: 'object-[center_15%]',
    artisanNote: 'Passes Ring Test • 100% Changthangi Goat'
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
    <div className="relative w-full bg-stone-950 text-white overflow-hidden">
      {/* Full-Width Cinematic Hero Canvas */}
      <div 
        className="relative w-full h-[580px] sm:h-[660px] lg:h-[740px] flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full-Width Background Slides with Ken Burns transition */}
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={s.tag}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={`${s.title} ${s.titleItalic}`}
              className={`w-full h-full object-cover ${s.objectPosition} transition-transform duration-[9000ms] ease-out ${
                idx === currentSlide ? 'scale-105' : 'scale-100'
              }`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            {/* Multi-layered cinematic gradient overlays for pristine readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20 sm:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />
          </div>
        ))}

        {/* Editorial Text Container over Full-Width Background */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-stone-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]">
                {slide.tag}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-3.5xl sm:text-5xl lg:text-6.5xl font-bold tracking-tight text-white leading-[1.1]">
              {slide.title}{' '}
              <span className="font-normal italic font-serif text-amber-200 block sm:inline">
                {slide.titleItalic}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm lg:text-base text-stone-200/90 leading-relaxed font-light max-w-xl">
              {slide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href={slide.ctaPrimaryLink}
                className="px-8 py-4 rounded-full bg-white hover:bg-amber-100 text-stone-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all transform active:scale-95"
              >
                <span>{slide.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={slide.ctaSecondaryLink}
                className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>{slide.ctaSecondary}</span>
              </Link>
            </div>

            {/* Floating Artisan Note Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-950/60 backdrop-blur-md border border-white/10 text-[11px] text-stone-300">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>{slide.artisanNote}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls (Desktop Arrows + Slide Counters) */}
        <div className="absolute bottom-8 right-4 sm:right-10 z-20 flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Indicator Bars with Numbers */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white/90">
              0{currentSlide + 1}
            </span>
            <div className="flex gap-1.5">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-8 bg-amber-300' : 'w-2 bg-white/30 hover:bg-white/60'
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
      <div className="border-t border-stone-800 bg-stone-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] sm:text-xs text-stone-300">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Truck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Free Express Shipping Across India</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>100% Authentic Hand Needlecraft</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 justify-start">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Encrypted Multi-Gateway Checkout</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 justify-start">
              <RefreshCw className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Complimentary Size Alterations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
