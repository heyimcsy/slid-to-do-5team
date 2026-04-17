'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { performClientLogout } from '@/lib/auth/performClientLogout';
import { useQueryClient } from '@tanstack/react-query';

/** `POST /api/auth/logout` + 클라이언트 정리 후 `/`로 이동 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useCallback(() => performClientLogout(router, queryClient), [router, queryClient]);
}
