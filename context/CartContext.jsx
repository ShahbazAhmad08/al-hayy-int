'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const FREE_SHIPPING_THRESHOLD = 1499;
export const STANDARD_SHIPPING_FEE = 99;

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Load cart from localStorage upon mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('alhayy_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    }
  }, []);

  // Save cart to localStorage upon changes
  useEffect(() => {
    try {
      localStorage.setItem('alhayy_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Add Item to Cart (Drawer does NOT auto-open)
  const addToCart = (product, selectedSize = 'M', selectedColor = 'Standard', quantity = 1, openDrawer = false) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem = {
          id: product.id,
          title: product.title,
          price: Number(product.discount_price || product.price),
          original_price: Number(product.price),
          image: product.image,
          selectedSize: selectedSize || 'Free Size',
          selectedColor: selectedColor || 'Standard',
          quantity: quantity,
          category: product.category || 'Apparel'
        };
        return [...prev, newItem];
      }
    });

    if (openDrawer) {
      setIsDrawerOpen(true);
    }
  };

  // Remove Item from Cart
  const removeFromCart = (productId, size, color) => {
    setCart(prev =>
      prev.filter(
        item => !(item.id === productId && item.selectedSize === size && (color ? item.selectedColor === color : true))
      )
    );
  };

  // Update Item Quantity
  const updateQuantity = (productId, size, delta, color) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === productId && item.selectedSize === size && (color ? item.selectedColor === color : true)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Get specific item quantity in cart
  const getItemQuantity = (productId, size = 'M') => {
    const item = cart.find(i => i.id === productId && i.selectedSize === size);
    return item ? item.quantity : 0;
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(0);
    setCouponCode('');
    try {
      localStorage.removeItem('alhayy_cart');
    } catch (e) {}
  };

  // Apply Coupon
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'KASHMIR10' || clean === 'WELCOME10') {
      setAppliedDiscount(10);
      setCouponMessage('10% Privilege Discount Applied!');
      return { success: true, message: '10% discount applied!' };
    } else if (clean === 'FIRSTORDER' || clean === 'ALHAYY20') {
      setAppliedDiscount(20);
      setCouponMessage('20% Festive Luxury Discount Applied!');
      return { success: true, message: '20% festive discount applied!' };
    } else {
      setAppliedDiscount(0);
      setCouponMessage('Invalid coupon code');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
    setCouponMessage('');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        clearCart,
        subtotal,
        totalItemsCount,
        discountAmount,
        appliedDiscount,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
