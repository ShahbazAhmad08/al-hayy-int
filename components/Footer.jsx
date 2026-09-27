'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '@/lib/api';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Auto-hide Footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#111111] text-[#F5F5F3] pt-16 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top 4 Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800 text-xs">
          <div className="space-y-1">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Handcrafted Purity</h4>
            <p className="text-stone-400 text-[11px]">Meticulously tailored from fine combed cotton & pure silks</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Express Pan-India Delivery</h4>
            <p className="text-stone-400 text-[11px]">Complimentary doorstep courier on qualifying orders</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Artisanal Heritage</h4>
            <p className="text-stone-400 text-[11px]">Honoring generations of master needlework couture</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Secure Checkout</h4>
            <p className="text-stone-400 text-[11px]">Encrypted UPI, Cards, NetBanking & Cash on Delivery</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-44">
                <Image src="/logo.avif" alt="Al Hayy" fill className="object-contain object-left invert" />
              </div>
            </Link>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Al Hayy is a luxury ready-to-wear and couture atelier celebrating fine textile artistry, handcrafted embroidery, and effortless silhouettes designed for modern elegance.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-stone-400">
              <a href="https://www.instagram.com/alhayykashmir" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
              <span>•</span>
              <a href="https://www.facebook.com/alhayykashmir" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Facebook
              </a>
              <span>•</span>
              <a href="https://www.tiktok.com/@alhayykashmir" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                TikTok
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="hover:text-white transition-colors font-medium text-stone-200">
                  Shop All Styles
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="hover:text-white transition-colors">
                  Our Story & Craft
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Concierge
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Newsletter
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Receive private previews of new seasonal collections and bespoke drops.
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-emerald-400">
                ✓ Thank you for subscribing.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full py-2.5 px-3.5 pr-10 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-stone-400"
                  />
                  <button type="submit" className="absolute right-1.5 top-1.5 p-1.5 text-stone-400 hover:text-white">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <div>
            © {new Date().getFullYear()} <strong className="text-stone-300">Al Hayy International</strong>. All Rights Reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>UPI</span>
            <span>•</span>
            <span>Razorpay</span>
            <span>•</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>COD Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
