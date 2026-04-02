import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import { googleOAuthBodySchema } from '@/lib/auth/schemas/oauth';

import { API_BASE_URL, API_TIMEOUT_MS } from '@/constants/api';
import { AUTH_CONFIG } from '@/constants/auth-config';
import {
  AUTH_SERVICE_ERROR_MESSAGE_KO,
  DUPLICATE_ACCOUNT_MESSAGE_KO,
} from '@/constants/error-message';

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
  const base = API_BASE_URL?.replace(/\/$/, '') ?? '';

  let data: Record<string, unknown>;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${base}/oauth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: accessToken }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (response.status === 409) {
        return NextResponse.json(
          { success: false, message: DUPLICATE_ACCOUNT_MESSAGE_KO },
          { status: 409 },
        );
      }
      const raw =
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message
          : 'Google 로그인 실패';
      return NextResponse.json({ success: false, message: raw }, { status: response.status });
    }

    data = (await response.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: AUTH_SERVICE_ERROR_MESSAGE_KO,
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }

  const { accessToken: at, refreshToken: rt, user } = parseTokenPairFromBackendJson(data);

  if (!at || !rt) {
    return NextResponse.json(
      {
        success: false,
        message: `토큰 응답 형식 오류 (${AUTH_CONFIG.ACCESS_TOKEN_KEY}/${AUTH_CONFIG.REFRESH_TOKEN_KEY})`,
      },
      { status: 502 },
    );
  }

  await setAuthCookies(at, rt);

  return NextResponse.json(user ? { success: true as const, user } : { success: true as const });
}
