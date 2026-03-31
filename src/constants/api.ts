export const APP_URL = process.env.APP_URL;
export const API_URL = process.env.API_URL;
export const TEAM_ID = process.env.TEAM_ID;
if (!API_URL || !TEAM_ID) {
  throw new Error('API_URL 또는 TEAM_ID가 설정되지 않았습니다. .env.example 파일을 참고하세요.');
}
export const API_BASE_URL = `${API_URL}/${TEAM_ID}`;

/**
 * @description BFF origin 검증용 - 개발/프리뷰 URL (NEXT_PUBLIC_ 없는 호출은 서버 전용)
 * @note appUrl은 실제 앱 URL, vercelUrl은 프리뷰 URL(vercel에서 VERCEL_URL 자동 주입)
 * @note `*` 가 포함된 항목은 `src/proxy.ts` 의 `originMatchesAllowedEntry` 에서
 *       호스트 한 세그먼트(예: `https://abc.ngrok-free.app` ← `https://*.ngrok-free.app`)로 매칭됨.
 */
export const ALLOWED_ORIGINS = (() => {
  const origins: string[] = [];
  const appUrl = process.env.APP_URL; // https://myapp.com
  const vercelUrl = process.env.VERCEL_URL; // preview-xxx-team.vercel.app
  if (appUrl) origins.push(appUrl.replace(/\/$/, ''));
  if (vercelUrl) {
    origins.push(`https://${vercelUrl}`);
    origins.push(`https://${vercelUrl.replace(/^preview-/, '')}`);
  }
  // BFF origin 검증 — 아래는 dev/prod 구분 없이 항상 허용할 도메인임
  origins.push(`https://potato-admin.shop`, `https://slid-to-do-5team.vercel.app`);
  if (process.env.NODE_ENV === 'development') {
    origins.push(`http://localhost:3000`, `http://127.0.0.1:3000`, `https://*.ngrok-free.app`);
  }
  return origins;
})();

/** API 호출 타임아웃 시간 (10초 = 10_000ms) */
export const API_TIMEOUT_MS = 10_000 as const;