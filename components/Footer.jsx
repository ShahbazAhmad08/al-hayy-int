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
    <footer className="bg-[#070E1E] text-[#FAF7F2] pt-16 pb-10 border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top 4 Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#D4AF37]/20 text-xs">
          <div className="space-y-1">
            <h4 className="font-semibold text-[#F7E7B6] uppercase tracking-wider text-[11px]">Handcrafted Purity</h4>
            <p className="text-stone-400 text-[11px]">Meticulously tailored from fine combed cotton & pure silks</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-[#F7E7B6] uppercase tracking-wider text-[11px]">Signature Gift Box</h4>
            <p className="text-stone-400 text-[11px]">Arrives in our royal midnight navy rigid box with silk ribbon</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-[#F7E7B6] uppercase tracking-wider text-[11px]">Artisanal Heritage</h4>
            <p className="text-stone-400 text-[11px]">Honoring generations of master Kashmiri needlework couture</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-[#F7E7B6] uppercase tracking-wider text-[11px]">Direct Concierge</h4>
            <p className="text-stone-400 text-[11px]">Assistance via WhatsApp & Phone at +91 96224 8076</p>
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
            <p className="text-xs text-stone-300 max-w-sm leading-relaxed">
              Al Hayy is a luxury Kashmiri couture atelier celebrating fine textile artistry, handcrafted needle embroidery, and timeless royal silhouettes.
            </p>
            <div className="pt-2 flex flex-col space-y-2 text-xs text-[#F7E7B6]">
              <a 
                href="https://wa.me/91962248076" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:underline flex items-center gap-1.5"
              >
                <span>WhatsApp / Phone:</span>
                <strong className="font-mono text-[#D4AF37]">+91 96224 8076</strong>
              </a>
              <span className="text-stone-400 text-[11px]">Srinagar, Jammu & Kashmir • Worldwide Insured Dispatch</span>
            </div>
            <div className="pt-2 flex items-center space-x-3 text-xs text-stone-400">
              <a href="https://www.instagram.com/alhayykashmir" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors">
                Instagram
              </a>
              <span>•</span>
              <a href="https://www.facebook.com/alhayykashmir" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors">
                Facebook
              </a>
              <span>•</span>
              <a href="https://wa.me/91962248076" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors">
                WhatsApp
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F7E7B6] mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} className="hover:text-[#D4AF37] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="hover:text-[#D4AF37] transition-colors font-medium text-[#F7E7B6]">
                  Shop All Styles
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F7E7B6] mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link href="/lookbook" className="hover:text-[#D4AF37] transition-colors">
                  Atelier Lookbook &amp; Archive
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#D4AF37] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="hover:text-[#D4AF37] transition-colors">
                  Our Story &amp; Packaging
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                  Contact &amp; Concierge (+91 96224 8076)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#D4AF37] transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F7E7B6]">
              Atelier Newsletter
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Receive private previews of new seasonal collections, bespoke bridal couture, and royal drops.
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded-xl bg-[#102142] border border-[#D4AF37]/40 text-xs text-[#F7E7B6]">
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
                    className="w-full py-2.5 px-3.5 pr-10 rounded-xl bg-[#102142]/80 border border-[#D4AF37]/30 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button type="submit" className="absolute right-1.5 top-1.5 p-1.5 text-[#D4AF37] hover:text-white">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <div>
            © {new Date().getFullYear()} <strong className="text-[#F7E7B6]">Al Hayy International</strong>. All Rights Reserved.
          </div>
          <div className="flex items-center gap-3 text-stone-400">
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
