'use client';

import type { User } from '@/lib/auth/schemas/user';

import { useEffect } from 'react';
import { logoutAndRedirect } from '@/lib/auth/logoutAndRedirect';
import { getRefreshRequestHeaders } from '@/lib/auth/refreshRequestHeaders';
import { isAuthFlowPagePathname } from '@/lib/navigation/publicPaths';
import { authUserStore } from '@/stores/authUserStore';

/**
 * 마운트 시 1회 + 탭 복귀(visibilitychange) 시 `/api/auth/refresh`를 호출하여 세션 유효성을 검증한다.
 *
 * ## 왜 주기적 polling을 사용하지 않는가
 *
 * 토큰 갱신은 이미 두 계층에서 보장된다:
 * 1. **Proactive** — `forwardToBackend`(proxy.ts) 및 `apiClient.server`가 매 요청 직전
 *    `isAccessTokenExpiringSoon()` 확인 후 갱신.
 * 2. **Reactive** — `apiClient.core`가 401 응답 시 refresh → 재시도.
 *
 * 따라서 고정 간격 polling은 대부분 "아직 유효" 응답만 받으며 불필요한 네트워크 비용을 발생시킨다.
 * 탭이 장시간 비활성인 경우에만 세션 만료를 감지하면 되므로,
 * `visibilitychange` 이벤트로 탭 복귀 시점에 1회 검증하는 것이 효율적이다.
 *
 * ## 디바운스
 *
 * 빠른 탭 전환 시 refresh 요청이 중복되지 않도록 마지막 refresh로부터
 * 최소 60초가 지나야 다음 호출을 허용한다.
 *
 * @note Server Component의 apiClient는 서버에서 백엔드 직통이라 브라우저에 요청이 보이지 않음.
 *       이 훅은 클라이언트에서 명시적으로 /api/auth/refresh를 호출하여 갱신을 트리거함.
 * @note `/login`·`/signup`·`/`(홈)에서는 호출 생략 — 그 외 공개 경로(`/com/...` 등)에서는 refresh로 access 복구 가능.
 *       비공개 경로에서 토큰 없음은 서버가 401 → `logoutAndRedirect`가 `/login` 처리(`isPublicPath`와 정합).
 */

/** 탭 전환 시 refresh 스팸 방지를 위한 최소 간격 (ms) */
const MIN_REFRESH_INTERVAL_MS = 60_000;

export function useTokenRefreshOnMount(): void {
  useEffect(() => {
    let cancelled = false;
    let sessionPaused = false;
    let lastRefreshAt = 0;
    /** 동시 호출 방지용 in-flight guard */
    let refreshInFlight = false;

    const runRefresh = async () => {
      if (typeof window !== 'undefined') {
        const p = window.location.pathname;
        if (isAuthFlowPagePathname(p) || p === '/') {
          return;
        }
      }
      if (refreshInFlight) return;
      refreshInFlight = true;
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: getRefreshRequestHeaders(),
        });
        if (response.ok) {
          const data = (await response.json()) as { success?: boolean; user?: User };
          if (data.user) {
            authUserStore.getState().setUser(data.user);
          }
          sessionPaused = false;
          lastRefreshAt = Date.now();
        } else if (response.status === 401) {
          logoutAndRedirect();
          sessionPaused = true;
        }
      } catch {
        // 네트워크 오류 등 — 다음 visibilitychange에서 재시도
      } finally {
        refreshInFlight = false;
      }
    };

    /** visibilitychange: 탭 복귀 시 디바운스 간격이 지났으면 refresh */
    const handleVisibilityChange = () => {
      if (cancelled || sessionPaused) return;
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastRefreshAt < MIN_REFRESH_INTERVAL_MS) return;
      void runRefresh();
    };

    // 마운트 시 즉시 1회 실행
    void runRefresh();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 스토어 구독: 로그아웃 → pause, 재로그인 → resume
    let prevUser = authUserStore.getState().user;
    const unsub = authUserStore.subscribe((state) => {
      const next = state.user;
      if (prevUser !== null && next === null) {
        sessionPaused = true;
      }
      if (prevUser === null && next !== null && sessionPaused) {
        sessionPaused = false;
        void runRefresh();
      }
      prevUser = next;
    });

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsub();
    };
  }, []);
}
