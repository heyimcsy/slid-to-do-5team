'use client';

import type { AuthLinkVariantProps } from '../_types/auth';



import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

const AuthFooterInner = ({ variant }: AuthLinkVariantProps): React.ReactNode => {
  const { message, href, linkLabel, snsDividerLabel } = AUTH_LINK_VARIANTS[variant || 'login'];
  if (!message || !href || !linkLabel) {
    return null;
  }
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
      <div className="flex items-center justify-center gap-x-4 pt-4 *:duration-250 *:hover:scale-105 *:hover:transition-transform">
        <IconButton
          variant="icon"
          aria-label="Google로 로그인"
          className="size-14 rounded-full border border-gray-200 bg-white"
        >
          <Icon name="google" size={32} />
        </IconButton>
        <IconButton
          variant="icon"
          aria-label="Kakao로 로그인"
          className="size-14 rounded-full border border-transparent bg-[oklch(93.68%_0.177_101.44)]"
        >
          <Icon name="kakao" size={32} />
        </IconButton>
      </div>
    </footer>
  );
};

export const AuthFooter = memo(AuthFooterInner);
AuthFooter.displayName = 'AuthFooter';
