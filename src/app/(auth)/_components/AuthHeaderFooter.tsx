'use client';

import type { AuthLinkVariantProps } from '../_types/auth';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  const { message, href, linkLabel } = AUTH_LINK_VARIANTS[variant || 'login'];
  if (!message || !href || !linkLabel) {
    return null;
  }
  return (
    <footer className="text-muted-foreground pt-6 text-sm">
      {message}{' '}
      <Link href={href} className="text-orange-500 underline-offset-4 hover:underline">
        {linkLabel}
      </Link>
    </footer>
  );
};

export const AuthFooter = memo(AuthFooterInner);
AuthFooter.displayName = 'AuthFooter';
