import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SEOStructuredData from '@/components/SEOStructuredData';

export const metadata = {
  metadataBase: new URL('https://www.alhayyinternational.com'),
  title: {
    default: 'Al Hayy International | Luxury Handcrafted Kurtis, Kaftans & Designer Atelier',
    template: '%s | Al Hayy International'
  },
  description: 'Experience master craftsmanship at Al Hayy International. Discover pure cotton embroidered kurtis, luxury handcrafted kaftans, fine mulberry silk jackets, and heritage artisanal pieces.',
  keywords: [
    'Al Hayy International',
    'Al Hayy',
    'Al Hayy Fashion',
    'Designer Kurtis',
    'Cotton Kaftans',
    'Silk Jackets',
    'Handcrafted Embroidery',
    'Aari Needlework',
    'Co-ord sets',
    'Luxury Ethnic Wear India'
  ],
  authors: [{ name: 'Al Hayy International' }],
  creator: 'Al Hayy International Atelier',
  publisher: 'Al Hayy International',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Al Hayy International | Luxury Handcrafted Kurtis, Kaftans & Designer Fashion',
    description: 'Heritage artisan craftsmanship woven into contemporary luxury fashion at Al Hayy International. Pure cotton kurtis, silk jackets & signature royal packaging.',
    url: 'https://www.alhayyinternational.com',
    siteName: 'Al Hayy International',
    images: [
      {
        url: 'https://www.alhayyinternational.com/images/hero-packaging.jpg',
        width: 1200,
        height: 630,
        alt: 'Al Hayy International Luxury Handcrafted Kurtis, Kaftans & Royal Unboxing Packaging',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al Hayy International | Luxury Handcrafted Fashion Atelier',
    description: 'Handcrafted cotton kurtis, kaftans, and fine silk jackets from Al Hayy International.',
    images: ['https://www.alhayyinternational.com/images/hero-packaging.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: ['/favicon.ico']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '4_iLi9JW3mKqEIHytf3JBCoS7EWBJnq5_5unrTKvRZI',
  },
};

import LuxuryPreloader from '@/components/LuxuryPreloader';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden max-w-full">
      <head>
        <meta name="google-site-verification" content="4_iLi9JW3mKqEIHytf3JBCoS7EWBJnq5_5unrTKvRZI" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <SEOStructuredData type="Organization" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#070E1E] antialiased selection:bg-[#070E1E] selection:text-[#F7E7B6] overflow-x-hidden max-w-full w-full">
        <LuxuryPreloader />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 w-full overflow-x-hidden max-w-full">{children}</main>
            <CartDrawer />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
