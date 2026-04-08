const isDev = process.env.NODE_ENV !== 'production';

/**
 * Next.js는 하이드레이션·RSC 등 인라인 스크립트를 주입하므로 nonce 파이프라인 없으면
 * 최소한 script-src에 'unsafe-inline'이 필요하다. (브라우저가 제시한 sha256 단일 해시만으로는 빌드마다 부족할 수 있음)
 * @see https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
 */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? (["'unsafe-eval'"] as const) : []),
  'https://vercel.live',
].join(' ');

export const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'", // Tailwind/인라인 스타일
  "img-src 'self' data: blob: https: http:", // 최소화하려면 remote-images 출처만 나열
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live https://*.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // TODO: Kakao CDN 등 https 미지원 출처가 있어서 비활성화(향후 https만 남는 경우 활성화하면 됨)
  // 'upgrade-insecure-requests',
].join('; ');
