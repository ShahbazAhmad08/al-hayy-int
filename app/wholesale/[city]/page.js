import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  CITIES_DATA, 
  getCityBySlug 
} from '@/lib/citiesData';
import { 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Package,
  Scissors,
  HelpCircle,
  Building2,
  ChevronRight,
  Star,
  Award,
  Factory,
  RefreshCw,
  Clock,
  BadgeCheck,
  FileCheck2
} from 'lucide-react';

export const dynamicParams = true;

// Generate static params for pre-rendering top cities
export async function generateStaticParams() {
  return CITIES_DATA.map((city) => ({
    city: city.slug,
  }));
}

// Dynamic SEO metadata per city
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams?.city);
  if (!city) {
    return {
      title: 'Wholesale Cotton Kurtis & Co-ord Sets Manufacturer | Al Hayy International',
    };
  }

  const title = `Women Co-ord Set & Cotton Kurti Manufacturer in ${city.name} | Direct Wholesale Supplier`;
  const description = `Direct factory manufacturer and wholesale supplier of pure cotton embroidered kurtis, designer women co-ord sets, and handcrafted kaftans in ${city.name}, ${city.state}. 100% pure combed 60s cotton, authentic Kashmiri Aari needlework, low MOQ, factory rates & insured air cargo dispatch to ${city.name} boutiques.`;

  return {
    title,
    description,
    keywords: [
      `Women co-ord Set manufacturer in ${city.name}`,
      `Women co-ord Set supplier in ${city.name}`,
      `Cotton Long Kurti manufacturer in ${city.name}`,
      `Cotton Long Kurti supplier in ${city.name}`,
      `Long Cotton Kurti manufacturer in ${city.name}`,
      `Long Cotton Kurti supplier in ${city.name}`,
      `Cotton Short Kurti manufacturer in ${city.name}`,
      `Cotton Short Kurti supplier in ${city.name}`,
      `Embroidered Cotton Kurti manufacturer in ${city.name}`,
      `Cotton Kaftans supplier in ${city.name}`,
      `Cotton Kaftans manufacturer in ${city.name}`,
      `Kashmiri Kurti wholesale in ${city.name}`,
      `Pure cotton kurti manufacturer ${city.state}`,
      `B2B kurti wholesale market ${city.name}`,
      `Private label ethnic wear manufacturer ${city.name}`
    ],
    openGraph: {
      title: `${title} | Al Hayy International`,
      description,
      url: `https://www.alhayyinternational.com/wholesale/${city.slug}`,
      siteName: 'Al Hayy International',
      images: [
        {
          url: 'https://www.alhayyinternational.com/images/gallery-4.jpg',
          width: 1200,
          height: 630,
          alt: `Cotton Kurti and Co-ord Set Wholesale Manufacturer in ${city.name} - Al Hayy International`,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.alhayyinternational.com/wholesale/${city.slug}`,
    },
  };
}

export default async function CityWholesalePage({ params }) {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams?.city);

  if (!city) {
    notFound();
  }

  const otherCities = CITIES_DATA.filter((c) => c.slug !== city.slug).slice(0, 16);

  const faqs = [
    {
      question: `Are you a direct manufacturer or a middleman trader for ${city.name} apparel retailers?`,
      answer: `Al Hayy International is a verified direct factory manufacturer based at our flagship atelier in Srinagar, Kashmir. We weave, dye, embroider (master Kashmiri Aari needlework), cut, and tailor all garments in-house. We supply directly to boutiques, multi-brand outlets, and online fashion brands in ${city.name} at true loom-direct wholesale prices without broker commissions.`
    },
    {
      question: `What is the Minimum Order Quantity (MOQ) for boutique orders in ${city.name}?`,
      answer: `We support both emerging boutique owners and established multi-store retailers in ${city.name} with flexible low MOQs starting from just 20 to 50 pieces. You can mix and match assorted categories, silhouettes, trending colors, and sizes from Small (S) to Plus Size (3XL).`
    },
    {
      question: `How fast is wholesale consignment delivery to ${city.name}, ${city.state}?`,
      answer: `All consignments for ${city.name} are packed in heavy-duty tamper-proof export cartons and dispatched via priority air cargo and express surface transit, reaching your shop or warehouse in ${city.name} within ${city.deliveryTime} with end-to-end real-time tracking.`
    },
    {
      question: `What fabric quality and yarn count do you use for pure cotton kurtis and co-ord sets?`,
      answer: `We use 100% pure combed 60s cambric cotton, breathable mulmul, modal silk, and raw silk with colorfast azo-free organic dyes. Every fabric undergoes pre-shrinkage treatment, ensuring zero shrinkage, vibrant color longevity, and exceptional drape tailored for ${city.name}'s climate.`
    },
    {
      question: `Can boutique retailers in ${city.name} get private labeling, custom neck tags, and sample packs?`,
      answer: `Yes! We provide single-piece sample courier packs for quality evaluation before placing bulk orders. Furthermore, we provide full OEM / Private Label services including customized woven labels, branded hangtags, barcode stickers, and bespoke signature gift packaging customized with your store name in ${city.name}.`
    },
    {
      question: `What are the payment terms and safety guarantees for ${city.name} wholesale buyers?`,
      answer: `We provide 100% transparent and verified billing. Payments are accepted via Direct Bank NEFT/RTGS, UPI Business, and verified payment gateways with digital invoices and GST compliance. Every consignment is 100% transit-insured against loss or transit damage.`
    },
    {
      question: `Do you offer custom plus sizes (XXL to 5XL) and bespoke bridal collections for ${city.name}?`,
      answer: `Yes, our master tailors customize size runs up to 5XL upon request. We also handcraft bespoke bridal trousseau collections, royal velvet pherans, and heavy Aari embroidered wedding suits tailored specifically for high-ticket client orders in ${city.name}.`
    },
    {
      question: `How can I receive the latest wholesale digital lookbook and price list for ${city.name}?`,
      answer: `You can connect directly with our Dedicated B2B Wholesale Desk on WhatsApp at +91 96224 80276 or call us directly. We share daily new release catalogs, wholesale rate sheets, and high-resolution marketing media for your store.`
    }
  ];

  // Schema Markup for AI Overviews, Local Business, and FAQs
  const wholesaleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WholesaleStore',
        name: `Al Hayy International - Wholesale Apparel Supplier & Manufacturer ${city.name}`,
        url: `https://www.alhayyinternational.com/wholesale/${city.slug}`,
        description: `Direct factory manufacturer & wholesale supplier of cotton kurtis, designer co-ord sets, and luxury kaftans serving ${city.name}, ${city.state}.`,
        telephone: '+91-9622480276',
        priceRange: '₹₹',
        areaServed: {
          '@type': 'City',
          name: city.name,
          containedInPlace: {
            '@type': 'State',
            name: city.state
          }
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
            name: 'Wholesale Market Network',
            item: 'https://www.alhayyinternational.com/wholesale'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${city.name} Wholesale Apparel`,
            item: `https://www.alhayyinternational.com/wholesale/${city.slug}`
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
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

  const whatsappInquiryUrl = `https://wa.me/919622480276?text=${encodeURIComponent(
    `Salam Al Hayy International, I am an apparel retailer/boutique owner in ${city.name}, ${city.state}. Please send me your wholesale catalog, MOQ details, and factory price list for Cotton Kurtis & Co-ord Sets.`
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#070E1E]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wholesaleSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#FAF7F2] border-b border-[#EADBCC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-[11px] text-stone-500 flex items-center gap-1.5 overflow-x-auto">
          <Link href="/" className="hover:text-[#AA7E18] transition-colors whitespace-nowrap">Home</Link>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <Link href="/wholesale" className="hover:text-[#AA7E18] transition-colors whitespace-nowrap">Wholesale Market Network</Link>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="text-[#070E1E] font-medium whitespace-nowrap">{city.name} ({city.state})</span>
        </div>
      </div>

      {/* Hero Banner with High Intent H1 & Visual Showcase */}
      <section className="relative bg-[#070E1E] text-white py-14 sm:py-20 border-b border-[#D4AF37]/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#070E1E] via-[#0B162C] to-[#070E1E] opacity-90" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#102142] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Context & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102142] border border-[#D4AF37]/40 text-[#F7E7B6] text-xs uppercase tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Direct Manufacturer Supply • {city.name}, {city.state}</span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF7F2] leading-tight">
                Women Co-ord Set &amp; Pure Cotton Kurti <span className="text-[#D4AF37]">Manufacturer in {city.name}</span>
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                Al Hayy International is an authentic direct loom manufacturer and wholesale supplier of pure combed cotton embroidered kurtis, handcrafted cotton kaftans, and designer women co-ord sets. Supplying leading boutique owners, retail showrooms, and online fashion entrepreneurs across <strong className="text-[#F7E7B6] font-semibold">{city.name}</strong> with factory direct pricing and fast insured cargo dispatch.
              </p>

              {/* Quick Action B2B CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-4 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-95 group"
                >
                  <MessageSquare className="w-4 h-4 text-[#070E1E]" />
                  <span>Get Wholesale Price List on WhatsApp</span>
                </a>

                <Link
                  href="/shop"
                  className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-[#FAF7F2] font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Explore Live Catalog</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </Link>
              </div>

              {/* Key Trust Badges */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Direct Loom Rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{city.deliveryTime} to {city.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Low MOQ (20-50 Pcs)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Pure 60s Combed Cotton</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Luxury Apparel Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Showcase Card */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl bg-[#0B162C]">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/images/gallery-3.jpg"
                      alt={`Women Co-ord Set & Pure Cotton Kurti Manufacturer in ${city.name} - Al Hayy International`}
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E] via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Overlay Bottom Content */}
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070E1E]/90 border border-[#D4AF37]/60 text-[#F7E7B6] text-[11px] font-bold backdrop-blur-md">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>Srinagar Looms to {city.name} Dispatch</span>
                    </div>
                    <p className="text-xs text-[#FAF7F2] font-serif-luxury leading-snug">
                      Direct factory wholesale supply of luxury Kashmiri Aari needlework &amp; designer silhouettes to <strong className="text-[#D4AF37]">{city.name}</strong>.
                    </p>
                  </div>
                </div>

                {/* Floating Top-Left Card */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-[#070E1E]/95 border border-[#D4AF37]/40 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center gap-2.5 max-w-[200px]">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center text-[#070E1E] shrink-0 font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Fast Cargo</span>
                    <span className="text-xs font-bold text-[#F7E7B6] leading-tight block">{city.deliveryTime} Delivery</span>
                  </div>
                </div>

                {/* Floating Bottom-Right Card */}
                <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-[#070E1E]/95 border border-[#D4AF37]/40 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center gap-2.5 max-w-[210px]">
                  <div className="w-9 h-9 rounded-xl bg-[#102142] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Zero Middlemen</span>
                    <span className="text-xs font-bold text-white leading-tight block">Direct Factory Rates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Product Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Category Showcase Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18]">
                Wholesale Product Collections
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E] mt-1">
                Trending High-Repeat Apparel for {city.name} Boutiques
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#AA7E18] hover:text-[#070E1E] flex items-center gap-1 transition-colors"
            >
              <span>View All 50+ Live Styles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Card 1 */}
            <div className="bg-white rounded-2xl border border-[#EADBCC] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="h-44 relative rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src="/images/gallery-2.jpg"
                    alt={`Pure Cotton Kurtis Manufacturer in ${city.name} - Al Hayy International`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#070E1E]/80 text-[#F7E7B6] text-[10px] font-bold uppercase">
                    B2B Wholesale
                  </div>
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                  Pure Cotton &amp; Embroidered Kurtis
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Long, straight, and short cotton kurtis adorned with master Kashmiri Aari needlework. Ideal for daily, office, and festive retail in {city.name}.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href="/shop?category=Tops & Kurtis"
                  className="text-xs font-bold text-[#AA7E18] hover:underline flex items-center gap-1"
                >
                  <span>Browse Styles</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
                <a
                  href={`https://wa.me/919622480276?text=${encodeURIComponent(`Hi Al Hayy, send me wholesale rates for Pure Cotton Kurtis in ${city.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#070E1E] hover:text-[#AA7E18]"
                >
                  Inquire Bulk
                </a>
              </div>
            </div>

            {/* Category Card 2 */}
            <div className="bg-white rounded-2xl border border-[#EADBCC] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="h-44 relative rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src="/images/gallery-3.jpg"
                    alt={`Women Co-ord Sets Manufacturer in ${city.name} - Al Hayy`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#070E1E]/80 text-[#F7E7B6] text-[10px] font-bold uppercase">
                    Trending Hit
                  </div>
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                  Designer Women Co-ord Sets
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Two-piece tailored cotton and modal sets with contemporary silhouettes tailored for high margin repeat sales in {city.name} boutiques.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href="/shop?category=co-ord sets"
                  className="text-xs font-bold text-[#AA7E18] hover:underline flex items-center gap-1"
                >
                  <span>Browse Styles</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
                <a
                  href={`https://wa.me/919622480276?text=${encodeURIComponent(`Hi Al Hayy, send me wholesale rates for Co-ord Sets in ${city.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#070E1E] hover:text-[#AA7E18]"
                >
                  Inquire Bulk
                </a>
              </div>
            </div>

            {/* Category Card 3 */}
            <div className="bg-white rounded-2xl border border-[#EADBCC] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="h-44 relative rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src="/images/gallery-4.jpg"
                    alt={`Luxury Handcrafted Cotton Kaftans Supplier in ${city.name} - Al Hayy`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#070E1E]/80 text-[#F7E7B6] text-[10px] font-bold uppercase">
                    Resort &amp; Luxury
                  </div>
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                  Handcrafted Cotton Kaftans
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Breezy pure cotton &amp; silk kaftans featuring handcrafted neckline embroidery and versatile flowy silhouettes for {city.name} clients.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href="/shop?category=Kaftaans"
                  className="text-xs font-bold text-[#AA7E18] hover:underline flex items-center gap-1"
                >
                  <span>Browse Styles</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
                <a
                  href={`https://wa.me/919622480276?text=${encodeURIComponent(`Hi Al Hayy, send me wholesale rates for Cotton Kaftans in ${city.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#070E1E] hover:text-[#AA7E18]"
                >
                  Inquire Bulk
                </a>
              </div>
            </div>

            {/* Category Card 4 */}
            <div className="bg-white rounded-2xl border border-[#EADBCC] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="h-44 relative rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src="/images/gallery-1.jpg"
                    alt={`Modal Silk Jackets and Shawls Supplier in ${city.name} - Al Hayy`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#070E1E]/80 text-[#F7E7B6] text-[10px] font-bold uppercase">
                    Festive &amp; Bridal
                  </div>
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                  Silk Jackets &amp; Pashmina Shawls
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Hand-embroidered modal silk jackets and Changthangi Pashmina shawls for high-ticket festive and wedding season retail in {city.name}.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href="/shop?category=Silk jackets"
                  className="text-xs font-bold text-[#AA7E18] hover:underline flex items-center gap-1"
                >
                  <span>Browse Styles</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
                <a
                  href={`https://wa.me/919622480276?text=${encodeURIComponent(`Hi Al Hayy, send me wholesale rates for Silk Jackets in ${city.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#070E1E] hover:text-[#AA7E18]"
                >
                  Inquire Bulk
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* In-depth Fabric & Technical Specifications */}
        <section className="p-8 sm:p-10 bg-white rounded-3xl border border-[#EADBCC] shadow-xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18]">
              Textile Mastery &amp; Material Standards
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E]">
              Technical Fabric Standards for {city.name} Wholesale Sourcing
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every garment manufactured at Al Hayy International undergoes rigorous yarn grading, pre-shrinkage wash, and colorfastness testing to ensure that your boutique patrons in <strong className="text-stone-900">{city.name}</strong> experience unmatched softness, durability, and breathability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#AA7E18]">Yarn Quality</span>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">60s Combed Cambric Cotton</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Superfine long-staple combed cotton offering a featherlight feel, zero pilling, and natural breathability suited for {city.name}&apos;s climate.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#AA7E18]">Needlework Art</span>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">Traditional Aari Needlework</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Single-strand hooked needle embroidery hand-stitched by multi-generational Kashmiri artisans. Authentic, delicate, and durable.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#AA7E18]">Dye Safety</span>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">Azo-Free Organic Dyes</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Eco-conscious certified dyes with superior wash-fastness and light-fastness ratings (Grade 4+), preventing color bleeding.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#AA7E18]">Fit &amp; Sizing</span>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">Precision Indian Size Matrix</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Standardized Indian size grading from S (36) to 3XL (46) with generous seam margins for effortless retail alterations in {city.name}.
              </p>
            </div>
          </div>
        </section>

        {/* 4-Stage Manufacturing & Quality Assurance Workflow */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18]">
              Factory Operations
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E]">
              Our 4-Stage Sourcing &amp; Quality Inspection Process
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              How we ensure seamless, zero-defect wholesale dispatches to your retail shop in {city.name}:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-[#EADBCC] p-6 space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#070E1E] text-[#F7E7B6] font-bold text-xs flex items-center justify-center">
                01
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">
                Fabric Selection &amp; Weaving
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We select premium pure cotton and mulberry modal silks, verifying GSM consistency, weave density, and pre-treating against shrinkage.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EADBCC] p-6 space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#070E1E] text-[#F7E7B6] font-bold text-xs flex items-center justify-center">
                02
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">
                Artisanal Aari Embroidery
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Skilled master craftsmen hand-embroider intricate botanical motifs, paisleys, and floral jaals across necklines, yokes, and sleeves.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EADBCC] p-6 space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#070E1E] text-[#F7E7B6] font-bold text-xs flex items-center justify-center">
                03
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">
                Precision Tailoring &amp; QC
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every unit is stitched with reinforced lock-stitches, measured against our strict spec sheets, and checked for thread trims and seam strength.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EADBCC] p-6 space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#070E1E] text-[#F7E7B6] font-bold text-xs flex items-center justify-center">
                04
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#070E1E]">
                Insured Cargo to {city.name}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Garments are individually poly-bagged, master-carton packed, transit-insured, and dispatched for prompt {city.deliveryTime} arrival in {city.name}.
              </p>
            </div>
          </div>
        </section>

        {/* Wholesale Pricing Tiers & MOQ Breakdown Table */}
        <section className="bg-white rounded-3xl border border-[#EADBCC] p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18]">
                Transparent Commercial Structure
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E] mt-1">
                Wholesale Order Tiers for {city.name} Retailers
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              Direct Factory Invoicing • GST Compliant
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border-collapse">
              <thead>
                <tr className="border-b border-[#EADBCC] bg-[#FAF7F2] text-[#070E1E]">
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Buyer Tier</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Minimum Quantity</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Category Mix</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Private Labeling</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Dispatch Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#070E1E]">Boutique Starter / Sample Pack</td>
                  <td className="py-3.5 px-4">20 – 50 pieces</td>
                  <td className="py-3.5 px-4">Kurtis, Kaftans &amp; Co-ords assorted</td>
                  <td className="py-3.5 px-4">Standard Atelier Tags</td>
                  <td className="py-3.5 px-4 text-[#AA7E18] font-semibold">{city.deliveryTime}</td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors bg-[#FAF7F2]/20">
                  <td className="py-3.5 px-4 font-bold text-[#070E1E]">Retail Store Wholesale</td>
                  <td className="py-3.5 px-4">50 – 200 pieces</td>
                  <td className="py-3.5 px-4">Custom size sets &amp; catalog picks</td>
                  <td className="py-3.5 px-4">Custom Store Tags available</td>
                  <td className="py-3.5 px-4 text-[#AA7E18] font-semibold">{city.deliveryTime}</td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#070E1E]">Multi-Outlet / Distributor</td>
                  <td className="py-3.5 px-4">200+ pieces</td>
                  <td className="py-3.5 px-4">Full catalog &amp; exclusive color runs</td>
                  <td className="py-3.5 px-4">Full OEM &amp; Branded Gift Boxes</td>
                  <td className="py-3.5 px-4 text-[#AA7E18] font-semibold">Priority Air Transit</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
            <span className="text-xs text-stone-600">
              Need custom sample packs or personalized volume quotations for your {city.name} outlet?
            </span>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#102142] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Inquire Custom MOQ on WhatsApp</span>
            </a>
          </div>
        </section>

        {/* Private Labeling & Custom Manufacturing Block */}
        <section className="p-8 sm:p-10 bg-[#070E1E] text-white rounded-3xl border border-[#D4AF37]/30 shadow-md space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Bespoke Manufacturing Services
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
              White Label, Private Branding &amp; Custom Sizing for {city.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Are you building your own designer label in {city.name}? We provide comprehensive white-labeling solutions:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-xs">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-serif-luxury text-sm font-bold text-[#F7E7B6]">Custom Neck Tags &amp; Labels</h3>
              <p className="text-stone-300 leading-relaxed">
                Add your own woven brand labels, wash care tags, and barcoded inventory labels attached seamlessly at our factory.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-serif-luxury text-sm font-bold text-[#F7E7B6]">Exclusive Colorways &amp; Sizes</h3>
              <p className="text-stone-300 leading-relaxed">
                Choose bespoke pantone shades, tailored sleeve cuts, length alterations, or extended plus-size matrix tailored for your clientele.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-serif-luxury text-sm font-bold text-[#F7E7B6]">Signature Luxury Gift Boxes</h3>
              <p className="text-stone-300 leading-relaxed">
                Opt for our royal midnight navy rigid boxes with gold foil embossing, delivering an unmatched luxury unboxing experience for your patrons.
              </p>
            </div>
          </div>
        </section>

        {/* AI Overview & FAQ Accordion Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18]">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#070E1E]">
              B2B Wholesale &amp; Manufacturing in {city.name}
            </h2>
            <p className="text-xs text-stone-600">
              Clear answers regarding ordering, minimum quantities, fabric quality, and delivery timelines to {city.name}.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
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

        {/* Interlinked Cities Network */}
        <section className="pt-8 border-t border-[#EADBCC] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#AA7E18]">
            <Building2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Explore Other Wholesale Supply Centers Across India</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {otherCities.map((otherCity) => (
              <Link
                key={otherCity.slug}
                href={`/wholesale/${otherCity.slug}`}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#070E1E] hover:text-[#F7E7B6] border border-[#EADBCC] text-xs text-stone-700 transition-all font-medium"
              >
                {otherCity.name} ({otherCity.state})
              </Link>
            ))}
            <Link
              href="/wholesale"
              className="px-3 py-1.5 rounded-lg bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/50 text-xs font-bold transition-all"
            >
              View All 60+ Cities &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
