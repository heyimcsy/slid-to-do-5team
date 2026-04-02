/**
 * HttpOnly 쿠키·토큰 JSON 키·갱신 간격 등 — `API_URL` / `TEAM_ID`와 무관.
 * `src/constants/api.ts`는 env 검증이 있어 import 시점에 throw 할 수 있으므로,
 * 클라이언트 훅 등은 여기서만 `AUTH_CONFIG`를 가져간다.
 */
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

  /** login/refresh JSON 루트의 사용자 객체 키 (스네이크·camel 대체) */
  USER_OBJECT_KEY: 'user',
  USER_OBJECT_JSON_ALTERNATE: 'User',

  /** 사용자 객체 내부 필드 — 백엔드 스네이크 우선, camel 대체 (`user.ts` 정규화와 동기화) */
  USER_FIELD_ID: 'id',
  USER_FIELD_ID_ALTERNATE: 'user_id',
  USER_FIELD_EMAIL: 'email',
  USER_FIELD_NAME: 'name',
  USER_FIELD_IMAGE: 'image',
  USER_FIELD_AVATAR_URL: 'avatar_url',
  USER_FIELD_AVATAR_URL_ALTERNATE: 'avatarUrl',

  // 쿠키 만료 시간 (초 단위)
  ACCESS_TOKEN_MAX_AGE: 30 * 60, // 30분
  REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60, // 7일

  /**
   * `apiClient` 토큰 갱신 fetch 상한 (ms). 백엔드/BFF 무응답 시 서버·클라이언트 무한 대기 방지.
   */
  REFRESH_FETCH_TIMEOUT_MS: 15_000,

  /**
   * refresh 회전 직후, 첫 응답의 `Set-Cookie` 반영 전에 동일 old refresh로 들어온
   * 늦은 요청이 두 번째 `POST /auth/refresh`를 치지 않도록 성공 결과를 메모리에 잠깐 유지(ms).
   * @see `refreshSession.server` — `refreshSuccessCacheByOldRefreshToken`
   */
  REFRESH_SUCCESS_CACHE_TTL_MS: 10_000,

  /**
   * 브라우저가 `POST /api/auth/refresh`에 붙이는 현재 `pathname`.
   * 서버에서 `isPublicPath`와 함께 써서 비로그인 시 401(→`/login`) vs 200을 나눈다.
   */
  CLIENT_PATHNAME_HEADER: 'x-client-pathname',
} as const;

/**
 * 라우트 보호(`proxy`)·401 시 `/login` 이동(`apiClient`)을 켤지 여부.
 * 로컬/E2E에서 끄려면 `.env.local`에 `NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED=false`
 * (미설정·true면 기존과 동일하게 보호).
 */
export function isAuthRouteGuardEnabled(): boolean {
  const v = process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED?.trim().toLowerCase();
  if (v === undefined || v === '') return true;
  return v !== 'false' && v !== '0' && v !== 'off';
}
