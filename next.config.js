/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;