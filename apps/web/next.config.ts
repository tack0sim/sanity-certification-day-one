import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // cacheComponents: true, // experimental feature in Next.js v16
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
};

export default nextConfig;
