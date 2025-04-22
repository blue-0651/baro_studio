/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
}

module.exports = nextConfig;
