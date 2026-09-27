import { SEED_PRODUCTS, CATEGORIES } from '@/lib/api';

export default async function sitemap() {
  const baseUrl = 'https://www.alhayyinternational.com';

  const staticRoutes = [
    '',
    '/shop',
    '/our-story',
    '/contact',
    '/orders',
    '/admin'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const productRoutes = SEED_PRODUCTS.map((product) => ({
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
