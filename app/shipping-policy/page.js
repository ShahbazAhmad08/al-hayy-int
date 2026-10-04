import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, Globe, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | Al Hayy International',
  description: 'Learn about Al Hayy International insured shipping, domestic express delivery across India, and worldwide export courier logistics.'
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 px-4 sm:px-6 lg:px-8 text-stone-900">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#AA7E18] hover:text-[#070E1E] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Boutique</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070E1E] text-[#F7E7B6] text-[10px] font-bold uppercase tracking-widest">
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Complimentary Insured Transit</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#070E1E]">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            Last Updated: October 2026 • Al Hayy International Master Atelier
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5D9C8] shadow-xs space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              1. Domestic Shipping Across India
            </h2>
            <p>
              We provide <strong>Complimentary Express Shipping</strong> on all domestic prepaid orders across India (including metro and tier-2/3 cities). Orders are packed in our signature rigid keepsake packaging with tamper-evident seals.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>Dispatch Time:</strong> Ready-to-wear creations are dispatched within 24–48 hours from our Srinagar atelier.</li>
              <li><strong>Transit Duration:</strong> 3 to 5 business days via premium air courier partners (Blue Dart, Delhivery, DTDC Express).</li>
              <li><strong>Live Tracking:</strong> Real-time SMS and email tracking links are dispatched immediately upon carrier pickup.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              2. International Worldwide Shipping
            </h2>
            <p>
              Al Hayy International delivers across the United States, United Kingdom, UAE, Canada, Australia, Singapore, and Europe via tracked DHL Express and FedEx International Priority.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>International Transit Time:</strong> 5 to 8 business days door-to-door.</li>
              <li><strong>Customs &amp; Duties:</strong> International orders may be subject to local import taxes/duties assessed by the destination country customs authorities.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              3. Bespoke Bridal &amp; Custom Sizing Orders
            </h2>
            <p>
              Hand-embroidered bespoke commissions, bridal trousseaus, and custom size tailoring involve extensive artisan needlework (often requiring 40 to 72 hours of dedicated hand craftsmanship). Customized garments are dispatched within 7–12 business days upon confirmation of sizing details.
            </p>
          </section>

          <section className="space-y-3 border-t border-stone-100 pt-6">
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#070E1E]">
              4. Concierge Assistance &amp; Tracking
            </h2>
            <p>
              For urgent courier dispatches, wedding date milestones, or address modifications, connect directly with our concierge desk at <strong className="text-[#070E1E]">+91 96224 80276</strong> or via email at <strong className="text-[#070E1E]">support@alhayyinternational.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
