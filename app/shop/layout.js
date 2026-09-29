export const metadata = {
  title: 'Shop All Kashmiri Handcrafted Collections | Al Hayy International',
  description: 'Explore pure cotton embroidered kurtis, flowing kaftans, contemporary co-ords, and fine silk jackets handcrafted in Srinagar by Al Hayy International.',
  openGraph: {
    title: 'Shop Luxury Kurtis, Kaftans & Silk Jackets | Al Hayy International',
    description: 'Explore pure cotton embroidered kurtis, flowing kaftans, and fine silk jackets handcrafted in Srinagar.',
    url: 'https://www.alhayyinternational.com/shop',
    images: [
      {
        url: 'https://www.alhayyinternational.com/images/gallery-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Al Hayy International Handcrafted Kurtis and Kaftans Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Luxury Kurtis & Kaftans | Al Hayy International',
    description: 'Explore handcrafted pure cotton kurtis, kaftans, and fine silk jackets.',
    images: ['https://www.alhayyinternational.com/images/gallery-1.jpg'],
  },
};

export default function ShopLayout({ children }) {
  return children;
}
