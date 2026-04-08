import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { createOAuthState } from '@/lib/auth/oauth-state';
import {
  KAKAO_OAUTH_AUTHORIZE_BASE,
  resolveKakaoOAuthRedirectUriForServer,
} from '@/lib/auth/oauth-urls';
import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';

import { OAUTH_START_FAILED_MESSAGE_KO } from '@/constants/error-message';

export async function GET(request: NextRequest) {
  const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID?.trim();
  if (!kakaoClientId) {
    return NextResponse.redirect(
      new URL(
        '/login?error=NEXT_PUBLIC_KAKAO_CLIENT_ID가 설정되지 않았습니다.',
        request.nextUrl.origin,
      ),
    );
  }

  let redirectUri: string;
  try {
    redirectUri = resolveKakaoOAuthRedirectUriForServer();
  } catch {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(OAUTH_START_FAILED_MESSAGE_KO)}`,
        request.nextUrl.origin,
      ),
    );
  }

  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
  const returnPath = getSafeCallbackPath(callbackUrl) ?? '/dashboard';
  const state = createOAuthState('kakao', returnPath);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: kakaoClientId,
    redirect_uri: redirectUri,
    state,
  });

  return NextResponse.redirect(`${KAKAO_OAUTH_AUTHORIZE_BASE}?${params.toString()}`);
}
