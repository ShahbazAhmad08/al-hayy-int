import { getProducts, CATEGORIES } from '@/lib/api';

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = 'https://www.alhayyinternational.com';

  const staticRoutes = [
    '',
    '/shop',
    '/lookbook',
    '/our-story',
    '/contact',
    '/orders',
    '/login'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : (route === '/shop' || route === '/lookbook' ? 0.9 : 0.8),
  }));

  // Fetch all live database + catalog products for comprehensive indexing
  let products = [];
  try {
    products = await getProducts();
  } catch (e) {
    products = [];
  }

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const categoryRoutes = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/shop?category=${encodeURIComponent(cat.name)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
