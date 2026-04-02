import type { OnUnauthorizedContext } from '@/lib/apiClient.core';

import { createApiClient } from '@/lib/apiClient.core';
import { logoutAndRedirect } from '@/lib/auth/logoutAndRedirect';
import { getRefreshRequestHeaders } from '@/lib/auth/refreshRequestHeaders';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

import { AUTH_CONFIG } from '@/constants/auth-config';

let clientRefreshInFlight: Promise<boolean> | null = null;

/**
 * 클라이언트(브라우저): 탭 내 동시 401에 대해 한 번만 refresh 하도록 in-flight Promise 공유.
 * 서버 인스턴스는 이 로직 없이 `refreshTokens`를 매번 호출함.
 */
async function refreshTokensBrowser(): Promise<boolean> {
  if (clientRefreshInFlight) return clientRefreshInFlight;
  clientRefreshInFlight = (async () => {
    const timeoutMs = AUTH_CONFIG.REFRESH_FETCH_TIMEOUT_MS;
    try {
      const response = await fetchWithTimeout(
        '/api/auth/refresh',
        {
          method: 'POST',
          credentials: 'include',
          headers: getRefreshRequestHeaders(),
        },
        timeoutMs,
      );
      return response.ok;
    } catch {
      return false;
    }
  })();
  try {
    return await clientRefreshInFlight;
  } finally {
    clientRefreshInFlight = null;
  }
}

/**
 * `retry: true`인 채 `/api/auth/login|signup`이 401 → refresh 실패 시에도
 * 자격 증명 오류를 세션 만료로 오인하지 않도록 전역 로그아웃 리다이렉트를 생략한다.
 * (요청 단위 opt-out은 `ApiClientConfig.skipSessionExpiredRedirect` 참고)
 */
export function shouldTriggerSessionExpiredLogoutRedirect(ctx: OnUnauthorizedContext): boolean {
  if (
    ctx.config.clientPublicBase === '/api/auth' &&
    (ctx.endpoint === '/login' || ctx.endpoint === '/signup')
  ) {
    return false;
  }
  return true;
}

const browser = createApiClient({
  resolveUrl: (endpoint, config) => `${config.clientPublicBase ?? '/api/proxy'}${endpoint}`,
  credentials: 'include',
  refreshTokens: refreshTokensBrowser,
  onUnauthorized: (ctx) => {
    if (!shouldTriggerSessionExpiredLogoutRedirect(ctx)) return;
    logoutAndRedirect();
  },
  shouldRunGlobalInterceptors: () => typeof window !== 'undefined',
  allowGlobalInterceptorRegistration: true,
});

export const apiClient = browser.request;
export const useRequestInterceptor = browser.useRequestInterceptor;
export const useResponseInterceptor = browser.useResponseInterceptor;
export const useErrorInterceptor = browser.useErrorInterceptor;
