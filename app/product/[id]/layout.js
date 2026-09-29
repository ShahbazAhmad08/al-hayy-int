import { getProductById } from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    const product = await getProductById(params.id);
    if (product) {
      const title = `${product.title} | Luxury Handcrafted Couture - Al Hayy`;
      const description = `${product.description.slice(0, 160)}... Buy authentic handcrafted Kashmiri ethnic wear at Al Hayy International.`;
      const imageUrl = product.image.startsWith('http') ? product.image : `https://www.alhayyinternational.com${product.image}`;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://www.alhayyinternational.com/product/${product.id}`,
          images: [
            {
              url: imageUrl,
              width: 1000,
              height: 1250,
              alt: `${product.title} - Handcrafted by Al Hayy International`,
            },
          ],
          type: 'website',
        },
        alternates: {
          canonical: `https://www.alhayyinternational.com/product/${product.id}`,
        },
      };
    }
  } catch (err) {
    // fallback
  }

  return {
    title: 'Luxury Handcrafted Couture Piece | Al Hayy International',
    description: 'Explore master artisanal kurtis, handcrafted kaftans, and luxury ethnic ensembles at Al Hayy International.',
    alternates: {
      canonical: `https://www.alhayyinternational.com/product/${params.id}`,
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
