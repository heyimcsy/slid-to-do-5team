import type { NextConfig } from 'next';



import { csp } from '@/config/csp';
import { getImageRemotePatterns } from '@/config/remote-images';
import { getLocalSubnetList } from '@/lib/network';

import { version } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  compiler: {
    // Production 에서만 console 제거(console.error는 제외), development 에서는 모두 출력
    removeConsole: isProduction ? { exclude: ['error'] } : false,
  },
  // 호스트명만 (프로토콜·포트 필요 없음). `https://*.…` 는 내부 와일드카드 매칭이 깨짐.
  allowedDevOrigins: ['127.0.0.1', '*.ngrok-free.dev', '*.ngrok-free.app', ...getLocalSubnetList()],
  images: {
    remotePatterns: getImageRemotePatterns(),
  },
};

export default nextConfig;
