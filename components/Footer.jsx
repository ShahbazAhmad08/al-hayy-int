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
  Sparkles,
  Globe2,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CATEGORIES, getCategories, getLiveCategoriesArchive } from '@/lib/api';
import { COUNTRIES_DATA } from '@/lib/internationalCountriesData';
import { CITIES_DATA } from '@/lib/citiesData';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [categories, setCategories] = useState(CATEGORIES);
  const [showAllCities, setShowAllCities] = useState(false);

  React.useEffect(() => {
    const liveCats = getLiveCategoriesArchive();
    if (liveCats && liveCats.length > 0) {
      setCategories(liveCats);
    }
    getCategories().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    }).catch(() => {});

    const handleCatsUpdated = (e) => {
      if (e?.detail) setCategories(e.detail);
      else setCategories(getLiveCategoriesArchive());
    };
    window.addEventListener('alhayy_categories_updated', handleCatsUpdated);
    return () => window.removeEventListener('alhayy_categories_updated', handleCatsUpdated);
  }, []);

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

  const visibleCities = showAllCities ? CITIES_DATA : CITIES_DATA.slice(0, 24);

  return (
    <footer className="bg-[#070E1E] text-[#FAF7F2] pt-16 pb-10 border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
            <p className="text-stone-400 text-[11px]">Assistance via WhatsApp & Phone at +91 96224 80276</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-44">
                <Image src="/logo.avif" alt="Al Hayy International - Luxury Handcrafted Kurtis, Kaftans & Co-ord Sets" fill className="object-contain object-left invert" />
              </div>
            </Link>
            <p className="text-xs text-stone-300 max-w-sm leading-relaxed">
              Al Hayy International is a luxury Kashmiri couture atelier celebrating fine textile artistry, handcrafted needle embroidery, cotton kaftans, and designer co-ord sets.
            </p>
            <div className="pt-2 flex flex-col space-y-2 text-xs text-[#F7E7B6]">
              <a 
                href="https://wa.me/919622480276" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:underline flex items-center gap-1.5"
              >
                <span>WhatsApp / Direct Call:</span>
                <strong className="font-mono text-[#D4AF37]">+91 96224 80276</strong>
              </a>
              <span className="text-stone-400 text-[11px]">Srinagar, Jammu and Kashmir - 190002 • Worldwide Insured Dispatch</span>
            </div>
            <div className="pt-2 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-stone-400">
              <a href="https://www.instagram.com/Alhayyofficial/" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors">
                Instagram (@Alhayyofficial)
              </a>
              <span>•</span>
              <a href="https://www.linkedin.com/company/alhayykashmir/" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors">
                LinkedIn
              </a>
              <span>•</span>
              <a href="https://wa.me/919622480276" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors">
                WhatsApp B2B
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F7E7B6] mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              {categories.map((cat) => (
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

          {/* Client Care & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F7E7B6] mb-4">
              Policies &amp; Care
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link href="/market-areas" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 font-semibold text-[#F7E7B6]">
                  <Globe2 className="w-3 h-3 text-[#D4AF37]" />
                  <span>Market Areas &amp; Supply</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  <Truck className="w-3 h-3 text-[#D4AF37]" />
                  <span>Shipping &amp; Delivery Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                  <span>Privacy &amp; Data Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  <RotateCcw className="w-3 h-3 text-[#D4AF37]" />
                  <span>Terms &amp; Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#D4AF37] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-[#D4AF37] transition-colors">
                  Atelier Lookbook Reels
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                  Contact &amp; Concierge
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
                  <button type="submit" className="absolute right-1.5 top-1.5 p-1.5 text-[#D4AF37] hover:text-white cursor-pointer">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* MARKET AREAS & GLOBAL SUPPLY DIRECTORY (CITIES & COUNTRIES) */}
        <div className="pt-8 border-t border-[#D4AF37]/20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#F7E7B6]">
                Market Areas &amp; Global Supply Network
              </h4>
            </div>
            <Link 
              href="/market-areas" 
              className="text-[11px] text-[#D4AF37] hover:text-[#F7E7B6] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View All 20+ Countries &amp; 60+ Cities Hubs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* International Countries - Highlight Dubai (Main Hub), USA & Europe */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#F7E7B6] tracking-wider font-bold">
              Primary Global Export Gateways (Dubai, USA &amp; Europe):
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-stone-300">
              {/* Featured Dubai Hub Badge */}
              <Link
                href="/export/uae"
                className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F7E7B6] font-bold hover:bg-[#D4AF37] hover:text-[#070E1E] transition-all flex items-center gap-1 shadow-xs"
              >
                <span>🇦🇪</span>
                <span>Dubai &amp; UAE (Main Global Hub)</span>
              </Link>
              {COUNTRIES_DATA.filter(c => c.slug !== 'uae').map((country) => (
                <Link
                  key={country.slug}
                  href={`/export/${country.slug}`}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                >
                  <span>{country.flag}</span>
                  <span>{country.shortName || country.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Domestic Cities - 100% Crawlable in DOM for Search Console, Kept Subtle for Buyers */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <details className="group" open={false}>
              <summary 
                className="list-none flex items-center justify-between cursor-pointer select-none py-1"
              >
                <span className="text-[10px] font-mono uppercase text-stone-500 hover:text-stone-300 tracking-wider">
                  Pan-India Wholesale &amp; Manufacturing Hubs ({CITIES_DATA.length} Cities)
                </span>
                <span className="text-[10px] text-stone-500 hover:text-[#D4AF37] underline">
                  View Indian Cities
                </span>
              </summary>
              
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-stone-400 mt-2.5">
                {(showAllCities ? CITIES_DATA : CITIES_DATA.slice(0, 24)).map((city) => (
                  <Link
                    key={city.slug}
                    href={`/wholesale/${city.slug}`}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    {city.name}
                  </Link>
                ))}
                {!showAllCities && (
                  <button
                    type="button"
                    onClick={() => setShowAllCities(true)}
                    className="text-[#D4AF37] hover:underline font-semibold text-[11px] cursor-pointer"
                  >
                    + View All {CITIES_DATA.length} Wholesale Hubs →
                  </button>
                )}
              </div>
            </details>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <div>
            © {new Date().getFullYear()} <strong className="text-[#F7E7B6]">Al Hayy International</strong>. All Rights Reserved.
          </div>

          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1 text-stone-300">
            <Link href="/market-areas" className="hover:text-[#D4AF37] transition-colors">Market Areas</Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-[#D4AF37] transition-colors">Shipping Policy</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Support</Link>
          </div>

          <div className="flex items-center gap-2 text-stone-400 text-[10px] font-mono">
            <span>Razorpay</span>
            <span>•</span>
            <span>UPI</span>
            <span>•</span>
            <span>Cards</span>
            <span>•</span>
            <span>Net Banking</span>
            <span>•</span>
            <span>International</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
