/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'alhayyinternational-com.stackstaging.com',
      },
      {
        protocol: 'https',
        hostname: 'alhayyinternational-com.stackstaging.com',
      },
      {
        protocol: 'https',
        hostname: 'www.alhayyinternational.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'https://alhayyinternational-com.stackstaging.com/v2/api/:path*',
      },
    ];
  },
};

export default nextConfig;

