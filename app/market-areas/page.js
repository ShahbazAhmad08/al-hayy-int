import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COUNTRIES_DATA } from '@/lib/internationalCountriesData';
import { CITIES_DATA } from '@/lib/citiesData';
import { 
  Globe2, 
  Building2, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Plane, 
  Truck, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  ArrowRight,
  Package,
  Layers,
  ChevronRight,
  HelpCircle,
  Scissors
} from 'lucide-react';

export const metadata = {
  title: 'Market Areas & Global Supply Network | Al Hayy International',
  description: 'Explore the complete domestic and international market network of Al Hayy International. Sourcing pure cotton kurtis, handcrafted kaftans, and designer co-ord sets across 20+ countries worldwide and 60+ Indian commercial hubs.',
  keywords: [
    'Al Hayy Market Areas',
    'Global Apparel Export Destinations',
    'Wholesale Kurti Supply Network India',
    'Cotton Kaftans Export Countries',
    'Indian Ethnic Wear Worldwide Exporter',
    'B2B Manufacturing Supply Hubs'
  ],
  alternates: {
    canonical: 'https://www.alhayyinternational.com/market-areas',
  },
};

export default function MarketAreasPage() {
  const whatsappInquiryUrl = `https://wa.me/919622480276?text=${encodeURIComponent(
    'Salam Al Hayy International B2B Desk, I would like to inquire about wholesale apparel supply and export catalogs for my boutique location.'
  )}`;

  // Group domestic cities by State
  const citiesByState = CITIES_DATA.reduce((acc, city) => {
    if (!acc[city.state]) {
      acc[city.state] = [];
    }
    acc[city.state].push(city);
    return acc;
  }, {});

  // Group international countries by Region
  const countriesByRegion = COUNTRIES_DATA.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {});

  const marketSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Al Hayy International - Market Areas & Global Supply Network',
    url: 'https://www.alhayyinternational.com/market-areas',
    description: 'Complete domestic and global market destinations for pure cotton kurtis, handcrafted kaftans, and designer co-ord sets.',
    breadcrumb: {
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
          name: 'Market Areas',
          item: 'https://www.alhayyinternational.com/market-areas'
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#070E1E]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#FAF7F2] border-b border-[#EADBCC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-[11px] text-stone-500 flex items-center gap-1.5 overflow-x-auto">
          <Link href="/" className="hover:text-[#AA7E18] transition-colors whitespace-nowrap">Home</Link>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="text-[#070E1E] font-medium whitespace-nowrap">Market Areas &amp; Supply Network</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="relative bg-[#070E1E] text-white py-16 sm:py-24 border-b border-[#D4AF37]/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#070E1E] via-[#0B162C] to-[#070E1E] opacity-95" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102142] border border-[#D4AF37]/40 text-[#F7E7B6] text-xs uppercase tracking-widest font-semibold">
            <Globe2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Global Export &amp; Pan-India Loom Network</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#FAF7F2] leading-tight max-w-3xl">
            Our Dedicated <span className="text-[#D4AF37]">Market Areas</span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
            Al Hayy International manufactures and delivers pure cotton embroidered kurtis, handcrafted kaftans, and designer co-ord sets directly to boutiques and retailers across 20+ international export countries and over 60+ commercial textile cities in India.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-[#070E1E]" />
              <span>Connect with B2B Concierge: +91 96224 80276</span>
            </a>

            <Link
              href="/shop"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-[#FAF7F2] font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Explore Live Catalog</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          </div>

          {/* Quick Jump Anchors */}
          <div className="pt-6 flex items-center gap-4 text-xs">
            <a href="#international-countries" className="text-[#F7E7B6] hover:underline flex items-center gap-1 font-semibold">
              <span>1. International Countries (20+)</span>
              <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
            </a>
            <span className="text-stone-600">•</span>
            <a href="#domestic-cities" className="text-[#F7E7B6] hover:underline flex items-center gap-1 font-semibold">
              <span>2. Pan-India Cities (60+)</span>
              <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">

        {/* SECTION 1: INTERNATIONAL COUNTRIES */}
        <section id="international-countries" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EADBCC] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18] mb-1">
                <Plane className="w-4 h-4 text-[#D4AF37]" />
                <span>Global Export Destinations</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#070E1E]">
                International Export Countries (20+)
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                Direct loom export with express air cargo, customs clearance (HS 6204/6206), and multi-currency billing. Click on any country to view dedicated export pricing, MOQ, and shipping schedules.
              </p>
            </div>
            <div className="text-xs text-stone-500 font-mono bg-white px-4 py-2 rounded-xl border border-[#EADBCC] shadow-xs">
              {COUNTRIES_DATA.length} Countries Active
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(countriesByRegion).map(([region, countries]) => (
              <div key={region} className="bg-white rounded-3xl border border-[#EADBCC] p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Globe2 className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                    {region}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {countries.map((country) => (
                    <Link
                      key={country.slug}
                      href={`/export/${country.slug}`}
                      className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] hover:border-[#D4AF37] hover:bg-[#070E1E] hover:text-[#FAF7F2] transition-all group flex flex-col justify-between shadow-xs hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif-luxury font-bold text-sm text-[#070E1E] group-hover:text-[#F7E7B6] flex items-center gap-1.5">
                            <span className="text-base">{country.flag}</span>
                            <span>{country.name}</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                        </div>
                        <span className="block text-[11px] text-stone-500 group-hover:text-stone-300 mt-1 line-clamp-1">
                          {country.keyCities}
                        </span>
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-200/60 group-hover:border-white/10 text-[10px] text-[#AA7E18] group-hover:text-[#D4AF37] font-semibold flex items-center justify-between">
                        <span>Transit: {country.shippingTime.split('(')[0]}</span>
                        <span>{country.currency.split(' ')[0]}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: PAN-INDIA CITIES */}
        <section id="domestic-cities" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EADBCC] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#AA7E18] mb-1">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Domestic Supply Network</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#070E1E]">
                Pan-India Wholesale &amp; Manufacturing Hubs (60+ Cities)
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                Direct factory supply to boutiques, retail stores, and online sellers across Indian states with low MOQ and insured dispatch. Click on any city to open its dedicated wholesale page.
              </p>
            </div>
            <div className="text-xs text-stone-500 font-mono bg-white px-4 py-2 rounded-xl border border-[#EADBCC] shadow-xs">
              {CITIES_DATA.length} Cities Active
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(citiesByState).map(([state, cities]) => (
              <div key={state} className="bg-white rounded-3xl border border-[#EADBCC] p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                    {state}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/wholesale/${city.slug}`}
                      className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] hover:border-[#D4AF37] hover:bg-[#070E1E] hover:text-[#FAF7F2] transition-all group flex flex-col justify-between shadow-xs hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif-luxury font-bold text-sm text-[#070E1E] group-hover:text-[#F7E7B6]">
                            {city.name}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                        </div>
                        <span className="block text-[11px] text-stone-500 group-hover:text-stone-300 mt-1">
                          {city.hubType}
                        </span>
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-200/60 group-hover:border-white/10 text-[10px] text-[#AA7E18] group-hover:text-[#D4AF37] font-semibold flex items-center justify-between">
                        <span>Delivery: {city.deliveryTime}</span>
                        <span>Low MOQ</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
