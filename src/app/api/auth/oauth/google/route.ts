import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { completeGoogleBackendLogin } from '@/lib/auth/google/completeGoogleBackendLogin';
import { googleOAuthBodySchema } from '@/lib/auth/schemas/oauth';

/**
 * Google OAuth — 클라이언트가 GSI로 받은 `access_token`을 백엔드 `POST .../oauth/google`에 전달.
 * 백엔드 본문은 스네이크 `access_token` 키를 기대한다고 가정.
 */
export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: '잘못된 요청' }, { status: 400 });
  }

  const parsed = googleOAuthBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? '유효하지 않은 요청';
    return NextResponse.json({ success: false, message: msg }, { status: 400 });
  }

  const { accessToken } = parsed.data;
  const result = await completeGoogleBackendLogin(accessToken);

  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json(
    result.user ? { success: true as const, user: result.user } : { success: true as const },
  );
}
