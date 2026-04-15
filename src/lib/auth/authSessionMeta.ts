import type { User } from '@/lib/auth/schemas/user';

import { apiClient, ApiClientError } from '@/lib/apiClient';
import { oauthProviderCookieSchema } from '@/lib/auth/schemas/oauth';

/** `GET /api/auth/session` 응답 — HttpOnly 쿠키 기반 메타 */
export type AuthSessionApiResponse = {
  hasRefreshToken: boolean;
  oauthProvider: 'google' | 'kakao' | null;
};

export type AuthSessionMetaResult =
  | { ok: true; meta: AuthSessionApiResponse }
  | {
      ok: false;
      error: 'network_error' | 'http_error' | 'invalid_json' | 'invalid_shape';
    };

function parseAuthSessionJson(raw: unknown): AuthSessionApiResponse | undefined {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const o = raw as Record<string, unknown>;
  if (typeof o.hasRefreshToken !== 'boolean') return undefined;

  const hasRefreshToken = o.hasRefreshToken;
  const p = o.oauthProvider;
  if (p !== null && p !== undefined && typeof p !== 'string') return undefined;

  const parsed = typeof p === 'string' ? oauthProviderCookieSchema.safeParse(p) : undefined;
  return {
    hasRefreshToken,
    oauthProvider: typeof p === 'string' ? (parsed?.success ? parsed.data : null) : null,
  };
}

/**
 * BFF `GET /api/auth/session` — refresh·OAuth provider(HttpOnly)를 클라이언트에 알릴 때 사용.
 * `signal`을 넘기면 상위 호출자에서 요청 취소(AbortController)할 수 있다.
 * 실패(`ok:false`)와 정상 password 세션(`oauthProvider:null`)을 구분해서 반환한다.
 */
export async function fetchAuthSessionMeta(signal?: AbortSignal): Promise<AuthSessionMetaResult> {
  try {
    const raw = await apiClient<unknown>('/session', {
      method: 'GET',
      clientPublicBase: '/api/auth',
      signal,
      retry: false,
      skipSessionExpiredRedirect: true,
    });
    const parsed = parseAuthSessionJson(raw);
    if (!parsed) return { ok: false, error: 'invalid_shape' };
    return { ok: true, meta: parsed };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    if (error instanceof ApiClientError) return { ok: false, error: 'http_error' };
    if (error instanceof SyntaxError) return { ok: false, error: 'invalid_json' };
    return { ok: false, error: 'network_error' };
  }
}

/**
 * `User`에 `oauthProvider`를 반영한다. `null`이면 필드를 제거(이메일 세션 등).
 */
export function applyOauthProviderToUser(
  user: User,
  oauthProvider: 'google' | 'kakao' | null,
): User {
  if (oauthProvider === null) {
    if (user.oauthProvider === undefined) return user;
    const rest = { ...user };
    delete rest.oauthProvider;
    return rest as User;
  }
  if (user.oauthProvider === oauthProvider) return user;
  return { ...user, oauthProvider };
}
