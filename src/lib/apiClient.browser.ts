import { createApiClient } from '@/lib/apiClient.core';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { buildLoginRedirectUrlAfterUnauthorized } from '@/lib/navigation/loginRedirectOnUnauthorized';
import { authUserStore } from '@/stores/authUserStore';

import { AUTH_CONFIG, isAuthRouteGuardEnabled } from '@/constants/auth-config';

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

const browser = createApiClient({
  resolveUrl: (endpoint, config) => `${config.clientPublicBase ?? '/api/proxy'}${endpoint}`,
  credentials: 'include',
  refreshTokens: refreshTokensBrowser,
  onUnauthorized: () => {
    if (typeof window !== 'undefined' && isAuthRouteGuardEnabled()) {
      authUserStore.getState().clearUser();
      window.location.href = buildLoginRedirectUrlAfterUnauthorized(window.location);
    }
  },
  shouldRunGlobalInterceptors: () => typeof window !== 'undefined',
  allowGlobalInterceptorRegistration: true,
});

export const apiClient = browser.request;
export const useRequestInterceptor = browser.useRequestInterceptor;
export const useResponseInterceptor = browser.useResponseInterceptor;
export const useErrorInterceptor = browser.useErrorInterceptor;
