'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    setIsDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItemsCount,
    discountAmount,
    couponCode,
    setCouponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
    shippingFee,
    isFreeShipping,
    grandTotal,
    freeShippingRemaining,
    freeShippingProgress,
  } = useCart();

  const { user } = useAuth();
  const [inputCoupon, setInputCoupon] = useState('');

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  const checkoutHref = user ? '/checkout' : '/login?redirect=/checkout';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-stone-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-white text-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-900 font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-base font-bold text-stone-950">
                Shopping Bag
              </h2>
              <p className="text-[11px] text-stone-500">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-colors"
            aria-label="Close Shopping Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-stone-50 px-4 py-3 border-b border-stone-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <div className="flex items-center gap-1.5 text-stone-700">
              <Truck className="w-3.5 h-3.5 text-stone-800" />
              {isFreeShipping ? (
                <span className="text-[#AA7E18] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Free Express Delivery Unlocked!
                </span>
              ) : (
                <span>
                  Add <strong className="text-stone-950">₹{freeShippingRemaining.toLocaleString('en-IN')}</strong> more for Free Delivery
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-stone-700">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-stone-950 transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Discover our designer kurtis, flowing kaftans, and luxury outerwear.
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-2.5 rounded-full bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
              >
                <Link href="/shop">Explore Collections</Link>
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex gap-3 items-center"
              >
                {/* Image */}
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-serif-luxury text-xs font-semibold text-stone-900 truncate">
                      {item.title}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1 -mr-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                      Size: {item.selectedSize}
                    </span>
                  </div>

                  {/* Price and Quantity */}
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-xs font-bold text-stone-950">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, -1, item.selectedColor)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-800 min-w-[18px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, 1, item.selectedColor)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3 shadow-lg">
            {/* Coupon Code Input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. KASHMIR10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-950 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-stone-950 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponMessage && (
                <div className="flex items-center justify-between mt-1.5 text-[11px] px-2 py-1 rounded bg-stone-100 text-stone-800 border border-stone-200">
                  <span className="font-medium">{couponMessage}</span>
                  {discountAmount > 0 && (
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:underline font-bold text-[10px]"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#AA7E18] font-medium">
                  <span>Savings</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>
                  {isFreeShipping ? (
                    <span className="text-[#AA7E18] font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                <span className="font-serif-luxury">Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href={checkoutHref}
              onClick={() => setIsDrawerOpen(false)}
              className="w-full py-3.5 px-4 rounded-xl bg-stone-950 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:bg-stone-800 transition-all"
            >
              <span>{user ? 'Proceed to Checkout' : 'Sign In & Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
              <span>100% Encrypted Checkout & Authenticity Assured</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
