import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById, getProducts, getLookbookReels } from '@/lib/api';
import SEOStructuredData from '@/components/SEOStructuredData';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

// Dynamic SEO Metadata for every product
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams?.id;
  
  let product = null;
  try {
    product = await getProductById(productId);
  } catch (e) {
    product = null;
  }

  if (!product) {
    return {
      title: 'Handcrafted Kashmiri Couture Creation | Al Hayy International',
      description: 'Discover luxury handcrafted pure cotton kurtis, kaftans, and designer co-ord sets by Al Hayy International.'
    };
  }

  const title = `${product.title} - Handcrafted Kashmiri Couture | Al Hayy International`;
  const cleanDesc = (product.description || '').replace(/\s+/g, ' ').trim();
  const description = cleanDesc.length > 150 
    ? `${cleanDesc.slice(0, 150)}... Handcrafted Kashmiri Aari needlework, pure natural fabric, free express insured shipping.`
    : `${cleanDesc} Handcrafted with authentic Kashmiri Aari needlework in Srinagar. Luxury royal packaging & worldwide insured delivery.`;

  const canonicalUrl = `https://www.alhayyinternational.com/product/${product.id}`;

  return {
    title,
    description,
    keywords: [
      product.title,
      `${product.category || 'Kurti'} by Al Hayy`,
      'Kashmiri Kurti Export to Dubai UAE',
      'Cotton Kaftan Wholesale Dubai',
      'Indian Ethnic Wear USA Wholesale',
      'Handcrafted Kurtis Exporter UK',
      'Pure Cotton Kurti Exporter Europe',
      'Srinagar Artisan Luxury Apparel'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Al Hayy International',
      images: [
        {
          url: product.image,
          width: 900,
          height: 1200,
          alt: `${product.title} - Al Hayy International Kashmiri Couture`,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams?.id;

  let product = null;
  let allProducts = [];
  let lookbook = [];

  try {
    const [item, all, reels] = await Promise.all([
      getProductById(productId),
      getProducts(),
      getLookbookReels()
    ]);
    product = item;
    allProducts = all || [];
    lookbook = reels || [];
  } catch (err) {
    console.error('Server error fetching product:', err);
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: product?.category || 'Atelier', url: `/shop?category=${encodeURIComponent(product?.category || 'All')}` },
    { name: product?.title || 'Creation', url: `/product/${productId}` }
  ];

  const productFAQs = [
    {
      question: `Is the needlework on ${product?.title || 'this garment'} authentic Kashmiri Aari embroidery?`,
      answer: `Yes, 100%. Every piece crafted by Al Hayy International features genuine Kashmiri Aari needlework meticulously hand-embroidered by master generational artisans in Srinagar, Kashmir. We do not use digital or printed copies.`
    },
    {
      question: `Do you export to Dubai (UAE), USA, UK, Canada and European boutiques?`,
      answer: `Yes! Dubai is our primary Middle East export hub with express 3-day air cargo to Dubai, Abu Dhabi & Sharjah. We also dispatch door-to-door insured air shipments to the United States (California, NY, Texas, Chicago), United Kingdom (London, Manchester), Canada (Toronto) and Western Europe (Germany, France, Netherlands, Switzerland).`
    },
    {
      question: `What fabric is used for ${product?.title || 'this creation'}?`,
      answer: `This garment is tailored from ${product?.fabric || '100% pure combed 60s count breathable cotton and fine handloom blends'}, designed for all-season comfort, superior drape, and long-lasting luxury durability complying with European azo-free textile standards.`
    },
    {
      question: `How fast is express delivery to Dubai and international destinations?`,
      answer: `We dispatch within 24-48 hours from our Srinagar atelier. Dubai and GCC orders arrive in 3-4 business days via express air cargo. USA, UK, Canada and Europe arrive in 4-6 business days with full online tracking and customs documentation.`
    }
  ];

  return (
    <>
      {product && (
        <>
          <SEOStructuredData type="Product" data={product} />
          <SEOStructuredData type="BreadcrumbList" data={breadcrumbs} />
          <SEOStructuredData type="FAQPage" data={productFAQs} />
        </>
      )}

      <ProductDetailClient
        initialProduct={product}
        initialAllProducts={allProducts}
        initialLookbook={lookbook}
        productId={productId}
      />
    </>
  );
}
