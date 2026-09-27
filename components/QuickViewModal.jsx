'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Star, ShoppingBag, Check, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(
    product?.variants && product.variants[0] ? product.variants[0].size : 'M'
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.variants && product.variants[0] && product.variants[0].colors
      ? product.variants[0].colors[0]
      : 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const price = Number(product.price) || 999;
  const discountPrice = Number(product.discount_price) || price;
  const hasDiscount = discountPrice < price;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#EADBCC] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
          aria-label="Close Quick View"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="relative aspect-[3/4] md:aspect-auto bg-stone-100">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#881337] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
                Special Offer
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-800">
                <span className="uppercase tracking-wider font-semibold font-sans">
                  {product.category || 'Al Hayy Collection'}
                </span>
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{product.rating || '4.9'}</span>
                  <span className="text-slate-400">({product.reviews_count || 18} reviews)</span>
                </div>
              </div>

              <h2 className="font-serif-luxury text-2xl font-bold text-slate-900 leading-snug">
                {product.title}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-bold text-[#064E3B]">
                  ₹{discountPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold rounded-full">
                  In Stock & Ready to Ship
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Select Size:</span>
                    <span className="text-amber-800 font-medium">Standard Indian Fit</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(v.size);
                          if (v.colors && v.colors.length > 0) {
                            setSelectedColor(v.colors[0]);
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedSize === v.size
                            ? 'bg-[#064E3B] text-white shadow-md'
                            : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-stone-200 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-stone-200 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#022C22] text-amber-200 hover:bg-[#064E3B] shadow-lg'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1"
                >
                  <span>View Full Product Details & Craft Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
