'use client';

import type { User } from '@/lib/auth/schemas/user';

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiClientError } from '@/lib/apiClient';
import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';

export type GoogleOAuthSignInResult =
  | { ok: true; redirect: true }
  | { ok: true; user?: User; redirect?: false }
  | { ok: false; error: ApiClientError | Error };

function getAppOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/**
 * Google OAuth 2.0 Authorization Code — `accounts.google.com/o/oauth2/v2/auth` 로 이동 후
 * `GET /api/auth/oauth/google/callback` 에서 토큰 교환·로그인 완료.
 */
export function useGoogleOAuthSignIn() {
  const searchParams = useSearchParams();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const googleEnabled = Boolean(googleClientId);

  const isReady = googleEnabled;

  const signInWithGoogle = useCallback(async (): Promise<GoogleOAuthSignInResult> => {
    if (!googleEnabled || !googleClientId) {
      return { ok: false, error: new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.') };
    }
    if (typeof window === 'undefined') {
      return { ok: false, error: new Error('Google 로그인은 브라우저에서만 가능합니다.') };
    }

    const origin = getAppOrigin();
    if (!process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI?.trim() && !origin) {
      return {
        ok: false,
        error: new Error(
          'redirect_uri를 만들 수 없습니다. NEXT_PUBLIC_GOOGLE_REDIRECT_URI 또는 NEXT_PUBLIC_APP_URL을 설정하세요.',
        ),
      };
    }

    const returnPath = getSafeCallbackPath(searchParams.get('callbackUrl')) ?? '/dashboard';
    const startUrl = new URL('/api/auth/oauth/google/start', origin);
    startUrl.searchParams.set('callbackUrl', returnPath);
    window.location.assign(startUrl.toString());
    return { ok: true, redirect: true };
  }, [googleEnabled, googleClientId, searchParams]);

  return useMemo(
    () => ({
      signInWithGoogle,
      isReady,
      googleEnabled,
    }),
    [signInWithGoogle, isReady, googleEnabled],
  );
}
