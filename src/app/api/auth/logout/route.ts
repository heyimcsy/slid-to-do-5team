import { NextResponse } from 'next/server';
import { clearAuthCookies, clearOAuthUserFlashCookie } from '@/lib/auth/cookies';

/** HttpOnly 쿠키만 제거. localStorage/sessionStorage의 RQ·Zustand persist는 클라이언트 `performClientLogout`에서 비움. */
export async function POST() {
  await clearAuthCookies();
  const res = NextResponse.json({ success: true as const });
  clearOAuthUserFlashCookie(res);
  return res;
}
