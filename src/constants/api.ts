export const APP_URL = process.env.APP_URL;
export const API_URL = process.env.API_URL;
export const TEAM_ID = process.env.TEAM_ID;
if (!API_URL || !TEAM_ID) {
  throw new Error('API_URL 또는 TEAM_ID가 설정되지 않았습니다. .env.example 파일을 참고하세요.');
}
export const API_BASE_URL = `${API_URL}/${TEAM_ID}`;

export const AUTH_CONFIG = {
  /** HttpOnly 쿠키·서버에서 읽는 토큰 키 (snake_case) */
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',

  /**
   * 백엔드 JSON(login/refresh 응답 등)에서 토큰 필드명이 camelCase일 때 대응.
   * 파싱 시 `ACCESS_TOKEN_KEY` / `REFRESH_TOKEN_KEY`를 우선하고, 없으면 아래 키를 사용.
   */
  ACCESS_TOKEN_JSON_ALTERNATE: 'accessToken',
  REFRESH_TOKEN_JSON_ALTERNATE: 'refreshToken',

  // 쿠키 만료 시간 (초 단위)
  ACCESS_TOKEN_MAX_AGE: 30 * 60, // 30분
  REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60, // 7일

  // 토큰 갱신 버퍼 — 만료 N초 전에 미리 갱신 (레이스 컨디션 방지)
  REFRESH_BUFFER_SECONDS: 60,

  // 클라이언트 주기적 refresh 체크 간격 (ms, 5분)
  REFRESH_CHECK_INTERVAL_MS: 5 * 60 * 1000,
} as const;

/**
 * @description BFF origin 검증용 - 개발/프리뷰 URL (NEXT_PUBLIC_ 없는 호출은 서버 전용)
 * @note appUrl은 실제 앱 URL, vercelUrl은 프리뷰 URL(vercel에서 VERCEL_URL 자동 주입)
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
  if (process.env.NODE_ENV === 'development') {
    origins.push(`http://localhost:3000`, `http://127.0.0.1:3000`, `https://*.ngrok-free.app`);
  }
  return origins;
})();
