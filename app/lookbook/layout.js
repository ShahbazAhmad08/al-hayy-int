export const metadata = {
  title: 'Atelier Visual Lookbook & Archival Silhouettes | Al Hayy International',
  description: 'Immerse in the Al Hayy visual lookbook. High-resolution captures of fluid kaftans, handcrafted kurtis, modal silk jackets, and authentic valley textures.',
  openGraph: {
    title: 'Atelier Visual Lookbook | Al Hayy International',
    description: 'High-resolution captures of fluid kaftans, handcrafted kurtis, modal silk jackets, and authentic valley textures.',
    url: 'https://www.alhayyinternational.com/lookbook',
    images: [
      {
        url: 'https://www.alhayyinternational.com/images/gallery-17.jpg',
        width: 1200,
        height: 630,
        alt: 'Al Hayy International Flowing Kaftans and Atelier Lookbook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atelier Visual Lookbook | Al Hayy International',
    description: 'High-resolution captures of fluid kaftans, handcrafted kurtis, and silk jackets.',
    images: ['https://www.alhayyinternational.com/images/gallery-17.jpg'],
  },
};

export default function LookbookLayout({ children }) {
  return children;
}
