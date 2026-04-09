/** Kakao OAuth 2.0 Authorization Code — authorize 엔드포인트 (JS SDK와 무관) */
export const KAKAO_OAUTH_AUTHORIZE_BASE = 'https://kauth.kakao.com/oauth/authorize' as const;

/**
 * Kakao Developers에 등록한 Redirect URI와 바이트 단위로 동일해야 함.
 * 예: `https://myapp.com/api/auth/oauth/kakao/callback`
 */
export const KAKAO_OAUTH_CALLBACK_PATH = '/api/auth/oauth/kakao/callback' as const;

export const STORAGE_OAUTH_KAKAO_STATE = 'oauth_kakao_state' as const;
export const STORAGE_OAUTH_KAKAO_RETURN_PATH = 'oauth_kakao_return_path' as const;

/** 카카오 콜백 직후 1회 — 클라이언트가 `authUserStore`에 동기화할 때까지 잠깐 보관 (HttpOnly) */
export const COOKIE_OAUTH_USER_FLASH = 'oauth_user_flash' as const;

/** OAuth 로그인 후 `sync-user` 호출 트리거 (URL에서 제거) */
export const OAUTH_SYNC_USER_QUERY = '_oauth' as const;

/**
 * Authorization·(추후) 토큰 교환에 동일한 문자열 필요. KOE006 = 콘솔 미등록 또는 1바이트 불일치.
 * @see https://developers.kakao.com/docs/latest/ko/kakaologin/troubleshooting#types-of-error-messages
 */
export function resolveKakaoOAuthRedirectUri(appOrigin: string): string {
  const explicit = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI?.trim();
  if (explicit) return explicit;
  const base = appOrigin.replace(/\/$/, '');
  return `${base}${KAKAO_OAUTH_CALLBACK_PATH}`;
}

/**
 * BFF(토큰 교환)에서 쓰는 redirect_uri — authorize 요청과 동일해야 함.
 */
export function resolveKakaoOAuthRedirectUriForServer(): string {
  const explicit = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI?.trim();
  if (explicit) return explicit;
  const appUrl = process.env.APP_URL?.replace(/\/$/, '');
  if (!appUrl) {
    throw new Error(
      'Kakao redirect_uri: APP_URL 또는 NEXT_PUBLIC_KAKAO_REDIRECT_URI를 .env에 설정하세요.',
    );
  }
  return `${appUrl}${KAKAO_OAUTH_CALLBACK_PATH}`;
}

/** Google OAuth 2.0 — authorize (브라우저 리다이렉트) */
export const GOOGLE_OAUTH_AUTHORIZE_BASE = 'https://accounts.google.com/o/oauth2/v2/auth' as const;

/**
 * Google Cloud Console OAuth 클라이언트에 등록한 Redirect URI와 동일해야 함.
 * 예: `https://myapp.com/api/auth/oauth/google/callback`
 */
export const GOOGLE_OAUTH_CALLBACK_PATH = '/api/auth/oauth/google/callback' as const;

export const STORAGE_OAUTH_GOOGLE_STATE = 'oauth_google_state' as const;
export const STORAGE_OAUTH_GOOGLE_RETURN_PATH = 'oauth_google_return_path' as const;

/** 로그인 시 요청 scope — 토큰 클라이언트·Authorization Code 공통 */
export const GOOGLE_OAUTH_SCOPES = 'openid email profile' as const;

export function resolveGoogleOAuthRedirectUri(appOrigin: string): string {
  const explicit = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI?.trim();
  if (explicit) return explicit;
  const base = appOrigin.replace(/\/$/, '');
  return `${base}${GOOGLE_OAUTH_CALLBACK_PATH}`;
}

export function resolveGoogleOAuthRedirectUriForServer(): string {
  const explicit = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI?.trim();
  if (explicit) return explicit;
  const appUrl = process.env.APP_URL?.replace(/\/$/, '');
  if (!appUrl) {
    throw new Error(
      'Google redirect_uri: APP_URL 또는 NEXT_PUBLIC_GOOGLE_REDIRECT_URI를 .env에 설정하세요.',
    );
  }
  return `${appUrl}${GOOGLE_OAUTH_CALLBACK_PATH}`;
}
