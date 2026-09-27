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
    default: 'Al Hayy Kashmir | Luxury Handcrafted Kurtis, Kaftans & Pashmina Atelier',
    template: '%s | Al Hayy Kashmir'
  },
  description: 'Experience the 72-hour master craftsmanship of Kashmir. Discover pure cotton embroidered kurtis, luxury handcrafted kaftans, fine mulberry silk jackets, and authentic Changthangi pashmina.',
  keywords: [
    'Al Hayy Kashmir',
    'Kashmiri Kurtis',
    'Cotton Kaftans',
    'Silk Jackets',
    'Kashmiri Embroidery',
    'Aari Needlework',
    'Pashmina Shawls',
    'Co-ord sets',
    'Luxury Ethnic Wear India'
  ],
  authors: [{ name: 'Al Hayy Kashmir' }],
  creator: 'Al Hayy Kashmir Atelier',
  publisher: 'Al Hayy International',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Al Hayy Kashmir | Luxury Handcrafted Kurtis, Kaftans & Pashmina',
    description: 'Centuries of Kashmiri artisan heritage woven into contemporary luxury fashion.',
    url: 'https://www.alhayyinternational.com',
    siteName: 'Al Hayy Kashmir',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Al Hayy Kashmir Luxury Heritage Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al Hayy Kashmir | Luxury Handcrafted Valley Fashion',
    description: 'Handcrafted cotton kurtis, kaftans, and fine silk jackets from the heart of Kashmir.',
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
