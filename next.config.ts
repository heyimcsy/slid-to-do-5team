import type { NextConfig } from 'next';

import { getLocalSubnetList } from '@/lib/network';

import { version } from './package.json';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  // 호스트명만 (프로토콜·포트 필요 없음). `https://*.…` 는 내부 와일드카드 매칭이 깨짐.
  allowedDevOrigins: [
    '*.ngrok-free.app',
    '127.0.0.1',
    ...getLocalSubnetList(),
    // ...(process.env.ALLOWED_DEV_ORIGINS?.split(',')
    //   .map((s) => s.trim())
    //   .filter(Boolean) ?? []),
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: '*.kakaocdn.net' },
      { protocol: 'http', hostname: '*.kakaocdn.net' },
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        pathname: '/slid-todo/**',
      },
    ],
  },
};

export default nextConfig;
