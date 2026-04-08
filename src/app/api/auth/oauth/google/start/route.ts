import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { createOAuthState } from '@/lib/auth/oauth-state';
import {
  GOOGLE_OAUTH_AUTHORIZE_BASE,
  GOOGLE_OAUTH_SCOPES,
  resolveGoogleOAuthRedirectUriForServer,
} from '@/lib/auth/oauth-urls';
import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';

import { OAUTH_START_FAILED_MESSAGE_KO } from '@/constants/error-message';

export async function GET(request: NextRequest) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (!googleClientId) {
    return NextResponse.redirect(
      new URL(
        '/login?error=NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.',
        request.nextUrl.origin,
      ),
    );
  }

  let redirectUri: string;
  try {
    redirectUri = resolveGoogleOAuthRedirectUriForServer();
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
  const state = createOAuthState('google', returnPath);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: googleClientId,
    redirect_uri: redirectUri,
    state,
    scope: GOOGLE_OAUTH_SCOPES,
    access_type: 'online',
    include_granted_scopes: 'true',
  });

  return NextResponse.redirect(`${GOOGLE_OAUTH_AUTHORIZE_BASE}?${params.toString()}`);
}
