import 'server-only';

import { redirect } from 'next/navigation';
import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';

import { hasAuthSessionCookies } from './cookies';

function pickFirst(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

/**
 * 로그인/회원가입 RSC: 세션 쿠키가 있으면 대시보드 또는 안전한 `callbackUrl`로 보냄.
 * OAuth 실패 `?error=` 가 있으면 리다이렉트하지 않음 (`proxy.ts` 와 동일 정책).
 */
export async function redirectIfSessionOnAuthPage(searchParams: {
  callbackUrl?: string | string[];
  error?: string | string[];
}): Promise<void> {
  if (pickFirst(searchParams.error)?.trim()) return;
  if (!(await hasAuthSessionCookies())) return;
  const raw = pickFirst(searchParams.callbackUrl);
  redirect(getSafeCallbackPath(raw ?? null) ?? '/dashboard');
}
