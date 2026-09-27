'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: 'The Contemporary Kurti Atelier',
    subtitle: 'Hand-tailored from premium combed cotton with delicate thread embroidery. Designed for refined modern elegance.',
    tag: 'Spring / Summer 2026',
    ctaText: 'Shop Kurtis & Tops',
    ctaLink: '/shop?category=Tops+%26+Kurtis',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
  },
  {
    title: 'Flowing Kaftans & Tailored Co-Ords',
    subtitle: 'Breezy luxury silhouettes crafted for effortless resort, evening, and everyday sophisticated styling.',
    tag: 'New Season Drop',
    ctaText: 'Discover Kaftans',
    ctaLink: '/shop?category=Kaftaans',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1600&auto=format&fit=crop',
  },
  {
    title: 'Mulberry Silk Jackets & Cashmere Stoles',
    subtitle: 'Heirloom craftsmanship meets modern minimalist couture. Hand-detailed statement outerwear.',
    tag: 'Signature Atelier Collection',
    ctaText: 'Explore Silk Outerwear',
    ctaLink: '/shop?category=Silk+jackets',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop',
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative w-full min-h-[520px] lg:min-h-[620px] bg-stone-100 overflow-hidden flex items-center">
      {/* Background Editorial Image */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 scale-102' : 'opacity-0 scale-100 pointer-events-none'
          }`}
          style={{ transition: 'opacity 1s ease-in-out, transform 8s ease' }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle Clean Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Editorial Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10 w-full">
        <div className="max-w-xl space-y-5 text-white">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-stone-200">
            {slide.tag}
          </span>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            {slide.title}
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light max-w-lg">
            {slide.subtitle}
          </p>

          <div className="pt-2">
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-stone-950 font-bold text-xs uppercase tracking-widest hover:bg-stone-100 transition-all transform active:scale-95 shadow-lg"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
