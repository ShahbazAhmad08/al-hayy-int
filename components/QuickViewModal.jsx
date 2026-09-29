'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Star, ShoppingBag, Check, ShieldCheck, Sparkles, ArrowRight, Play, Image as ImageIcon } from 'lucide-react';
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
  const [previewImage, setPreviewImage] = useState(product?.image || '');
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setPreviewImage(product.image || '');
      setMediaType('image');
    }
  }, [product]);

  // Lock background scrolling and attach ESC listener
  useEffect(() => {
    if (!product) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-stone-200 z-10 my-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/90 hover:bg-stone-100 text-stone-700 hover:text-stone-950 transition-colors shadow-md border border-stone-200 cursor-pointer"
          aria-label="Close Quick View"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Media Column (Image or Video) */}
          <div className="flex flex-col bg-stone-100 p-4 space-y-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-900 flex items-center justify-center shadow-inner">
              {mediaType === 'video' && product.video_url ? (
                <div className="w-full h-full relative bg-black flex items-center justify-center">
                  <video
                    src={product.video_url}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setMediaType('image')}
                    className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 hover:bg-black/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Photos</span>
                  </button>
                </div>
              ) : (
                <img
                  src={previewImage || product.image}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
              )}

              {mediaType === 'image' && hasDiscount && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-stone-950 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">
                  Special Atelier Pick
                </span>
              )}

              {product.video_url && mediaType === 'image' && (
                <button
                  onClick={() => setMediaType('video')}
                  className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-[#070E1E]/90 hover:bg-[#070E1E] text-[#D4AF37] border border-[#D4AF37]/40 shadow-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-[#D4AF37]" />
                  <span>Play Video</span>
                </button>
              )}
            </div>

            {/* Quick Thumbnails */}
            {((product.images && product.images.length > 1) || product.video_url) && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPreviewImage(img);
                      setMediaType('image');
                    }}
                    className={`relative w-14 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      mediaType === 'image' && previewImage === img
                        ? 'border-[#AA7E18] shadow-md scale-102 ring-1 ring-[#AA7E18]/40'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}

                {product.video_url && (
                  <button
                    onClick={() => setMediaType('video')}
                    className={`relative w-14 h-16 rounded-xl overflow-hidden border-2 shrink-0 flex flex-col items-center justify-center bg-[#070E1E] text-white transition-all cursor-pointer ${
                      mediaType === 'video'
                        ? 'border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/50'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="text-[8px] font-bold text-[#F7E7B6] uppercase mt-0.5">Video</span>
                  </button>
                )}
              </div>
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
                <span className="text-2xl font-bold text-[#070E1E]">
                  ₹{discountPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs px-2.5 py-0.5 bg-[#D4AF37]/15 text-[#AA7E18] font-bold rounded-full border border-[#D4AF37]/30">
                  In Stock &amp; Ready to Ship
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#070E1E]">Select Size:</span>
                    <span className="text-[#AA7E18] font-medium">Standard Indian Fit</span>
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
                            ? 'bg-[#070E1E] text-[#F7E7B6] shadow-md border border-[#D4AF37]'
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

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-200 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-200 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                    added
                      ? 'bg-[#AA7E18] text-white shadow-lg'
                      : 'bg-[#070E1E] text-[#F7E7B6] hover:bg-[#102142] border border-[#D4AF37]/40 shadow-xl'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
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
