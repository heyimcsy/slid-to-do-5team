'use client';

import { useEffect } from 'react';

import { AUTH_CONFIG } from '@/constants/api';

/**
 * @description 마운트 시 + 일정 간격으로 /api/auth/refresh 호출 — access_token 만료 직전 자동 갱신
 * @note Server Component의 apiClient는 서버에서 백엔드 직통이라 브라우저에 요청이 보이지 않음.
 *      이 훅은 클라이언트에서 명시적으로 /api/auth/refresh를 호출하여 갱신을 트리거함.
 * @note SPA 장시간 사용 시 마운트 1회만으로는 부족하므로 주기적 호출 추가.
 * @note `setInterval` 대신 **이전 요청 완료 후** 다음 간격을 잡음 — refresh 토큰 회전 시 POST가 겹치며
 *      쿠키가 꼬이거나 이미 소진된 refresh로 두 번째 요청이 나가는 것을 방지 (BFF 쿠키 세션과 정합).
 */
export function useTokenRefreshOnMount(): void {
  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const runRefresh = async () => {
      try {
        await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
      } catch {
        // 네트워크 오류 등 — 다음 주기는 유지
      } finally {
        if (!cancelled) {
          timeoutId = setTimeout(() => void runRefresh(), AUTH_CONFIG.REFRESH_CHECK_INTERVAL_MS);
        }
      }
    };

    void runRefresh();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);
}
