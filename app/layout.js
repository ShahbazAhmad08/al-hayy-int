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
    description: 'Heritage artisan craftsmanship woven into contemporary luxury fashion at Al Hayy International.',
    url: 'https://www.alhayyinternational.com',
    siteName: 'Al Hayy International',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Al Hayy International Luxury Heritage Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al Hayy International | Luxury Handcrafted Fashion',
    description: 'Handcrafted cotton kurtis, kaftans, and fine silk jackets from Al Hayy International.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: ['/favicon.png']
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
};

import LuxuryPreloader from '@/components/LuxuryPreloader';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <SEOStructuredData type="Organization" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FCFBF7] text-slate-900 antialiased selection:bg-[#C46210] selection:text-white">
        <LuxuryPreloader />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <CartDrawer />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
