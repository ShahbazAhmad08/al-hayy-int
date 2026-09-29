import React from 'react';

export default function SEOStructuredData({ type = 'Organization', data = {} }) {
  let schema = {};

  if (type === 'Organization') {
    schema = {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'WholesaleStore', 'ClothingStore'],
      name: 'Al Hayy International',
      alternateName: 'Al Hayy Kashmir Couture & Apparel Manufacturer',
      url: 'https://www.alhayyinternational.com',
      logo: 'https://www.alhayyinternational.com/logo.avif',
      image: 'https://www.alhayyinternational.com/images/gallery-4.jpg',
      description: 'Luxury Handcrafted Designer Apparel, Pure Cotton Embroidered Kurtis, Kaftans, and Designer Co-ord Sets Manufacturer & Wholesale Supplier.',
      telephone: '+91-9622480276',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Srinagar',
        addressLocality: 'Srinagar',
        addressRegion: 'Jammu and Kashmir',
        postalCode: '190002',
        addressCountry: 'IN'
      },
      sameAs: [
        'https://www.instagram.com/Alhayyofficial/',
        'https://www.linkedin.com/company/alhayykashmir/'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9622480276',
        contactType: 'customer service',
        areaServed: ['IN', 'AE', 'US', 'GB', 'CA', 'AU'],
        availableLanguage: ['English', 'Hindi', 'Urdu', 'Kashmiri']
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
        name: 'Al Hayy International'
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
          name: 'Al Hayy International'
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
  } else if (type === 'FAQPage' && Array.isArray(data)) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
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
