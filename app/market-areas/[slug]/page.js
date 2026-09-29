import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { CITIES_DATA, getCityBySlug } from '@/lib/citiesData';
import { COUNTRIES_DATA, getCountryBySlug } from '@/lib/internationalCountriesData';
import CityWholesalePage, { generateMetadata as generateCityMetadata } from '@/app/wholesale/[city]/page';
import CountryExportPage, { generateMetadata as generateCountryMetadata } from '@/app/export/[country]/page';

export const dynamicParams = true;

// Pre-render all cities and all countries under /market-areas/[slug]
export async function generateStaticParams() {
  const cityParams = CITIES_DATA.map((c) => ({ slug: c.slug }));
  const countryParams = COUNTRIES_DATA.map((c) => ({ slug: c.slug }));
  return [...countryParams, ...cityParams];
}

// Generate dynamic metadata for either country or city
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Check if it's a country
  const country = getCountryBySlug(slug);
  if (country) {
    return generateCountryMetadata({ params: { country: slug } });
  }

  // Check if it's a city
  const city = getCityBySlug(slug);
  if (city) {
    return generateCityMetadata({ params: { city: slug } });
  }

  return {
    title: 'Market Area Supply & Manufacturing | Al Hayy International',
  };
}

export default async function MarketAreaSlugPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // 1. Check if it's an international country
  const country = getCountryBySlug(slug);
  if (country) {
    return <CountryExportPage params={{ country: slug }} />;
  }

  // 2. Check if it's a domestic Indian city
  const city = getCityBySlug(slug);
  if (city) {
    return <CityWholesalePage params={{ city: slug }} />;
  }

  notFound();
}
