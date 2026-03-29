'use client';

import type { User } from '@/lib/auth/schemas/user';

import { useEffect } from 'react';
import { OAUTH_SYNC_USER_QUERY } from '@/lib/auth/oauth-urls';
import { authUserStore } from '@/stores/authUserStore';

/**
 * OAuth 콜백 리다이렉트 URL에 `?_oauth=1`이 있으면 `POST /api/auth/oauth/sync-user`로
 * `oauth_user_flash` 쿠키의 사용자를 `authUserStore`에 넣는다 (login/signup과 동일).
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
        const data = (await r.json()) as { success?: boolean; user?: User };
        if (r.ok && data.success && data.user) {
          authUserStore.getState().setUser(data.user);
        }
      } catch {
        // 네트워크 오류 — 무시
      } finally {
        url.searchParams.delete(OAUTH_SYNC_USER_QUERY);
        const qs = url.searchParams.toString();
        window.history.replaceState({}, '', `${url.pathname}${qs ? `?${qs}` : ''}${url.hash}`);
      }
    })();
  }, []);
}
