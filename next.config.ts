import type { NextConfig } from 'next';



import { version } from './package.json';





const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  // 호스트명만 (프로토콜·포트 필요 없음). `https://*.…` 는 내부 와일드카드 매칭이 깨짐.
  allowedDevOrigins: ['*.ngrok-free.app', '127.0.0.1'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: '*.kakaocdn.net' },
      { protocol: 'http', hostname: '*.kakaocdn.net' },
    ],
  },
};

export default nextConfig;
