'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  Package,
  Phone,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getProducts } from '@/lib/api';
import { WhatsAppIcon, InstagramIcon, LinkedInIcon, LinkedinIcon } from '@/components/BrandIcons';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const { user } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    async function loadSearchProducts() {
      try {
        const prods = await getProducts();
        setAllProducts(prods || []);
      } catch (err) {
        console.warn('Could not load products for search bar', err);
      }
    }
    loadSearchProducts();
  }, []);

  // Scroll listener for subtle glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live search query filter
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts.filter(
        item => (item.title && item.title.toLowerCase().includes(q)) || (item.category && item.category.toLowerCase().includes(q))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Hook-safe check: Return null AFTER all hooks are evaluated
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Lookbook', href: '/lookbook' },
    { name: 'About', href: '/our-story' },
    { name: 'Track Order', href: '/orders' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Luxury Announcement & Social Hotline Bar */}
      <div className="bg-[#050A15] border-b border-[#D4AF37]/20 text-[11px] text-stone-300 py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#F7E7B6] font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Authentic Kashmiri Master Artisans
            </span>
            <span className="text-stone-700">•</span>
            <span className="text-stone-400">Insured Worldwide Dispatch</span>
          </div>
          <div className="flex items-center gap-3.5 text-xs">
            <a
              href="https://www.instagram.com/Alhayyofficial/"
              target="_blank"
              rel="noreferrer"
              className="text-[#D4AF37] hover:text-[#F7E7B6] hover:scale-110 transition-all p-1"
              aria-label="Instagram @Alhayyofficial"
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/alhayykashmir/"
              target="_blank"
              rel="noreferrer"
              className="text-[#D4AF37] hover:text-[#F7E7B6] hover:scale-110 transition-all p-1"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/919622480276"
              target="_blank"
              rel="noreferrer"
              className="text-[#F7E7B6] hover:text-[#D4AF37] font-mono font-semibold transition-colors flex items-center gap-1.5 ml-1"
              aria-label="WhatsApp Atelier Helpline"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>+91 96224 80276</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sleek Royal Luxury Navigation */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#070E1E]/95 backdrop-blur-md shadow-2xl py-3 border-b border-[#D4AF37]/40'
            : 'bg-[#070E1E] py-4 border-b border-[#D4AF37]/25'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between relative">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden z-10">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-[#F7E7B6] hover:text-white transition-colors"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo - Centered on Mobile / Small screens, Left-aligned on Desktop */}
            <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0 lg:justify-start">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative h-9 w-36 sm:h-10 sm:w-40 md:h-11 md:w-44">
                  <Image
                    src="/logo.avif"
                    alt="Al Hayy International"
                    fill
                    className="object-contain object-center lg:object-left group-hover:scale-105 transition-all duration-300"
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(80%) sepia(45%) saturate(750%) hue-rotate(5deg) contrast(110%) drop-shadow(0 0 10px rgba(212,175,55,0.6))'
                    }}
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Clean Essential Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
                      isActive
                        ? 'text-[#F7E7B6] font-bold border-b-2 border-[#D4AF37] pb-1 shadow-xs'
                        : 'text-stone-300 hover:text-[#D4AF37] hover:border-b-2 hover:border-[#D4AF37]/50 pb-1 border-b-2 border-transparent'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Icons (Search, Login/Account, Cart) */}
            <div className="flex items-center space-x-2.5 sm:space-x-4 z-10">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-300 hover:text-[#D4AF37] transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* User Login / Profile */}
              {user ? (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 p-1.5 px-3 rounded-full bg-[#0B162C] text-[#F7E7B6] border border-[#D4AF37]/40 text-xs font-medium hover:bg-[#102142] transition-colors shadow-xs"
                >
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden md:inline max-w-[80px] truncate">{user.username}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 p-2 text-stone-300 hover:text-[#D4AF37] text-xs font-medium uppercase tracking-wider transition-colors"
                  aria-label="Sign In"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              {/* Shopping Bag */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="relative p-2.5 bg-[#D4AF37] text-[#070E1E] rounded-full hover:bg-[#F7E7B6] transition-all active:scale-95 shadow-lg font-bold cursor-pointer"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 text-[#070E1E]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Search Overlay */}
        {searchOpen && (
          <div className="w-full bg-[#070E1E] border-t border-b border-[#D4AF37]/30 px-4 py-4 mt-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search designer kurtis, kaftans, co-ords, pashmina shawls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#0B162C] border border-[#D4AF37]/40 text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-xs sm:text-sm"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions */}
              {searchResults.length > 0 && (
                <div className="mt-3 bg-[#0B162C] rounded-2xl border border-[#D4AF37]/30 shadow-2xl divide-y divide-[#D4AF37]/15 max-h-80 overflow-y-auto">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-[#102142] transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-14 object-cover rounded-lg border border-[#D4AF37]/30"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                        <span className="text-[10px] text-[#F7E7B6] uppercase tracking-wider">{item.category}</span>
                      </div>
                      <span className="text-xs font-bold text-[#D4AF37]">₹{item.discount_price || item.price}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#070E1E] text-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 p-6 space-y-6 border-r border-[#D4AF37]/30">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30">
              <div className="relative h-8 w-32">
                <Image 
                  src="/logo.avif" 
                  alt="Al Hayy" 
                  fill 
                  className="object-contain object-left" 
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(80%) sepia(45%) saturate(750%) hue-rotate(5deg) contrast(110%) drop-shadow(0 0 8px rgba(212,175,55,0.6))'
                  }}
                />
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-stone-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2.5 text-xs font-semibold uppercase tracking-widest ${
                    pathname === link.href ? 'text-[#F7E7B6] font-bold border-l-2 border-[#D4AF37] pl-3 bg-[#0B162C]/60 rounded-r-lg' : 'text-stone-300 hover:text-white pl-3'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/30 space-y-3">
              <a
                href="https://wa.me/919622480276"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#0B162C] text-[#F7E7B6] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-[#102142]"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: +91 96224 80276</span>
              </a>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://www.instagram.com/Alhayyofficial/"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 text-stone-300 hover:text-[#D4AF37] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/alhayykashmir/"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 text-stone-300 hover:text-[#D4AF37] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-white/10 border border-[#D4AF37]/30 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/20"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" /> Customer Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
