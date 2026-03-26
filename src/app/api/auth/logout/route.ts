import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/cookies';

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ success: true as const });
}
