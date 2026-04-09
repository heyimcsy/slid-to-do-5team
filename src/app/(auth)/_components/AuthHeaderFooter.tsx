'use client';

import type { AuthLinkVariantProps } from '../_types/auth';

import { memo, Suspense, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleOAuthSignIn } from '@/hooks/auth/useGoogleOAuthSignIn';
import { useKakaoOAuthSignIn } from '@/hooks/auth/useKakaoOAuthSignIn';
import { ApiClientError } from '@/lib/apiClient';
import { getOAuthUserFacingMessageKo } from '@/lib/auth/oauthUserFacingMessage';
import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';
import { authUserStore } from '@/stores/authUserStore';
import { toast } from 'sonner';

import { Icon } from '@/components/icon/Icon';
import { IconButton } from '@/components/ui/button';

import { AUTH_LINK_VARIANTS } from '../_constants/auth';

/**
 * @description 회원가입/로그인 폼 상단에 표시되는 헤더(슬리드투두 로고)
 * @returns AuthHeader - 슬리드투두 로고 컴포넌트
 */
const AuthHeaderInner = (): React.ReactNode => {
  return (
    <header className="flex pb-10 text-2xl font-semibold *:px-2">
      <Image
        src="/images/logo.svg"
        alt="슬리드투두"
        width={200}
        height={48}
        className="h-auto w-50"
        priority
      />
    </header>
  );
};

export const AuthHeader = memo(AuthHeaderInner);
AuthHeader.displayName = 'AuthHeader';

const AuthFooterBody = ({ variant }: AuthLinkVariantProps): React.ReactNode => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [googleBusy, setGoogleBusy] = useState(false);
  const [kakaoBusy, setKakaoBusy] = useState(false);

  const { signInWithGoogle, isReady: googleReady } = useGoogleOAuthSignIn();
  const { signInWithKakao, isReady: kakaoReady } = useKakaoOAuthSignIn();

  const { message, href, linkLabel, snsDividerLabel } = AUTH_LINK_VARIANTS[variant || 'login'];
  if (!message || !href || !linkLabel) {
    return null;
  }

  const navigateAfterOAuth = () => {
    const nextPath = getSafeCallbackPath(searchParams.get('callbackUrl')) ?? '/dashboard';
    router.refresh();
    router.push(nextPath);
  };

  const onGoogleClick = async () => {
    setGoogleBusy(true);
    try {
      const result = await signInWithGoogle();
      if (result.ok) {
        if ('redirect' in result && result.redirect) {
          return;
        }
        if (result.user) {
          authUserStore.getState().setUser(result.user);
        } else {
          authUserStore.getState().clearUser();
        }
        navigateAfterOAuth();
      } else {
        const err = result.error;
        const msg =
          err instanceof ApiClientError ? err.message : err instanceof Error ? err.message : '오류';
        toast.error(getOAuthUserFacingMessageKo(msg));
      }
    } finally {
      setGoogleBusy(false);
    }
  };

  const onKakaoClick = async () => {
    setKakaoBusy(true);
    try {
      const result = await signInWithKakao();
      if (result.ok) {
        if ('redirect' in result && result.redirect) {
          return;
        }
        if (result.user) {
          authUserStore.getState().setUser(result.user);
        } else {
          authUserStore.getState().clearUser();
        }
        navigateAfterOAuth();
      } else {
        const err = result.error;
        const msg =
          err instanceof ApiClientError ? err.message : err instanceof Error ? err.message : '오류';
        toast.error(getOAuthUserFacingMessageKo(msg));
      }
    } finally {
      setKakaoBusy(false);
    }
  };

  return (
    <footer className="text-muted-foreground text-sm">
      <div className="py-6">
        {message}{' '}
        <Link href={href} className="text-orange-500 underline-offset-4 hover:underline">
          {linkLabel}
        </Link>
      </div>
      <div className="flex items-center gap-x-2" role="separator" aria-label={snsDividerLabel}>
        <span className="bg-border h-px min-w-0 flex-1 shrink" aria-hidden />
        <span className="shrink-0 text-sm text-gray-500">{snsDividerLabel}</span>
        <span className="bg-border h-px min-w-0 flex-1 shrink" aria-hidden />
      </div>
      <div className="flex flex-col items-center justify-center gap-y-2 pt-4">
        <div className="[&>button:active]: flex items-center justify-center gap-x-4 *:duration-250 *:hover:scale-105 *:hover:transition-transform [&>button:active]:scale-100 [&>button:active]:grayscale">
          <IconButton
            type="button"
            variant="icon"
            aria-label="Google로 로그인"
            className="size-14 rounded-full border border-gray-200 bg-white"
            disabled={!googleReady || googleBusy}
            onClick={() => void onGoogleClick()}
          >
            <Icon name="google" size={32} />
          </IconButton>
          <IconButton
            type="button"
            variant="icon"
            aria-label="Kakao로 로그인"
            className="size-14 rounded-full border border-transparent bg-[oklch(93.68%_0.177_101.44)]"
            disabled={!kakaoReady || kakaoBusy}
            onClick={() => void onKakaoClick()}
          >
            <Icon name="kakao" size={32} />
          </IconButton>
        </div>
      </div>
    </footer>
  );
};

const AuthFooterInner = ({ variant }: AuthLinkVariantProps): React.ReactNode => {
  return (
    <Suspense fallback={null}>
      <AuthFooterBody variant={variant} />
    </Suspense>
  );
};

export const AuthFooter = memo(AuthFooterInner);
AuthFooter.displayName = 'AuthFooter';
