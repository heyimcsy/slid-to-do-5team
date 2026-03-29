import { AUTH_CONFIG } from '@/constants/auth-config';

/** 브라우저 전용 — `useTokenRefreshOnMount`·`apiClient.browser` refresh와 동일 헤더 */
export function getRefreshRequestHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  return {
    [AUTH_CONFIG.CLIENT_PATHNAME_HEADER]: window.location.pathname,
  };
}
