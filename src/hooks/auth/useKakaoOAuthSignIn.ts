'use client';

import type { User } from '@/lib/auth/schemas/user';

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiClientError } from '@/lib/apiClient';
import {
  COOKIE_OAUTH_KAKAO_RETURN_PATH,
  COOKIE_OAUTH_KAKAO_STATE,
  KAKAO_OAUTH_AUTHORIZE_BASE,
  resolveKakaoOAuthRedirectUri,
} from '@/lib/auth/oauth-urls';
import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';

export type KakaoOAuthSignInResult =
  | { ok: true; redirect: true }
  | { ok: true; user?: User; redirect?: false }
  | { ok: false; error: ApiClientError | Error };

const OAUTH_COOKIE_MAX_AGE_SEC = 600;

function setShortLivedCookie(name: string, value: string) {
  const safe = encodeURIComponent(value);
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${safe}; Path=/; Max-Age=${OAUTH_COOKIE_MAX_AGE_SEC}; SameSite=Lax${secure}`;
}

function getAppOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/**
 * Kakao OAuth 2.0 Authorization Code — `kauth.kakao.com/oauth/authorize` 로 이동 후
 * `GET /api/auth/oauth/kakao/callback` 에서 토큰 교환·로그인 완료.
 */
export function useKakaoOAuthSignIn() {
  const searchParams = useSearchParams();
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID?.trim();
  const kakaoEnabled = Boolean(kakaoKey);

  const isReady = kakaoEnabled;

  const signInWithKakao = useCallback(async (): Promise<KakaoOAuthSignInResult> => {
    if (!kakaoEnabled || !kakaoKey) {
      return { ok: false, error: new Error('NEXT_PUBLIC_KAKAO_CLIENT_ID가 설정되지 않았습니다.') };
    }
    if (typeof window === 'undefined') {
      return { ok: false, error: new Error('카카오 로그인은 브라우저에서만 가능합니다.') };
    }

    const origin = getAppOrigin();
    if (!process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI?.trim() && !origin) {
      return {
        ok: false,
        error: new Error(
          'redirect_uri를 만들 수 없습니다. NEXT_PUBLIC_KAKAO_REDIRECT_URI 또는 NEXT_PUBLIC_APP_URL을 설정하세요.',
        ),
      };
    }

    const redirectUri = resolveKakaoOAuthRedirectUri(origin);
    const state = crypto.randomUUID();
    const returnPath = getSafeCallbackPath(searchParams.get('callbackUrl')) ?? '/dashboard';

    try {
      setShortLivedCookie(COOKIE_OAUTH_KAKAO_STATE, state);
      setShortLivedCookie(COOKIE_OAUTH_KAKAO_RETURN_PATH, returnPath);
    } catch {
      return { ok: false, error: new Error('로그인 상태 저장에 실패했습니다.') };
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: kakaoKey,
      redirect_uri: redirectUri,
      state,
    });

    window.location.assign(`${KAKAO_OAUTH_AUTHORIZE_BASE}?${params.toString()}`);
    return { ok: true, redirect: true };
  }, [kakaoEnabled, kakaoKey, searchParams]);

  return useMemo(
    () => ({
      signInWithKakao,
      isReady,
      kakaoEnabled,
    }),
    [signInWithKakao, isReady, kakaoEnabled],
  );
}
