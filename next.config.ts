import type { NextConfig } from 'next';

import { version } from './package.json';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  allowedDevOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://*.ngrok-free.app'],
};

export default nextConfig;
