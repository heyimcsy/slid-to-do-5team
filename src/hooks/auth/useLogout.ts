'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { performClientLogout } from '@/lib/auth/performClientLogout';

/** `POST /api/auth/logout` + 클라이언트 정리 후 `/`로 이동 */
export function useLogout() {
  const router = useRouter();
  return useCallback(() => performClientLogout(router), [router]);
}
