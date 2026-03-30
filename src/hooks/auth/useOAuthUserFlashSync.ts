'use client';

/**
 * OAuth 플래시 쿠키(`oauth_user_flash`)를 BFF로 동기화한 뒤 클라이언트 스토어에 반영할 때 쓰는 훅.
 *
 * @see `OAUTH_SYNC_USER_QUERY` — 콜백이 리다이렉트 URL에 붙이는 `_oauth=1` 신호
 * @see `src/app/api/auth/oauth/sync-user/route.ts` — 동기화 API
 */
import type { User } from '@/lib/auth/schemas/user';

import { useEffect } from 'react';
import { OAUTH_SYNC_USER_QUERY } from '@/lib/auth/oauth-urls';
import { authUserStore } from '@/stores/authUserStore';

/**
 * 현재 주소에서 `{@link OAUTH_SYNC_USER_QUERY}`(`_oauth`)만 제거하고 `history.replaceState`로 반영한다.
 *
 * @remarks
 * 동기화가 **끝난 뒤**(성공 또는 재시도가 무의미한 4xx)에만 호출한다. 네트워크/5xx 등으로
 * 아직 사용자 정보를 못 받았을 때는 호출하지 않아, URL에 `_oauth=1`이 남아 새로고침 시 같은 훅이 다시 시도할 수 있다.
 */
function stripOAuthSyncQueryFromCurrentUrl(): void {
  const u = new URL(window.location.href);
  if (u.searchParams.get(OAUTH_SYNC_USER_QUERY) !== '1') return;
  u.searchParams.delete(OAUTH_SYNC_USER_QUERY);
  const qs = u.searchParams.toString();
  window.history.replaceState({}, '', `${u.pathname}${qs ? `?${qs}` : ''}${u.hash}`);
}

/**
 * 마운트 시 URL에 `_oauth=1`이 있으면 `POST /api/auth/oauth/sync-user`로 일회용 플래시 쿠키를 읽어
 * {@link authUserStore}에 사용자를 넣는다 (이메일 로그인/회원가입 직후와 동일한 클라이언트 상태).
 *
 * @remarks
 * **쿼리 제거 정책** — `finally`로 무조건 지우면 일시적 실패(네트워크, 비 JSON 응답, 5xx) 후에도
 * 재시도 신호가 사라져 “로그인됐는데 비로그인처럼 보이는” 상태가 될 수 있다.
 * - 제거: `200` + `success` + `user`, 또는 BFF가 명시한 **재시도 무의미** 응답(`400`/`404`).
 * - 유지: fetch 실패, JSON 파싱 실패, 그 외 4xx/5xx → 사용자가 새로고침하면 동일 플로우 재실행.
 *
 * @example
 * 레이아웃 또는 OAuth 콜백 후 랜딩 페이지에서 한 번만 마운트.
 * ```tsx
 * useOAuthUserFlashSync();
 * ```
 */
export function useOAuthUserFlashSync(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    if (url.searchParams.get(OAUTH_SYNC_USER_QUERY) !== '1') return;

    void (async () => {
      try {
        const r = await fetch('/api/auth/oauth/sync-user', {
          method: 'POST',
          credentials: 'include',
        });

        let data: { success?: boolean; user?: User };
        try {
          data = (await r.json()) as { success?: boolean; user?: User };
        } catch {
          // 응답 본문이 JSON이 아니면 일시적 프록시/게이트웨이 오류일 수 있음 — 쿼리 유지
          return;
        }

        if (r.ok && data.success && data.user) {
          authUserStore.getState().setUser(data.user);
          stripOAuthSyncQueryFromCurrentUrl();
          return;
        }

        // `sync-user` route: 플래시 없음(404)·형식 오류(400)는 쿠키/플래시가 이미 정리된 쪽이라 재시도 무의미
        if (r.status === 404 || r.status === 400) {
          stripOAuthSyncQueryFromCurrentUrl();
          return;
        }

        // 5xx, 기타 4xx, 예상 밖 200 등 — URL에 `_oauth` 유지(새로고침 시 재시도 가능)
      } catch {
        // fetch 네트워크 오류 — 쿼리 유지
      }
    })();
  }, []);
}
