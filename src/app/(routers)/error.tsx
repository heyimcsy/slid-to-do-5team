'use client';

import { usePathname } from 'next/navigation';
import { authUserStore } from '@/stores/authUserStore';

import { getPageTitle } from '@/utils/getPageTitle';

import { ErrorFallback } from '@/components/ErrorFallback';

export default function Error({ reset }: { reset: () => void }) {
  const pathname = usePathname();
  const user = authUserStore((state) => state.user);
  const name = user?.name ?? '';

  const title = getPageTitle(pathname, name) || '오류 발생';

  return <ErrorFallback onRetry={reset} title={title} />;
}
