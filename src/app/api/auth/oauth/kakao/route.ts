import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { completeKakaoBackendLogin } from '@/lib/auth/kakao/completeKakaoBackendLogin';
import { kakaoOAuthBodySchema } from '@/lib/auth/schemas/oauth';

/**
 * Kakao OAuth — 클라이언트가 받은 카카오 `access_token`을 백엔드 `POST .../oauth/kakao`에 전달 (JS SDK 등).
 * Authorization Code 플로우는 `GET /api/auth/oauth/kakao/callback` 사용.
 */
export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: '잘못된 요청' }, { status: 400 });
  }

  const parsed = kakaoOAuthBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? '유효하지 않은 요청';
    return NextResponse.json({ success: false, message: msg }, { status: 400 });
  }

  const { accessToken } = parsed.data;
  const result = await completeKakaoBackendLogin(accessToken);

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
