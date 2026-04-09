import type { User } from '@/lib/auth/schemas/user';

import { oauthProviderCookieSchema } from '@/lib/auth/schemas/oauth';

/** `GET /api/auth/session` 응답 — HttpOnly 쿠키 기반 메타 */
export type AuthSessionApiResponse = {
  hasRefreshToken: boolean;
  oauthProvider: 'google' | 'kakao' | null;
};

function parseAuthSessionJson(raw: unknown): AuthSessionApiResponse {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { hasRefreshToken: false, oauthProvider: null };
  }
  const o = raw as Record<string, unknown>;
  const hasRefreshToken = Boolean(o.hasRefreshToken);
  const p = o.oauthProvider;
  const parsed =
    typeof p === 'string' ? oauthProviderCookieSchema.safeParse(p) : { success: false as const };
  return {
    hasRefreshToken,
    oauthProvider: parsed.success ? parsed.data : null,
  };
}

/**
 * BFF `GET /api/auth/session` — refresh·OAuth provider(HttpOnly)를 클라이언트에 알릴 때 사용.
 * `signal`을 넘기면 상위 호출자에서 요청 취소(AbortController)할 수 있다.
 */
export async function fetchAuthSessionMeta(signal?: AbortSignal): Promise<AuthSessionApiResponse> {
  const r = await fetch('/api/auth/session', { credentials: 'include', signal });
  let raw: unknown;
  try {
    raw = await r.json();
  } catch {
    return { hasRefreshToken: false, oauthProvider: null };
  }
  return parseAuthSessionJson(raw);
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
