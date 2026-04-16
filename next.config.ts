import type { NextConfig } from 'next';

import { getImageRemotePatterns } from '@/config/remote-images';
import { getLocalSubnetList } from '@/lib/network';
import { withSentryConfig } from '@sentry/nextjs';

import { version } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'sujiiji',

  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
