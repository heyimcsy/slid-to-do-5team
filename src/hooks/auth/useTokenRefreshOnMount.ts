'use client';

import { useEffect } from 'react';

import { AUTH_CONFIG } from '@/constants/api';

/**
 * @description 마운트 시 + 5분마다 /api/auth/refresh 호출 — access_token 만료 직전 자동 갱신
 * @note Server Component의 apiClient는 서버에서 백엔드 직통이라 브라우저에 요청이 보이지 않음.
 *      이 훅은 클라이언트에서 명시적으로 /api/auth/refresh를 호출하여 갱신을 트리거함.
 * @note SPA 장시간 사용 시 마운트 1회만으로는 부족하므로 주기적 호출 추가.
 */
export function useTokenRefreshOnMount(): void {
  useEffect(() => {
    const doRefresh = () =>
      void fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });

    doRefresh(); // 마운트 시 1회
    const id = setInterval(doRefresh, AUTH_CONFIG.REFRESH_CHECK_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);
}
