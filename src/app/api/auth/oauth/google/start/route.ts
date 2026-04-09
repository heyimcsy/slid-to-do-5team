import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { createOAuthState } from '@/lib/auth/oauth-state';
import {
  GOOGLE_OAUTH_AUTHORIZE_BASE,
  GOOGLE_OAUTH_SCOPES,
  resolveGoogleOAuthRedirectUriForServer,
} from '@/lib/auth/oauth-urls';
import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';

import {
  GOOGLE_CLIENT_ID_UNSET_MESSAGE_KO,
  OAUTH_START_FAILED_MESSAGE_KO,
} from '@/constants/error-message';

export async function GET(request: NextRequest) {
  const BRAND_NAME = 'Google';
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (!googleClientId) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(`${BRAND_NAME} ${GOOGLE_CLIENT_ID_UNSET_MESSAGE_KO}`)}`,
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
        `/login?error=${encodeURIComponent(`${BRAND_NAME} ${OAUTH_START_FAILED_MESSAGE_KO}`)}`,
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
