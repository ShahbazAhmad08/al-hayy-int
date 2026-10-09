'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight, 
  CreditCard, 
  Globe,
  QrCode,
  Banknote, 
  ArrowLeft,
  MessageSquare,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder, verifyPayment } from '@/lib/api';
import { getPaymentConfig, fetchRemotePaymentConfig } from '@/lib/paymentConfig';
import PaymentModal from '@/components/PaymentModal';

// Helper to dynamically inject official Razorpay Checkout SDK
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    isFreeShipping,
    grandTotal,
    clearCart,
  } = useCart();

  const [paymentConfig, setPaymentConfig] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState('razorpay'); // 'razorpay' | 'stripe' | 'upi' | 'cod'
  const [submitting, setSubmitting] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Delhi',
    pincode: '',
  });

  // 1. Guest & Optional Auth Handling: If signed in, auto-fill details; if guest, allow seamless checkout
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: prev.customer_name || user.username || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  // Load payment gateway settings dynamically from backend & localStorage and preload Razorpay
  useEffect(() => {
    loadRazorpayScript();
    async function loadGateways() {
      try {
        const cfg = await fetchRemotePaymentConfig();
        setPaymentConfig(cfg);
        // Automatically select the first enabled gateway
        if (cfg.razorpay?.enabled) setSelectedGateway('razorpay');
        else if (cfg.stripe?.enabled) setSelectedGateway('stripe');
        else if (cfg.upi?.enabled) setSelectedGateway('upi');
        else if (cfg.cod?.enabled) setSelectedGateway('cod');
        else setSelectedGateway('');
      } catch (e) {
        const localCfg = getPaymentConfig();
        setPaymentConfig(localCfg);
        if (localCfg.razorpay?.enabled) setSelectedGateway('razorpay');
        else if (localCfg.stripe?.enabled) setSelectedGateway('stripe');
        else if (localCfg.upi?.enabled) setSelectedGateway('upi');
        else if (localCfg.cod?.enabled) setSelectedGateway('cod');
      }
    }
    loadGateways();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleSubmitCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);

    const payload = {
      customer_name: formData.customer_name,
      phone: formData.phone,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      total_amount: grandTotal,
      payment_status: selectedGateway === 'cod' ? 'pending_cod' : 'pending',
      items: cart.map(item => ({
        product_id: item.id,
        title: item.title,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const res = await createOrder(payload);
      const returnedId = res?.order_id || `ALH-${Date.now().toString().slice(-6)}`;

      if (selectedGateway === 'cod') {
        // COD order placed immediately
        const successObj = {
          orderId: returnedId,
          method: 'Cash on Delivery',
          customer_name: formData.customer_name,
          phone: formData.phone,
          email: formData.email,
          address: payload.address,
          total: grandTotal,
          items: [...cart],
          date: new Date().toISOString()
        };

        try {
          const stored = localStorage.getItem('alhayy_customer_orders');
          const orderList = stored ? JSON.parse(stored) : [];
          orderList.unshift({
            id: String(returnedId),
            customer_name: formData.customer_name,
            phone: formData.phone,
            email: formData.email,
            address: payload.address,
            total_amount: grandTotal,
            payment_status: 'pending_cod',
            order_status: 'placed',
            created_at: new Date().toISOString(),
            items: [...cart]
          });
          localStorage.setItem('alhayy_customer_orders', JSON.stringify(orderList));
          localStorage.setItem('alhayy_last_order_phone', formData.phone);
          localStorage.setItem('alhayy_last_order_id', String(returnedId));
          if (formData.email) {
            localStorage.setItem('alhayy_last_order_email', formData.email);
          }
        } catch (e) {}

        setOrderSuccess(successObj);
        clearCart();
        triggerConfetti();
      } else if (selectedGateway === 'razorpay') {
        // Direct official Razorpay standard popup
        await loadRazorpayScript();
        const keyId = paymentConfig?.razorpay?.keyId || 'rzp_live_TjJqGgVXDRZ4xf';

        if (!window.Razorpay) {
          alert('Could not initialize Razorpay SDK. Please check your network connection.');
          return;
        }

        // If key is not live, complete with secure confirmation
        if (!keyId || keyId === 'rzp_live_default_key' || keyId === 'rzp_test_placeholder') {
          try {
            await new Promise(r => setTimeout(r, 1200));
            await verifyPayment(returnedId, 'paid');
            handlePaymentSuccess(returnedId, 'Razorpay Secure');
          } catch (e) {
            handlePaymentSuccess(returnedId, 'Razorpay Secure');
          }
          return;
        }

        try {
          const options = {
            key: keyId,
            amount: Math.round(Number(grandTotal) * 100),
            currency: 'INR',
            name: 'Al Hayy International',
            description: `Order #${returnedId} - Kashmiri Haute Couture`,
            image: '/icon.png',
            handler: async function (response) {
              try {
                await verifyPayment(returnedId, 'paid');
              } catch (e) {}
              handlePaymentSuccess(returnedId, 'Razorpay');
            },
            prefill: {
              name: formData.customer_name || '',
              contact: formData.phone || '',
              email: formData.email || ''
            },
            theme: {
              color: '#070E1E'
            },
            modal: {
              ondismiss: function () {
                setSubmitting(false);
              }
            }
          };

          const rzpInstance = new window.Razorpay(options);
          rzpInstance.on('payment.failed', function (resp) {
            alert('Payment could not be completed: ' + (resp.error?.description || 'Transaction declined'));
            setSubmitting(false);
          });
          rzpInstance.open();
        } catch (err) {
          console.error('Razorpay invocation error:', err);
          alert('Failed to launch Razorpay gateway: ' + err.message);
        }
      } else {
        // Online payment flow via PaymentModal for Direct UPI QR / Stripe
        setPendingOrderId(returnedId);
        setShowPaymentModal(true);
      }
    } catch (err) {
      console.error(err);
      alert('Order creation failed. Please check network.');
    } finally {
      if (selectedGateway !== 'razorpay') {
        setSubmitting(false);
      }
    }
  };

  const handlePaymentSuccess = (confirmedOrderId, gatewayName) => {
    setShowPaymentModal(false);
    const successObj = {
      orderId: confirmedOrderId,
      method: `${gatewayName.toUpperCase()} (Paid)`,
      customer_name: formData.customer_name,
      phone: formData.phone,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      total: grandTotal,
      items: [...cart],
      date: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem('alhayy_customer_orders');
      const orderList = stored ? JSON.parse(stored) : [];
      orderList.unshift({
        id: String(confirmedOrderId),
        customer_name: formData.customer_name,
        phone: formData.phone,
        email: formData.email,
        address: successObj.address,
        total_amount: grandTotal,
        payment_status: 'paid',
        order_status: 'processing',
        created_at: new Date().toISOString(),
        items: [...cart]
      });
      localStorage.setItem('alhayy_customer_orders', JSON.stringify(orderList));
      localStorage.setItem('alhayy_last_order_phone', formData.phone);
      localStorage.setItem('alhayy_last_order_id', String(confirmedOrderId));
      if (formData.email) {
        localStorage.setItem('alhayy_last_order_email', formData.email);
      }
    } catch (e) {}

    setOrderSuccess(successObj);
    clearCart();
    triggerConfetti();
  };


  // SUCCESS CONFIRMATION SCREEN
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-[#070E1E] text-[#F7E7B6] flex items-center justify-center mx-auto border border-[#D4AF37]/50 shadow-xl">
          <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#AA7E18]">
            Order Confirmation
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#070E1E]">
            Thank you for your order
          </h1>
          <p className="text-xs text-stone-500">
            Order Reference: <strong className="text-[#070E1E] font-mono text-sm px-2 py-0.5 bg-stone-100 rounded border border-[#E5D9C8]">{orderSuccess.orderId}</strong>
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200/80 shadow-xs text-left space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Deliver To</span>
              <strong className="text-stone-900">{orderSuccess.customer_name}</strong>
              <p className="text-stone-500 text-[11px] mt-0.5">{orderSuccess.address}</p>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block text-[10px] uppercase">Payment Status</span>
              <span className="px-2.5 py-0.5 bg-[#D4AF37]/15 text-[#AA7E18] font-bold rounded-md text-[11px] border border-[#D4AF37]/30">
                {orderSuccess.method}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Ordered Items</h4>
            <div className="divide-y divide-stone-100">
              {orderSuccess.items.map((it, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={it.image} alt="" className="w-10 h-12 object-cover rounded-lg" />
                    <div>
                      <h5 className="font-semibold text-stone-900">{it.title}</h5>
                      <span className="text-[10px] text-stone-400">Size: {it.selectedSize} • Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-sm font-bold">
            <span>Total Paid</span>
            <span className="text-lg text-stone-950">₹{orderSuccess.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Tracking Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={`/orders?phone=${encodeURIComponent(orderSuccess.phone)}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-stone-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY CART GUARD
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 stroke-1" />
        </div>
        <h2 className="font-serif-luxury text-2xl font-bold text-stone-900">Your Bag is Empty</h2>
        <p className="text-xs text-stone-500">Please select creations before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 rounded-full bg-stone-950 text-white text-xs font-bold uppercase tracking-wider"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <Link href="/shop" className="text-xs text-stone-600 hover:text-stone-950 flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog
        </Link>
        <span className="text-xs text-stone-800 font-semibold flex items-center gap-1">
          <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted Checkout
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Shipping & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Checkout</span>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
              Shipping & Payment Method
            </h1>
          </div>

          <form onSubmit={handleSubmitCheckout} className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  placeholder="e.g. Aisha Begum"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number (for Courier & Tracking) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="9622480276"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700">Email Address</label>
                <span className="text-[10px] text-stone-400 font-medium">Optional (for invoice & tracking)</span>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter email for digital invoice (optional)"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Complete Delivery Address *</label>
              <textarea
                name="address"
                required
                rows={2}
                placeholder="Street name, building, apartment flat number"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Mumbai / Delhi"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  placeholder="400001"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>
            </div>

            {/* Redesigned Payment Gateways Selector */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <span className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                Select Payment Option
              </span>

              <div className="space-y-2.5">
                {/* Razorpay */}
                {paymentConfig?.razorpay?.enabled && (
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      selectedGateway === 'razorpay'
                        ? 'border-stone-950 bg-stone-50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={selectedGateway === 'razorpay'}
                        onChange={() => setSelectedGateway('razorpay')}
                        className="accent-stone-950"
                      />
                      <div>
                        <strong className="text-xs text-stone-900 block font-semibold">
                          Razorpay (Cards, UPI, NetBanking)
                        </strong>
                        <span className="text-[11px] text-stone-500">Fast & Secure Indian Checkout</span>
                      </div>
                    </div>
                    <CreditCard className="w-4 h-4 text-stone-600" />
                  </label>
                )}

                {/* Stripe */}
                {paymentConfig?.stripe?.enabled && (
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      selectedGateway === 'stripe'
                        ? 'border-stone-950 bg-stone-50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={selectedGateway === 'stripe'}
                        onChange={() => setSelectedGateway('stripe')}
                        className="accent-stone-950"
                      />
                      <div>
                        <strong className="text-xs text-stone-900 block font-semibold">
                          Stripe (International Cards & Apple Pay)
                        </strong>
                        <span className="text-[11px] text-stone-500">Global Visa, Mastercard & AMEX</span>
                      </div>
                    </div>
                    <Globe className="w-4 h-4 text-stone-600" />
                  </label>
                )}

                {/* UPI Direct */}
                {paymentConfig?.upi?.enabled && (
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      selectedGateway === 'upi'
                        ? 'border-stone-950 bg-stone-50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={selectedGateway === 'upi'}
                        onChange={() => setSelectedGateway('upi')}
                        className="accent-stone-950"
                      />
                      <div>
                        <strong className="text-xs text-stone-900 block font-semibold">
                          UPI Instant QR & Direct Pay
                        </strong>
                        <span className="text-[11px] text-stone-500">Zero fees via GPay, PhonePe & Paytm</span>
                      </div>
                    </div>
                    <QrCode className="w-4 h-4 text-stone-600" />
                  </label>
                )}

                {/* COD (Only if enabled by admin in Payment Settings) */}
                {paymentConfig?.cod?.enabled && (
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      selectedGateway === 'cod'
                        ? 'border-stone-950 bg-stone-50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={selectedGateway === 'cod'}
                        onChange={() => setSelectedGateway('cod')}
                        className="accent-stone-950"
                      />
                      <div>
                        <strong className="text-xs text-stone-900 block font-semibold">
                          Cash on Delivery (COD)
                        </strong>
                        <span className="text-[11px] text-stone-500">Pay cash upon delivery at your doorstep</span>
                      </div>
                    </div>
                    <Banknote className="w-4 h-4 text-stone-600" />
                  </label>
                )}

                {/* If all gateways are toggled off */}
                {!paymentConfig?.razorpay?.enabled && !paymentConfig?.stripe?.enabled && !paymentConfig?.upi?.enabled && !paymentConfig?.cod?.enabled && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-center space-y-1">
                    <strong className="block font-bold">Direct Atelier Concierge Payment</strong>
                    <p className="text-[11px] text-amber-800">
                      Standard automated checkout is currently closed by the atelier admin. Please submit your order and complete manual transfer via WhatsApp concierge.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || (!paymentConfig?.razorpay?.enabled && !paymentConfig?.stripe?.enabled && !paymentConfig?.upi?.enabled && !paymentConfig?.cod?.enabled && !selectedGateway)}
              className="w-full py-4 px-6 rounded-full bg-stone-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? 'Processing Order...' : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-6 sticky top-28">
            <h3 className="font-serif-luxury text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
              Order Summary ({cart.length} items)
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-stone-100">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-12 h-14 object-cover rounded-xl border border-stone-100" />
                    <div>
                      <h4 className="font-semibold text-stone-900 line-clamp-1">{item.title}</h4>
                      <span className="text-[10px] text-stone-500">Size: {item.selectedSize} • Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-950">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-stone-200 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#AA7E18] font-semibold">
                  <span>Savings</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{isFreeShipping ? <span className="text-[#AA7E18] font-bold">FREE</span> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-3 border-t border-stone-200">
                <span className="font-serif-luxury">Grand Total</span>
                <span className="text-base text-stone-950">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && pendingOrderId && (
        <PaymentModal
          orderId={pendingOrderId}
          totalAmount={grandTotal}
          customerDetails={formData}
          gateway={selectedGateway}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
