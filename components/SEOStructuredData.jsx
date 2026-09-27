import React from 'react';

export default function SEOStructuredData({ type = 'Organization', data = {} }) {
  let schema = {};

  if (type === 'Organization') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Al Hayy Kashmir',
      url: 'https://www.alhayyinternational.com',
      logo: 'https://www.alhayyinternational.com/logo.png',
      description: 'Authentic Kashmiri Heritage & Luxury Handcrafted Apparel, Kurtis, Kaftans, and Pashmina.',
      sameAs: [
        'https://www.facebook.com/alhayykashmir',
        'https://www.instagram.com/alhayykashmir',
        'https://www.tiktok.com/@alhayykashmir',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9876543210',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Urdu']
      }
    };
  } else if (type === 'Product' && data) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.title,
      image: Array.isArray(data.images) ? data.images : [data.image],
      description: data.description,
      brand: {
        '@type': 'Brand',
        name: 'Al Hayy Kashmir'
      },
      offers: {
        '@type': 'Offer',
        url: `https://www.alhayyinternational.com/product/${data.id}`,
        priceCurrency: 'INR',
        price: data.discount_price || data.price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Al Hayy Kashmir'
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.rating || '4.9',
        reviewCount: data.reviews_count || '25'
      }
    };
  } else if (type === 'BreadcrumbList' && Array.isArray(data)) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `https://www.alhayyinternational.com${item.url}`
      }))
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
