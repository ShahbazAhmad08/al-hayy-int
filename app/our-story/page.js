import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock, MapPin, Feather, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import SEOStructuredData from '@/components/SEOStructuredData';

export const metadata = {
  title: 'Our Story & Artisanal Craft Heritage | Al Hayy International',
  description: 'Learn about Al Hayy International, our master artisan families, and the timeless hand-embroidery process behind our luxury kurtis, kaftans, and designer fashion.',
  openGraph: {
    title: 'Our Story & Artisan Heritage | Al Hayy International',
    description: 'Learn about Al Hayy International, our master artisan families, and the bespoke hand-embroidery process.',
    url: 'https://www.alhayyinternational.com/our-story',
  }
};

export default function OurStoryPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Our Story', url: '/our-story' }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-[#FAF7F2]">
      <SEOStructuredData type="BreadcrumbList" data={breadcrumbs} />

      {/* Hero */}
      <section className="relative bg-[#070E1E] text-white py-20 sm:py-28 px-4 overflow-hidden text-center border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/hero-packaging.jpg"
            alt="Al Hayy Atelier Packaging"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E] via-[#070E1E]/80 to-[#070E1E]/60" />

        <div className="relative max-w-3xl mx-auto space-y-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#102142] text-[#F7E7B6] border border-[#D4AF37]/40 text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Generational Kashmiri Couture</span>
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold leading-tight text-white">
            The Royal Atelier Story
          </h1>
          <p className="text-xs sm:text-base text-stone-300 leading-relaxed font-light">
            Behind every delicate curve of Aari needlecraft and each fold of pure pashmina lies decades of heritage devotion and royal packaging craftsmanship.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Chapter 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#AA7E18]">Chapter I</span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E]">
              The Genesis of Al Hayy
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              <strong className="text-[#070E1E]">Al Hayy International</strong> was envisioned as a sanctuary for authentic Kashmiri textile arts and high luxury couture. We work directly with master weavers, needlework artisans, and loom custodians in the Kashmir valley to bring bespoke handcrafted creations to discerning wardrobes worldwide.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Every kurti, flowing kaftan, silk jacket, and pashmina shawl is tailored to harmonize royal heritage grandeur with breezy modern silhouette elegance.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#E5D9C8] aspect-[4/3] bg-[#070E1E]">
            <img
              src="/images/gallery-4.jpg"
              alt="Artisan embroidery"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Chapter 2: The Royal Packaging Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#D4AF37]/40 aspect-[4/3] bg-[#070E1E] md:order-1 order-2">
            <img
              src="/images/hero-packaging.jpg"
              alt="Al Hayy Royal Packaging"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4 md:order-2 order-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#AA7E18]">Chapter II</span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E]">
              The Signature Unboxing Ritual
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              We believe luxury should be an immersive experience from the instant your parcel arrives. Each garment is ensconced in crisp tissue, bound with our signature hand-tied pure silk ribbon, and sealed with the gold-embossed Arabic <strong className="text-[#070E1E]">الحَي</strong> insignia.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Presented inside our custom rigid Midnight Navy keepsake box with heavy luxury gift bags and hand-signed authenticity certificates.
            </p>
          </div>
        </div>

        {/* Chapter 3: The Anatomy of Aari Needlecraft */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#AA7E18]">Chapter III</span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E]">
              The Anatomy of Aari Needlework &amp; Sozni Motifs
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Dating back to the 15th-century Mughal courts, Kashmiri <em>Aari needlework</em> is executed with a specialized wooden-handled awl needle. Our master craftsmen loop fine silk, cotton, and metallic zari threads in unbroken concentric chain stitches across the fabric.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Every curve represents classic motifs inspired by the Kashmir valley: the iconic <em>Badam</em> (almond paisley), <em>Chinar</em> leaves, floral blossoms, and geometric Persian lattices. A single kurti requires 48 to 72 hours of uninterrupted hand manipulation.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#E5D9C8] aspect-[4/3] bg-[#070E1E]">
            <img
              src="/images/gallery-37.jpg"
              alt="Artisan Aari Needlework"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Chapter 4: Pure Natural Fibers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#D4AF37]/40 aspect-[4/3] bg-[#070E1E] md:order-1 order-2">
            <img
              src="/images/gallery-6.jpg"
              alt="Pure Cotton and Silk Fabrics"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4 md:order-2 order-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#AA7E18]">Chapter IV</span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E]">
              Ethical Sourcing &amp; Pure Natural Fibers
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              We completely reject fast-fashion synthetic polyester shortcuts. Our garments are exclusively structured on high-thread-count 60s pure combed cotton, fine modal silk, and ethically procured Changthangi pashmina wool.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              The result is a textile that feels weightless against the skin, breathes effortlessly in tropical warmth, and drapes with majestic fluid grace.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-white rounded-3xl border border-[#E5D9C8] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#070E1E] text-[#D4AF37] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">
              72h Needlework
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              No machine printing or synthetic shortcuts. Each piece is shaped stitch by stitch by master needleworkers.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E5D9C8] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#070E1E] text-[#D4AF37] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">
              Direct Artisan Impact
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Fair-trade wages directly sustaining 80+ indigenous weaver and embroidery families across the Kashmir valley.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E5D9C8] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#070E1E] text-[#D4AF37] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">
              Royal Presentation
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Delivered in our bespoke Midnight Navy rigid box with gold-foil Arabic crest and silk ribbon.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 space-y-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#070E1E] text-[#F7E7B6] font-bold text-xs uppercase tracking-widest hover:bg-[#102142] border border-[#D4AF37]/40 transition-all shadow-lg active:scale-95 animate-gold-pulse"
          >
            <span>Explore The Handcrafted Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          <div>
            <a
              href="https://wa.me/91962248076"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#AA7E18] font-bold hover:underline"
            >
              Direct Concierge: +91 96224 8076
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
