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

  const cspHeader = `
    default-src 'self';
    ${scriptSrc}
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://placehold.co https://*.googleusercontent.com https://*.kakaocdn.net http://*.kakaocdn.net https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com;
    font-src 'self' data:;
    connect-src 'self' https://vitals.vercel-insights.com https://vercel.live https://*.vercel-insights.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    object-src 'none';
    upgrade-insecure-requests;
  `;

  return cspHeader.replace(/\s{2,}/g, ' ').trim();
}