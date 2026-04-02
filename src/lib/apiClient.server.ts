import 'server-only';

import { createApiClient } from '@/lib/apiClient.core';
import { getAccessToken } from '@/lib/auth/cookies';
import { refreshSessionSuccessBoolean } from '@/lib/auth/refreshSession.server';

import { API_BASE_URL } from '@/constants/api';

const server = createApiClient({
  resolveUrl: (endpoint) => `${API_BASE_URL}${endpoint}`,
  credentials: 'omit',
  onBeforeAuth: async (headers) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return undefined;
  },
  refreshTokens: refreshSessionSuccessBoolean,
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
