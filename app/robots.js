export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/dashboard', '/api/'],
    },
    sitemap: 'https://www.alhayyinternational.com/sitemap.xml',
  };
}
