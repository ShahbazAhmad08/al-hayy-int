import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Al Hayy International',
  description: 'How Al Hayy International safeguards your personal patron information, orders, and payment security.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 px-4 sm:px-6 lg:px-8 text-stone-900">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#AA7E18] hover:text-[#070E1E] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Boutique</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070E1E] text-[#F7E7B6] text-[10px] font-bold uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>256-Bit Encrypted Data Privacy</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#070E1E]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            Last Updated: October 2026 • Al Hayy International
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5D9C8] shadow-xs space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              1. Information We Collect
            </h2>
            <p>
              When you purchase or inquire about an handcrafted creation at Al Hayy International, we collect necessary patron details such as your name, shipping address, contact phone number, and email address solely to process courier delivery, provide order updates, and respond to bespoke sizing inquiries.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              2. Payment Security &amp; Zero Card Storage
            </h2>
            <p>
              All online transactions are processed through certified PCI-DSS Level 1 payment processors (Razorpay and Stripe). <strong>We never store, log, or have access to your full credit card numbers, CVVs, or bank passwords.</strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              3. Zero Data Selling Commitment
            </h2>
            <p>
              We honor the dignity and privacy of our global patrons. We will never sell, lease, or distribute your personal contact information or purchase history to third-party advertisers or telemarketers.
            </p>
          </section>

          <section className="space-y-3 border-t border-stone-100 pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              4. Data Privacy Officer Contact
            </h2>
            <p>
              If you have any questions or wish to request data deletion, contact our Data Privacy Desk at <strong className="text-[#070E1E]">privacy@alhayyinternational.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
