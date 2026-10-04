import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Al Hayy International',
  description: 'Terms of service, purchase conditions, and artisanal craft guarantees of Al Hayy International.'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 px-4 sm:px-6 lg:px-8 text-stone-900">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#AA7E18] hover:text-[#070E1E] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Boutique</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070E1E] text-[#F7E7B6] text-[10px] font-bold uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Artisanal Couture Guarantee</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#070E1E]">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            Last Updated: October 2026 • Al Hayy International
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5D9C8] shadow-xs space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              1. Authentic Handcrafted Artistry
            </h2>
            <p>
              Every garment and textile artifact offered by Al Hayy International is crafted using genuine natural fibers and authentic Kashmiri hand needlework (including Aari, Sozni, Tilla, and Kani weaving). Subtle variations in thread tension or weave texture are the natural hallmarks of authentic human craftsmanship and should not be considered defects.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              2. Orders, Sizing &amp; Payments
            </h2>
            <p>
              All prices displayed on the store are in Indian Rupees (INR) or localized international currencies. We support secure 256-bit SSL encrypted payments via Razorpay, Stripe, UPI, and Cash on Delivery (COD) within India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              3. Exchanges &amp; Alteration Guarantee
            </h2>
            <p>
              We stand firmly behind the fit and elegance of our silhouettes. If you require size alterations or wish to exchange a standard-sized ready garment, contact our concierge within 7 calendar days of delivery for hassle-free resolution.
            </p>
          </section>

          <section className="space-y-3 border-t border-stone-100 pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              4. Contact &amp; Legal Inquiries
            </h2>
            <p>
              For legal inquiries or terms clarification, please contact our legal desk at <strong className="text-[#070E1E]">legal@alhayyinternational.com</strong> or our headquarters in Srinagar, Jammu &amp; Kashmir, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
