export type BuildCspParams = {
  nonce: string;
  /** `NODE_ENV === 'development'` — dev에서만 React/Next 디버그용 `unsafe-eval` 허용 */
  isDev: boolean;
};

/**
 * 요청별 nonce를 넣은 CSP 문자열.
 * @see https://nextjs.org/docs/app/guides/content-security-policy
 */
export function buildCsp({ nonce, isDev }: BuildCspParams): string {
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;"
    : //FIXME: sha256 해시는 next-themes가 FOUC 방지용으로 주입하는 고정 inline script(업데이트 시 꼭 변경 필요)
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'sha256-n46vPwSWuMC0W703pBofImv82Z26xo4LXymv0E9caPk=' https://vercel.live;`;

  // FIXME: upgrade-insecure-requests는 Kakao CDN이 http를 더 이상 사용하지 않으면 도입 필요
  const cspHeader = `
    default-src 'self';
    ${scriptSrc}
    style-src 'self' 'unsafe-inline';
    worker-src 'self' blob:;
    img-src 'self' data: blob: https://placehold.co https://example.com https://*.picsum.photos https://*.googleusercontent.com https://*.kakaocdn.net http://*.kakaocdn.net https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com;
    font-src 'self' data:;
    connect-src 'self' https://vitals.vercel-insights.com https://vercel.live https://*.vercel-insights.com https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    object-src 'none';
  `;

  return cspHeader.replace(/\s{2,}/g, ' ').trim();
}
