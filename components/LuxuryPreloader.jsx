'use client';

import React, { useState, useEffect } from 'react';
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
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#051813] text-white transition-all duration-700 select-none overflow-hidden ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Royal Gold & Emerald Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-600/20 via-emerald-600/15 to-amber-400/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centerpiece Luxury Brand Card */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full space-y-6">
        {/* Animated Brand Emblem */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing Outer Rings */}
          <div className="absolute w-28 h-28 rounded-full border border-amber-500/20 animate-ping opacity-40" />
          <div className="absolute w-24 h-24 rounded-full border border-amber-400/40 animate-spin" style={{ animationDuration: '10s' }} />

          {/* Core Insignia */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0c2e24] to-[#041610] border border-amber-400/50 shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 via-transparent to-white/10" />
            <span className="font-serif-luxury text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
              الحي
            </span>
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-[0.25em]">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Haute Couture Atelier</span>
          </div>

          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-[0.18em] uppercase bg-gradient-to-r from-amber-100 via-white to-amber-200 bg-clip-text text-transparent">
            Al Hayy International
          </h1>

          <p className="text-[11px] text-stone-300/80 font-light tracking-widest uppercase">
            Artisanal Devotion &bull; Luxury Handcrafted Elegance
          </p>
        </div>

        {/* Luxury Thread Progress Bar */}
        <div className="w-full max-w-[240px] space-y-2 pt-2">
          <div className="h-[2px] w-full bg-stone-800/80 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-500 transition-all duration-75 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-stone-400">
            <span>UNVEILING ATELIER</span>
            <span className="text-amber-300 font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
