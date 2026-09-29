import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  COUNTRIES_DATA, 
  getCountryBySlug 
} from '@/lib/internationalCountriesData';
import { 
  Globe2, 
  Plane, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Package,
  Layers,
  HelpCircle,
  Scissors,
  FileCheck2,
  ChevronRight,
  Building2,
  Star,
  Coins,
  Ship,
  BadgeCheck,
  Truck
} from 'lucide-react';

export const dynamicParams = true;

// Generate static params for pre-rendering all 20 countries
export async function generateStaticParams() {
  return COUNTRIES_DATA.map((country) => ({
    country: country.slug,
  }));
}

// Dynamic SEO metadata per international country
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const country = getCountryBySlug(resolvedParams?.country);
  if (!country) {
    return {
      title: 'International Apparel Exporter & Cotton Kurti Manufacturer | Al Hayy',
    };
  }

  const title = `Indian Cotton Kurti & Co-ord Set Manufacturer Export to ${country.name} | Direct Wholesale Exporter`;
  const description = `Leading Indian manufacturer and direct factory exporter of pure cotton embroidered kurtis, designer women co-ord sets, and luxury handcrafted kaftans to ${country.name}. Doorstep express air cargo to ${country.keyCities}, complete customs documentation (HS 6204/6206), low MOQ & factory rates.`;

  return {
    title,
    description,
    keywords: [
      `Indian kurti manufacturer export to ${country.name}`,
      `Cotton Kurti wholesale supplier in ${country.name}`,
      `Women Co-ord Set manufacturer export ${country.name}`,
      `Handcrafted Kaftans exporter to ${country.name}`,
      `Kashmiri Aari embroidery kurtis wholesale ${country.name}`,
      `Indian ethnic wear supplier in ${country.keyCities}`,
      `Pure cotton apparel exporter India to ${country.shortName}`,
      `Private label kurti manufacturer ${country.name}`,
      `B2B apparel exporter India to ${country.shortName}`,
      `Handmade ethnic fashion distributor ${country.name}`
    ],
    openGraph: {
      title: `${title} | Al Hayy International`,
      description,
      url: `https://www.alhayyinternational.com/export/${country.slug}`,
      siteName: 'Al Hayy International',
      images: [
        {
          url: 'https://www.alhayyinternational.com/images/gallery-4.jpg',
          width: 1200,
          height: 630,
          alt: `Indian Cotton Kurti & Kaftan Manufacturer Exporting to ${country.name} - Al Hayy`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.alhayyinternational.com/export/${country.slug}`,
    },
  };
}

export default async function CountryExportPage({ params }) {
  const resolvedParams = await params;
  const country = getCountryBySlug(resolvedParams?.country);

  if (!country) {
    notFound();
  }

  const otherCountries = COUNTRIES_DATA.filter((c) => c.slug !== country.slug).slice(0, 12);

  const exportFaqs = [
    {
      question: `How are apparel wholesale orders shipped from our looms in India to ${country.name}?`,
      answer: `All international wholesale consignments destined for ${country.name} are packed in heavy-duty moisture-proof export cartons, vacuum-sealed, and dispatched via DHL Express, FedEx International Priority, or Aramex Air Cargo. Average door-to-door transit time is ${country.shippingTime} with complete online airway bill tracking.`
    },
    {
      question: `What is the Minimum Order Quantity (MOQ) for boutique buyers and private labels in ${country.name}?`,
      answer: `To support growing international boutiques, e-commerce stores, and fashion resellers in ${country.name}, our international export MOQ starts from just 25 to 50 assorted pieces. You can combine pure cotton kurtis, handcrafted kaftans, and co-ord sets across various sizes (S to 3XL) and colors.`
    },
    {
      question: `Do you provide complete customs documentation and Certificate of Origin for ${country.name}?`,
      answer: `Yes! Every export consignment includes a commercial invoice, detailed packing list, Certificate of Origin, and standardized Harmonized System classification (HS Code 6204 / 6206 / 6214) to ensure seamless, zero-delay customs clearance in ${country.name}.`
    },
    {
      question: `Can boutique owners in ${country.name} request custom private labels, neck tags, and barcodes?`,
      answer: `Yes! We provide full OEM & White Label manufacturing services including customized woven brand neck tags, wash care labels, branded hangtags, barcode labeling, and luxury signature rigid gift boxes customized for your boutique brand in ${country.name}.`
    },
    {
      question: `What currency and payment methods are supported for international trade with ${country.name}?`,
      answer: `We support multi-currency invoicing in ${country.currency} or USD ($). Payments can be completed securely via International Bank Wire (SWIFT / Telegraphic Transfer), Razorpay International Multi-Currency Cards (Visa, Mastercard, Amex), and verified corporate remittance.`
    },
    {
      question: `Are the fabrics compliant with international environmental and dye safety standards?`,
      answer: `Absolutely. We use 100% pure combed long-staple cotton, mulberry modal silk, and certified authentic wool dyed exclusively with eco-conscious, azo-free organic dyes compliant with international textile safety standards.`
    },
    {
      question: `Can I order sample pieces or fabric swatches to ${country.name} before placing a bulk order?`,
      answer: `Yes, we offer express Sample Courier Packs (3 to 5 curated pieces) dispatched directly to your boutique address in ${country.name} so you can physically inspect our fabric handfeel, Aari embroidery craftsmanship, and precision stitch quality.`
    },
    {
      question: `How do I connect with the dedicated Al Hayy Global Export Desk for ${country.name}?`,
      answer: `You can reach our International Trade Concierge on WhatsApp at +91 96224 80276 or email us at contact@alhayyinternational.com. We provide instant digital catalogs, export price sheets, and shipping estimates tailored for ${country.name}.`
    }
  ];

  // Schema Markup for Global Export & AI Overview
  const exportSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WholesaleStore',
        name: `Al Hayy International - Apparel Exporter to ${country.name}`,
        url: `https://www.alhayyinternational.com/export/${country.slug}`,
        description: `Direct factory apparel manufacturer & exporter of cotton kurtis, designer co-ord sets, and luxury kaftans to ${country.name}.`,
        telephone: '+91-9622480276',
        priceRange: '₹₹ / $$',
        areaServed: {
          '@type': 'Country',
          name: country.name
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Srinagar',
          addressLocality: 'Srinagar',
          addressRegion: 'Jammu and Kashmir',
          postalCode: '190002',
          addressCountry: 'IN'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.alhayyinternational.com'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Global Export Hub',
            item: 'https://www.alhayyinternational.com/export'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${country.name} Apparel Export`,
            item: `https://www.alhayyinternational.com/export/${country.slug}`
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: exportFaqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      }
    ]
  };

  const whatsappExportInquiryUrl = `https://wa.me/919622480276?text=${encodeURIComponent(
    `Salam Al Hayy International Export Desk, I am a boutique owner / apparel importer in ${country.name} (${country.keyCities}). Please send me your International Export Wholesale Catalog, MOQ, and FOB/Door Delivery Price List in ${country.currency}.`
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#070E1E]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(exportSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#FAF7F2] border-b border-[#EADBCC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-[11px] text-stone-500 flex items-center gap-1.5 overflow-x-auto">
          <Link href="/" className="hover:text-[#AA7E18] transition-colors whitespace-nowrap">Home</Link>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <Link href="/export" className="hover:text-[#AA7E18] transition-colors whitespace-nowrap">Global Export Network</Link>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="text-[#070E1E] font-medium whitespace-nowrap">{country.flag} {country.name}</span>
        </div>
      </div>

      {/* Hero Banner with High-Ticket Global H1 */}
      <section className="relative bg-[#070E1E] text-white py-16 sm:py-24 border-b border-[#D4AF37]/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#070E1E] via-[#0B162C] to-[#070E1E] opacity-90" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102142] border border-[#D4AF37]/40 text-[#F7E7B6] text-xs uppercase tracking-widest font-semibold">
            <Globe2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Global Export Desk • Shipping to {country.name} {country.flag}</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF7F2] leading-tight max-w-4xl">
            Indian Cotton Kurti, Kaftan &amp; Co-ord Set <span className="text-[#D4AF37]">Manufacturer Export to {country.name}</span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed font-light">
            Al Hayy International manufactures master-crafted Kashmiri Aari embroidered kurtis, pure combed 60s cotton kaftans, and designer women co-ord sets. We export directly from our looms in India to boutique retailers, multi-brand fashion stores, and private label distributors across <strong className="text-[#F7E7B6] font-semibold">{country.keyCities}</strong> with insured express air shipping.
          </p>

          {/* Quick Action B2B Export CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={whatsappExportInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-95 group"
            >
              <MessageSquare className="w-4 h-4 text-[#070E1E]" />
              <span>Get {country.shortName} Export Price List on WhatsApp</span>
            </a>

            <Link
              href="/shop"
              className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-[#FAF7F2] font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Explore Live Atelier Styles</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          </div>

          {/* Export Value Badges */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{country.shippingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Low Export MOQ (25-50 Pcs)</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Customs &amp; HS Code Cleared</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>100% Insured Air Cargo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Export Collections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Collections in Demand in this Country */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18]">
                Export Ready Collections
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E] mt-1">
                High-Margin Ethnic Styles for {country.name} Boutiques
              </h2>
            </div>
            <div className="text-xs text-stone-500 font-medium">
              Invoiced in {country.currency} or USD ($)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-[#EADBCC] p-5 shadow-xs flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="h-44 relative rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src="/images/gallery-4.jpg"
                    alt={`Luxury Cotton Kaftans Exporter to ${country.name} - Al Hayy`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#070E1E]/80 text-[#F7E7B6] text-[10px] font-bold uppercase">
                    Resort &amp; Modest
                  </div>
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                  Luxury Handcrafted Kaftans
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Pure cotton and silk kaftans with artisanal neckline embroidery. Hugely popular in {country.name}&apos;s resort, modest, and festive boutique markets.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                <Link href="/shop?category=Kaftaans" className="text-xs font-bold text-[#AA7E18] hover:underline flex items-center gap-1">
                  Browse Styles <ChevronRight className="w-3 h-3" />
                </Link>
                <a
                  href={`https://wa.me/919622480276?text=${encodeURIComponent(`Hi Al Hayy Export Desk, send me Kaftans export pricing for ${country.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#070E1E] hover:text-[#AA7E18]"
                >
                  Export MOQ
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EADBCC] p-5 shadow-xs flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="h-44 relative rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src="/images/gallery-3.jpg"
                    alt={`Designer Women Co-ord Sets Exporter to ${country.name} - Al Hayy`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#070E1E]/80 text-[#F7E7B6] text-[10px] font-bold uppercase">
                    Global Hit
                  </div>
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                  Designer Women Co-ord Sets
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Two-piece coordinated sets tailored in breathable organic cotton and modal silks. Rapid selling item across {country.keyCities}.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                <Link href="/shop?category=co-ord sets" className="text-xs font-bold text-[#AA7E18] hover:underline flex items-center gap-1">
                  Browse Styles <ChevronRight className="w-3 h-3" />
                </Link>
                <a
                  href={`https://wa.me/919622480276?text=${encodeURIComponent(`Hi Al Hayy Export Desk, send me Co-ord sets export pricing for ${country.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#070E1E] hover:text-[#AA7E18]"
                >
                  Export MOQ
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EADBCC] p-5 shadow-xs flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="h-44 relative rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src="/images/gallery-2.jpg"
                    alt={`Pure Cotton Kurtis Manufacturer Export to ${country.name} - Al Hayy`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#070E1E]/80 text-[#F7E7B6] text-[10px] font-bold uppercase">
                    Pure Cotton
                  </div>
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                  Kashmiri Aari Cotton Kurtis
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Authentic needlework kurtis crafted on 60s combed cotton with colorfast azo-free organic dyes compliant with {country.name} regulations.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                <Link href="/shop?category=Tops & Kurtis" className="text-xs font-bold text-[#AA7E18] hover:underline flex items-center gap-1">
                  Browse Styles <ChevronRight className="w-3 h-3" />
                </Link>
                <a
                  href={`https://wa.me/919622480276?text=${encodeURIComponent(`Hi Al Hayy Export Desk, send me Cotton Kurtis export pricing for ${country.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#070E1E] hover:text-[#AA7E18]"
                >
                  Export MOQ
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EADBCC] p-5 shadow-xs flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="h-44 relative rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src="/images/gallery-1.jpg"
                    alt={`Modal Silk Embroidered Jackets Exporter to ${country.name} - Al Hayy`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#070E1E]/80 text-[#F7E7B6] text-[10px] font-bold uppercase">
                    Luxury Silk
                  </div>
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                  Silk Jackets &amp; Pashmina
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Hand-embroidered modal silk jackets and certified Pashmina shawls for high-ticket ethnic bridal and gala events in {country.name}.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                <Link href="/shop?category=Silk jackets" className="text-xs font-bold text-[#AA7E18] hover:underline flex items-center gap-1">
                  Browse Styles <ChevronRight className="w-3 h-3" />
                </Link>
                <a
                  href={`https://wa.me/919622480276?text=${encodeURIComponent(`Hi Al Hayy Export Desk, send me Silk Jackets export pricing for ${country.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#070E1E] hover:text-[#AA7E18]"
                >
                  Export MOQ
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* International Trade Compliance & Logistics Infrastructure */}
        <section className="p-8 sm:p-10 bg-white rounded-3xl border border-[#EADBCC] shadow-xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18]">
              International Logistics &amp; Compliance
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E]">
              Zero-Hassle Customs &amp; Direct Air Cargo to {country.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We eliminate the complexities of cross-border apparel trade. Every shipment dispatched to <strong className="text-stone-900">{country.name}</strong> arrives with standardized international trade documentation:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#AA7E18]">Customs HS Codes</span>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">HS 6204 &amp; 6206 Compliant</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Proper commodity code classification ensuring smooth entry and clear duty calculations in {country.name}.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#AA7E18]">Origin Certificate</span>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">Chamber Certified</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Official Certificate of Origin verifying authentic Indian textile heritage and preferential trade benefits where applicable.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#AA7E18]">Express Cargo</span>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">DHL / FedEx Priority</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Doorstep delivery within {country.shippingTime} with real-time tracking from our Srinagar dispatch hub to {country.keyCities}.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#AA7E18]">Transit Insurance</span>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">100% Comprehensive Cover</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                All consignments are fully insured against loss, moisture, or transit damage, giving your business complete peace of mind.
              </p>
            </div>
          </div>
        </section>

        {/* Export Pricing Tiers & MOQ Breakdown Table */}
        <section className="bg-white rounded-3xl border border-[#EADBCC] p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18]">
                Export Commercial Tiers
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E] mt-1">
                Wholesale Order Tiers for {country.name} Importers
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              Invoiced in {country.currency} / USD ($)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border-collapse">
              <thead>
                <tr className="border-b border-[#EADBCC] bg-[#FAF7F2] text-[#070E1E]">
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Export Tier</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Minimum Quantity</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Category Selection</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Branding &amp; Tags</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Transit Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#070E1E]">Sample Pack / Boutique Test Run</td>
                  <td className="py-3.5 px-4">25 – 50 pieces</td>
                  <td className="py-3.5 px-4">Assorted Kurtis, Kaftans &amp; Sets</td>
                  <td className="py-3.5 px-4">Standard Atelier Tags</td>
                  <td className="py-3.5 px-4 text-[#AA7E18] font-semibold">{country.shippingTime}</td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors bg-[#FAF7F2]/20">
                  <td className="py-3.5 px-4 font-bold text-[#070E1E]">Commercial Boutique Wholesale</td>
                  <td className="py-3.5 px-4">50 – 250 pieces</td>
                  <td className="py-3.5 px-4">Custom size runs &amp; catalog picks</td>
                  <td className="py-3.5 px-4">Custom Brand Neck Tags</td>
                  <td className="py-3.5 px-4 text-[#AA7E18] font-semibold">{country.shippingTime}</td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#070E1E]">Distributor / Multi-Store Chain</td>
                  <td className="py-3.5 px-4">250+ pieces</td>
                  <td className="py-3.5 px-4">Full catalog &amp; exclusive colorways</td>
                  <td className="py-3.5 px-4">Full OEM, Barcodes &amp; Luxury Boxes</td>
                  <td className="py-3.5 px-4 text-[#AA7E18] font-semibold">Priority Air Cargo</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
            <span className="text-xs text-stone-600">
              Need customized sample packs, bespoke color runs, or volume pricing for {country.name}?
            </span>
            <a
              href={whatsappExportInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#102142] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Inquire Export Rates on WhatsApp</span>
            </a>
          </div>
        </section>

        {/* Private Labeling & Custom Manufacturing Block */}
        <section className="p-8 sm:p-10 bg-[#070E1E] text-white rounded-3xl border border-[#D4AF37]/30 shadow-md space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              White Label &amp; OEM Services
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
              Private Labeling &amp; Bespoke Luxury Packaging for {country.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Build your unique boutique brand identity in {country.name} with our master craftsmanship:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-xs">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-serif-luxury text-sm font-bold text-[#F7E7B6]">Custom Brand Neck Tags</h3>
              <p className="text-stone-300 leading-relaxed">
                Add your own woven labels, international size tags, and wash care instructions attached seamlessly before packaging.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-serif-luxury text-sm font-bold text-[#F7E7B6]">Bespoke Sizing &amp; Cuts</h3>
              <p className="text-stone-300 leading-relaxed">
                Tailored silhouette adaptations, modesty specifications, extended size runs (XS to 4XL), or exclusive pantone dye runs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-serif-luxury text-sm font-bold text-[#F7E7B6]">Signature Luxury Gift Packaging</h3>
              <p className="text-stone-300 leading-relaxed">
                Our signature midnight navy rigid gift boxes with gold foil crests, delivering an unforgettable luxury retail experience for your clients in {country.name}.
              </p>
            </div>
          </div>
        </section>

        {/* AI Overview & FAQ Accordion Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18]">
              International Trade Queries
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E]">
              Apparel Export &amp; Wholesale to {country.name} FAQs
            </h2>
            <p className="text-xs text-stone-600">
              Clear answers regarding export compliance, minimum order quantities, shipping times, and multi-currency billing for {country.name}.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {exportFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#EADBCC] p-6 shadow-xs space-y-2"
              >
                <h3 className="font-serif-luxury text-base font-bold text-[#070E1E] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Interlinked International Network */}
        <section className="pt-8 border-t border-[#EADBCC] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#AA7E18]">
            <Globe2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Explore Other International Export Destinations</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {otherCountries.map((c) => (
              <Link
                key={c.slug}
                href={`/export/${c.slug}`}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#070E1E] hover:text-[#F7E7B6] border border-[#EADBCC] text-xs text-stone-700 transition-all font-medium flex items-center gap-1.5"
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </Link>
            ))}
            <Link
              href="/export"
              className="px-3 py-1.5 rounded-lg bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/50 text-xs font-bold transition-all"
            >
              View All 20 Countries &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
