'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LuxuryPreloader() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show ONCE per browser session
    if (typeof window !== 'undefined') {
      const alreadySeen = sessionStorage.getItem('alhayy_preloader_seen');
      if (alreadySeen) {
        return;
      }
      // First time loading website in this session
      setLoading(true);
      sessionStorage.setItem('alhayy_preloader_seen', 'true');
    }

    const startTime = Date.now();
    const duration = 1400; // 1.4s smooth progress

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          setLoading(false);
        }, 500); // smooth fade-out curtain exit
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  // Circle parameters for SVG progress bar
  const size = 140;
  const strokeWidth = 3.5;
  const center = size / 2;
  const radius = center - strokeWidth - 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#070E1E] text-white transition-all duration-500 select-none overflow-hidden ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Ambient Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Center Logo with Circular Progress Bar Ring (NO text) */}
      <div className="relative z-10 flex items-center justify-center">
        {/* SVG Circular Progress Bar */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
        >
          <defs>
            <linearGradient id="goldProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#AA7E18" />
              <stop offset="50%" stopColor="#F7E7B6" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          
          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(212, 175, 55, 0.15)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Active Progress Bar Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#goldProgressGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-75 ease-out"
          />
        </svg>

        {/* Brand Logo in the Center */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="relative w-20 h-10 sm:w-24 sm:h-12 flex items-center justify-center">
            <Image
              src="/logo.avif"
              alt="Al Hayy"
              fill
              className="object-contain"
              style={{
                filter: 'brightness(0) saturate(100%) invert(80%) sepia(45%) saturate(750%) hue-rotate(5deg) contrast(110%) drop-shadow(0 0 8px rgba(212,175,55,0.7))'
              }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
