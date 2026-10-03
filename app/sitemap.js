import { getProducts, CATEGORIES } from '@/lib/api';
import { CITIES_DATA } from '@/lib/citiesData';
import { COUNTRIES_DATA } from '@/lib/internationalCountriesData';

export const dynamic = 'force-dynamic';
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
    '/login',
    '/wholesale',
    '/export',
    '/market-areas'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/wholesale' || route === '/export' || route === '/market-areas' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : (route === '/shop' || route === '/wholesale' || route === '/export' || route === '/market-areas' || route === '/lookbook' ? 0.9 : 0.8),
  }));

  // Dynamic wholesale city routes (India)
  const cityRoutes = CITIES_DATA.map((city) => ({
    url: `${baseUrl}/wholesale/${city.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic international country export routes
  const countryRoutes = COUNTRIES_DATA.map((country) => ({
    url: `${baseUrl}/export/${country.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.88,
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

  return [...staticRoutes, ...categoryRoutes, ...cityRoutes, ...countryRoutes, ...productRoutes];
}
