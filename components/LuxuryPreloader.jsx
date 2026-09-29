'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function LuxuryPreloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Smooth progress timer over ~1.8s
    const startTime = Date.now();
    const duration = 1800; // 1.8s

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          setLoading(false);
        }, 500); // 0.5s fade-out curtain exit
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#070E1E] text-white transition-all duration-700 select-none overflow-hidden ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Royal Navy & Gilded Gold Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#D4AF37]/20 via-[#0B162C]/60 to-[#F7E7B6]/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0B162C]/80 rounded-full blur-3xl pointer-events-none" />

      {/* Centerpiece Luxury Brand Card */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full space-y-6">
        {/* Animated Brand Emblem & Official Golden Logo */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Pulsing Outer Gold Rings */}
          <div className="absolute w-36 h-36 rounded-full border border-[#D4AF37]/30 animate-ping opacity-40 pointer-events-none" />
          <div className="absolute w-32 h-32 rounded-full border border-[#D4AF37]/40 animate-spin pointer-events-none" style={{ animationDuration: '12s' }} />

          {/* Official Al Hayy Logo in Pure Gilded Gold */}
          <div className="relative z-10 p-5 rounded-3xl bg-gradient-to-b from-[#0B162C]/90 to-[#070E1E] border border-[#D4AF37]/60 shadow-[0_0_35px_rgba(212,175,55,0.25)] flex flex-col items-center justify-center">
            <div className="relative w-48 h-16 sm:w-56 sm:h-20">
              <Image
                src="/logo.avif"
                alt="Al Hayy International"
                fill
                className="object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(80%) sepia(45%) saturate(750%) hue-rotate(5deg) contrast(110%) drop-shadow(0 0 10px rgba(212,175,55,0.6))'
                }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Brand Subtitle & Tagline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0B162C] border border-[#D4AF37]/40 text-[#F7E7B6] text-[10px] font-bold uppercase tracking-[0.25em]">
            <Sparkles className="w-3 h-3 text-[#D4AF37] animate-spin" style={{ animationDuration: '4s' }} />
            <span>Royal Haute Couture &amp; Packaging</span>
          </div>

          <p className="text-xs text-stone-300 font-light tracking-widest uppercase">
            Srinagar Atelier &bull; Handcrafted Kashmiri Opulence
          </p>
        </div>

        {/* Luxury Gold Thread Progress Bar */}
        <div className="w-full max-w-[240px] space-y-2 pt-2">
          <div className="h-[2px] w-full bg-[#0B162C] rounded-full overflow-hidden relative border border-[#D4AF37]/20">
            <div
              className="h-full bg-gradient-to-r from-[#AA7E18] via-[#F7E7B6] to-[#D4AF37] transition-all duration-75 rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-stone-400">
            <span>UNBOXING ATELIER</span>
            <span className="text-[#D4AF37] font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
