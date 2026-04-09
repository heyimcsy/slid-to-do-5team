import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { createOAuthState } from '@/lib/auth/oauth-state';
import {
  KAKAO_OAUTH_AUTHORIZE_BASE,
  resolveKakaoOAuthRedirectUriForServer,
} from '@/lib/auth/oauth-urls';
import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';

import {
  KAKAO_CLIENT_ID_UNSET_MESSAGE_KO,
  OAUTH_START_FAILED_MESSAGE_KO,
} from '@/constants/error-message';

export async function GET(request: NextRequest) {
  const BRAND_NAME = 'Kakao';
  const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID?.trim();
  if (!kakaoClientId) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(`${BRAND_NAME} ${KAKAO_CLIENT_ID_UNSET_MESSAGE_KO}`)}`,
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
        `/login?error=${encodeURIComponent(`${BRAND_NAME} ${OAUTH_START_FAILED_MESSAGE_KO}`)}`,
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
