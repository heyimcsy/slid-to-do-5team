import { NextResponse } from 'next/server';
import { clearAuthCookies, clearOAuthUserFlashCookie } from '@/lib/auth/cookies';

export async function POST() {
  await clearAuthCookies();
  const res = NextResponse.json({ success: true as const });
  clearOAuthUserFlashCookie(res);
  return res;
}
