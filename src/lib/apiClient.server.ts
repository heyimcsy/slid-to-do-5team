import 'server-only';

import { createApiClient } from '@/lib/apiClient.core';
import {
  getAccessToken,
  getRefreshToken,
  isAccessTokenExpiringSoon,
  setAuthCookies,
} from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

import { API_BASE_URL } from '@/constants/api';
import { AUTH_CONFIG } from '@/constants/auth-config';

async function refreshTokensServer(): Promise<boolean> {
  const timeoutMs = AUTH_CONFIG.REFRESH_FETCH_TIMEOUT_MS;
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [AUTH_CONFIG.REFRESH_TOKEN_KEY]: refreshToken }),
      },
      timeoutMs,
    );

    if (!response.ok) return false;

    const data = (await response.json()) as Record<string, unknown>;
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      parseTokenPairFromBackendJson(data);
    if (!newAccessToken || !newRefreshToken) return false;
    await setAuthCookies(newAccessToken, newRefreshToken);
    return true;
  } catch {
    return false;
  }
}

const server = createApiClient({
  resolveUrl: (endpoint) => `${API_BASE_URL}${endpoint}`,
  credentials: 'omit',
  onBeforeAuth: async (headers, endpoint, config, request) => {
    if (await isAccessTokenExpiringSoon()) {
      const refreshed = await refreshTokensServer();
      if (refreshed) {
        return request(endpoint, { ...config, retry: false });
      }
    }
    const accessToken = await getAccessToken();
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return undefined;
  },
  refreshTokens: refreshTokensServer,
  shouldRunGlobalInterceptors: () => false,
  allowGlobalInterceptorRegistration: false,
  buildFetchNext: (nextConfig) =>
    nextConfig
      ? {
          next: nextConfig,
          ...(nextConfig.cache !== undefined && { cache: nextConfig.cache }),
        }
      : undefined,
});

export const apiClientServer = server.request;
