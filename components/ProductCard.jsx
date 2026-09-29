'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, Plus, Minus, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    product.variants && product.variants[0] ? product.variants[0].size : 'M'
  );

  const price = Number(product.price) || 999;
  const discountPrice = Number(product.discount_price) || price;
  const hasDiscount = discountPrice < price;

  const currentQuantity = getItemQuantity(product.id, selectedSize);

  const handleAddOne = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 'Standard', 1, false); // false = silent add, no drawer popup
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, selectedSize, 1, 'Standard');
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, selectedSize, -1, 'Standard');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className="group relative flex flex-col h-full bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/80 hover:border-stone-900 transition-all duration-500 shadow-xs hover:shadow-xl sheen-effect hover:-translate-y-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Box with Exact Luxury 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'}
            alt={product.title ? `${product.title} - Handcrafted ${product.category || 'Atelier'} by Al Hayy International` : 'Al Hayy International Luxury Handcrafted Fashion'}
            className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            loading="lazy"
          />
        </Link>

        {/* Minimal Sale Tag & Rating */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10 flex flex-col gap-1">
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-stone-950 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs">
              Sale
            </span>
          )}
        </div>

        {/* Quick View Button (Desktop) */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 hover:text-stone-950 shadow-sm flex items-center justify-center transition-all ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Size Selector Pills (Visible on Hover for desktop, subtle bar on mobile) */}
        {product.variants && product.variants.length > 0 && (
          <div
            className={`absolute bottom-2.5 sm:bottom-3 inset-x-2 sm:inset-x-3 transition-all duration-300 z-10 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none hidden sm:block'
            }`}
          >
            <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-stone-200 flex items-center justify-center gap-1">
              <span className="text-[9px] font-bold text-stone-400 uppercase mr-0.5">Size:</span>
              {product.variants.slice(0, 4).map((v) => (
                <button
                  key={v.size}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(v.size);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
                    selectedSize === v.size
                      ? 'bg-stone-950 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details & Actions Container */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3 bg-white">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-stone-400">
            <span>{product.category || 'Atelier'}</span>
            <div className="flex items-center gap-0.5 text-amber-700 font-semibold">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>4.9</span>
            </div>
          </div>

          <Link href={`/product/${product.id}`} className="block group-hover:text-stone-600 transition-colors">
            <h3 className="font-serif-luxury text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Quantity Controls */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-stone-950">
              ₹{discountPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Inline Quantity Controls on Card (+ / -) */}
          {currentQuantity > 0 ? (
            <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden shadow-xs shrink-0">
              <button
                type="button"
                onClick={handleDecrement}
                className="p-1.5 sm:px-2 sm:py-1.5 text-stone-700 hover:bg-stone-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-1.5 sm:px-2 text-xs font-bold text-stone-950 min-w-[16px] sm:min-w-[20px] text-center">
                {currentQuantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="p-1.5 sm:px-2 sm:py-1.5 text-stone-700 hover:bg-stone-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddOne}
              className="px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 bg-stone-100 hover:bg-stone-950 text-stone-900 hover:text-white transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
