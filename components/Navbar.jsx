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
  Package
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SEED_PRODUCTS } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const { user } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

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
      const filtered = SEED_PRODUCTS.filter(
        item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

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
    { name: 'About', href: '/our-story' },
    { name: 'Track Order', href: '/orders' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Sleek Minimal European Luxury Navigation */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs py-3 border-b border-stone-200/80'
            : 'bg-white py-4 border-b border-stone-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-stone-900 hover:text-stone-600 transition-colors"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative h-10 w-36 sm:h-11 sm:w-44">
                  <Image
                    src="/logo.avif"
                    alt="Al Hayy"
                    fill
                    className="object-contain object-left group-hover:opacity-90 transition-opacity"
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
                        ? 'text-stone-950 font-bold border-b-2 border-stone-950 pb-1'
                        : 'text-stone-600 hover:text-stone-950 pb-1 border-b-2 border-transparent'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Icons (Search, Login/Account, Cart) */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-700 hover:text-stone-950 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* User Login / Profile */}
              {user ? (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 p-1.5 px-3 rounded-full bg-stone-100 text-stone-900 text-xs font-medium hover:bg-stone-200 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden md:inline max-w-[80px] truncate">{user.username}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 p-2 text-stone-700 hover:text-stone-950 text-xs font-medium uppercase tracking-wider transition-colors"
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
                className="relative p-2.5 bg-stone-950 text-white rounded-full hover:bg-stone-800 transition-all active:scale-95"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D97706] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Search Overlay */}
        {searchOpen && (
          <div className="w-full bg-white border-t border-b border-stone-200 px-4 py-4 mt-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search designer kurtis, kaftans, co-ords, silk outerwear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-950 text-xs sm:text-sm"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 p-1 text-stone-400 hover:text-stone-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions */}
              {searchResults.length > 0 && (
                <div className="mt-3 bg-white rounded-2xl border border-stone-100 shadow-xl divide-y divide-stone-100 max-h-80 overflow-y-auto">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-stone-50 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-stone-900 truncate">{item.title}</h4>
                        <span className="text-[10px] text-stone-500 uppercase tracking-wider">{item.category}</span>
                      </div>
                      <span className="text-xs font-bold text-stone-950">₹{item.discount_price || item.price}</span>
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
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="relative h-8 w-32">
                <Image src="/logo.avif" alt="Al Hayy" fill className="object-contain object-left" />
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-stone-400 hover:text-stone-900">
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
                    pathname === link.href ? 'text-stone-950 font-bold' : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5" /> Customer Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
