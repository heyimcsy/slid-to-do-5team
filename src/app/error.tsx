'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { authUserStore } from '@/stores/authUserStore';

import { getPageTitle } from '@/utils/getPageTitle';

import { ErrorFallback } from '@/components/ErrorFallback';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const user = authUserStore((state) => state.user);
  const name = user?.name ?? '';

  useEffect(() => {
    console.error(error);
  }, [error]);

  const title = getPageTitle(pathname, name) || '오류 발생';

  return <ErrorFallback onRetry={reset} title={title} variant="full" />;
}
