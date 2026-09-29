export const metadata = {
  title: 'Contact Atelier Concierge & Bespoke Styling | Al Hayy International',
  description: 'Connect with our Srinagar master atelier for bespoke bridal trousseau consultations, custom sizing, luxury gift packaging, and express order inquiries.',
  openGraph: {
    title: 'Contact Atelier Concierge | Al Hayy International',
    description: 'Connect with our Srinagar master atelier for bespoke styling, sizing consultations, and luxury packaging.',
    url: 'https://www.alhayyinternational.com/contact',
    images: [
      {
        url: 'https://www.alhayyinternational.com/images/gallery-31.jpg',
        width: 1200,
        height: 630,
        alt: 'Al Hayy International Bespoke Bridal and Atelier Concierge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Atelier Concierge | Al Hayy International',
    description: 'Bespoke bridal styling, size alterations, and luxury packaging consultations.',
    images: ['https://www.alhayyinternational.com/images/gallery-31.jpg'],
  },
};

export default function ContactLayout({ children }) {
  return children;
}
