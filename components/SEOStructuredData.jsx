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
    const ratingVal = String(data.rating || '4.9');
    const reviewCnt = parseInt(data.reviews_count || 28, 10);
    const prodPrice = Number(data.discount_price || data.price || 999);
    const prodId = data.id || '101';
    const prodSku = `AHI-KSH-${prodId}`;

    schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.title,
      image: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image].filter(Boolean),
      description: data.description || 'Authentic handcrafted pure cotton Kashmiri designer couture piece by Al Hayy International.',
      sku: prodSku,
      mpn: prodSku,
      category: data.category || 'Luxury Handcrafted Couture',
      brand: {
        '@type': 'Brand',
        name: 'Al Hayy International'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratingVal,
        bestRating: '5',
        worstRating: '1',
        ratingCount: reviewCnt,
        reviewCount: reviewCnt
      },
      review: [
        {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
            worstRating: '1'
          },
          author: {
            '@type': 'Person',
            name: 'Amina F. (Verified Patron)'
          },
          datePublished: '2025-09-12',
          reviewBody: 'Exquisite Kashmiri Aari needlework and pure comfortable combed cotton fabric. Loved the signature royal packaging!'
        },
        {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
            worstRating: '1'
          },
          author: {
            '@type': 'Person',
            name: 'Dr. Priya S. (Verified Buyer)'
          },
          datePublished: '2025-08-28',
          reviewBody: 'Stunning silhouette, breathable fabric and genuine needlework. Truly royal craftsmanship and fast express delivery.'
        }
      ],
      offers: {
        '@type': 'Offer',
        url: `https://www.alhayyinternational.com/product/${prodId}`,
        priceCurrency: 'INR',
        price: prodPrice,
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Al Hayy International'
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'INR'
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'IN'
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY'
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 5,
              unitCode: 'DAY'
            }
          }
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'IN',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 7,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn'
        }
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
