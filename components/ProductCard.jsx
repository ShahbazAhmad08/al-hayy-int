'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, Plus, Minus, Check } from 'lucide-react';
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
    addToCart(product, selectedSize, 'Standard', 1, false); // false = don't open drawer
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
      className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-stone-200/70 hover:border-stone-400/80 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'}
            alt={product.title}
            className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            loading="lazy"
          />
        </Link>

        {/* Minimal Sale Tag */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2 py-0.5 bg-stone-950 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
              Sale
            </span>
          </div>
        )}

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 hover:text-stone-950 shadow-sm flex items-center justify-center transition-all ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Size Selector Pills */}
        {product.variants && product.variants.length > 0 && (
          <div
            className={`absolute bottom-3 inset-x-3 transition-all duration-300 z-10 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none'
            }`}
          >
            <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-stone-200 flex items-center justify-center gap-1.5">
              <span className="text-[10px] font-medium text-stone-400 uppercase mr-1">Size:</span>
              {product.variants.slice(0, 4).map((v) => (
                <button
                  key={v.size}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(v.size);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors ${
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

      {/* Details & Actions */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            {product.category || 'Atelier Collection'}
          </span>

          <Link href={`/product/${product.id}`} className="block group-hover:text-stone-600 transition-colors">
            <h3 className="font-serif-luxury text-sm font-semibold text-stone-900 line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Quantity Controls */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-stone-950">
              ₹{discountPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Quantity Controls on Card (+ / -) */}
          {currentQuantity > 0 ? (
            <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={handleDecrement}
                className="px-2 py-1.5 text-stone-700 hover:bg-stone-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-bold text-stone-950 min-w-[20px] text-center">
                {currentQuantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="px-2 py-1.5 text-stone-700 hover:bg-stone-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddOne}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-stone-100 hover:bg-stone-950 text-stone-900 hover:text-white transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
