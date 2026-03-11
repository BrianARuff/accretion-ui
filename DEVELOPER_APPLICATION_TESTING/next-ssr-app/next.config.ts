import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: ['@accretion-ui/react'],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
