'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { authUserStore } from '@/stores/authUserStore';

/**
 * `/logout` 진입 — HttpOnly 쿠키는 클라이언트에서 제거할 수 없으므로 BFF `POST /api/auth/logout` 후 Zustand user 초기화.
 */
export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await apiClient<{ success?: boolean }>('/logout', {
          method: 'POST',
          clientPublicBase: '/api/auth',
          retry: false,
        });
      } catch {
        // BFF 실패해도 클라이언트 세션은 반드시 비움 (ApiClientError 시 unhandled rejection 방지)
      } finally {
        if (!cancelled) {
          authUserStore.getState().clearUser();
          router.refresh();
          router.replace('/');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
