// lib/paymentConfig.js - Payment Gateways & Toggle Configuration
import { API_BASE_URL } from './api';

export const DEFAULT_PAYMENT_CONFIG = {
  razorpay: {
    enabled: true,
    name: 'Razorpay (Cards, UPI, NetBanking)',
    keyId: 'rzp_live_default_key',
    keySecret: '',
    description: 'Fast & Secure checkout via Razorpay India'
  },
  stripe: {
    enabled: true,
    name: 'Stripe (International Cards & Apple Pay)',
    publishableKey: 'pk_live_default_stripe_key',
    secretKey: '',
    currency: 'INR',
    description: 'Global Visa, Mastercard, American Express & Apple Pay'
  },
  upi: {
    enabled: true,
    name: 'UPI Instant QR & Apps (GPay, PhonePe, Paytm)',
    upiId: 'alhayy@okhdfcbank',
    merchantName: 'Al Hayy International',
    description: 'Zero convenience fees via direct UPI QR scan'
  },
  cod: {
    enabled: true, // Default ON, toggleable from Admin Panel
    name: 'Cash on Delivery (COD)',
    extraFee: 0,
    minOrderAmount: 0,
    description: 'Pay cash upon delivery to your doorstep'
  }
};

export function getPaymentConfig() {
  if (typeof window === 'undefined') return DEFAULT_PAYMENT_CONFIG;
  try {
    const stored = localStorage.getItem('alhayy_payment_settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        razorpay: { ...DEFAULT_PAYMENT_CONFIG.razorpay, ...parsed.razorpay },
        stripe: { ...DEFAULT_PAYMENT_CONFIG.stripe, ...parsed.stripe },
        upi: { ...DEFAULT_PAYMENT_CONFIG.upi, ...parsed.upi },
        cod: { ...DEFAULT_PAYMENT_CONFIG.cod, ...parsed.cod },
      };
    }
  } catch (e) {
    console.warn('Failed to load payment settings', e);
  }
  return DEFAULT_PAYMENT_CONFIG;
}

export async function fetchRemotePaymentConfig() {
  try {
    const res = await fetch(`${API_BASE_URL}/get-payment-settings.php`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        savePaymentConfig(json.data);
        return {
          razorpay: { ...DEFAULT_PAYMENT_CONFIG.razorpay, ...json.data.razorpay },
          stripe: { ...DEFAULT_PAYMENT_CONFIG.stripe, ...json.data.stripe },
          upi: { ...DEFAULT_PAYMENT_CONFIG.upi, ...json.data.upi },
          cod: { ...DEFAULT_PAYMENT_CONFIG.cod, ...json.data.cod },
        };
      }
    }
  } catch (e) {
    console.warn('Could not load remote payment settings, using local:', e.message);
  }
  return getPaymentConfig();
}

export function savePaymentConfig(config) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('alhayy_payment_settings', JSON.stringify(config));
    // Also sync to remote backend in background
    fetch(`${API_BASE_URL}/save-payment-settings.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    }).catch(() => {});
  } catch (e) {
    console.warn('Failed to save payment settings', e);
  }
}
