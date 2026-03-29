import 'server-only';

import type { User } from '@/lib/auth/schemas/user';

import { getRefreshToken, setAuthCookies } from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

import { API_BASE_URL } from '@/constants/api';
import { AUTH_CONFIG } from '@/constants/auth-config';

export type RefreshSessionResult =
  | { ok: true; user?: User }
  | { ok: false; reason: 'no_refresh_token' }
  | { ok: false; reason: 'backend_rejected'; status: number; message: string }
  | { ok: false; reason: 'network' }
  | { ok: false; reason: 'invalid_token_body' };

let refreshInFlight: Promise<RefreshSessionResult> | null = null;

async function performRefreshSession(): Promise<RefreshSessionResult> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return { ok: false, reason: 'no_refresh_token' };
  }

  const base = API_BASE_URL?.replace(/\/$/, '') ?? '';
  const timeoutMs = AUTH_CONFIG.REFRESH_FETCH_TIMEOUT_MS;

  let data: Record<string, unknown>;
  try {
    const response = await fetchWithTimeout(
      `${base}/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [AUTH_CONFIG.REFRESH_TOKEN_JSON_ALTERNATE]: refreshToken,
        }),
      },
      timeoutMs,
    );

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const message =
        (errBody as { message?: string }).message ??
        (errBody as { error?: string }).error ??
        '토큰 갱신 실패';
      return { ok: false, reason: 'backend_rejected', status: response.status, message };
    }

    data = (await response.json()) as Record<string, unknown>;
  } catch {
    return { ok: false, reason: 'network' };
  }

  const {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user,
  } = parseTokenPairFromBackendJson(data);

  if (!newAccessToken || !newRefreshToken) {
    return { ok: false, reason: 'invalid_token_body' };
  }

  await setAuthCookies(newAccessToken, newRefreshToken);
  return { ok: true, user };
}

/** 동시 요청 시 백엔드 refresh 한 번만 수행 (프로세스 내 단일 비행). */
export function refreshSessionWithMutex(): Promise<RefreshSessionResult> {
  if (!refreshInFlight) {
    refreshInFlight = performRefreshSession().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

/** 서버 apiClient 401 재시도 경로용 */
export async function refreshSessionSuccessBoolean(): Promise<boolean> {
  const r = await refreshSessionWithMutex();
  return r.ok;
}
