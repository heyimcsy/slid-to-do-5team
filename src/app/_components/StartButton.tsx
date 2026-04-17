'use client';

import Link from 'next/link';
import { cn } from '@/lib';

import { buttonVariants } from '@/components/ui/button';

export function StartButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: 'default', size: 'md' }),
        'font-sm-semibold md:font-lg-semibold lg:font-lg-semibold w-24.5 md:w-47 lg:w-47 dark:bg-orange-300 dark:text-black dark:hover:bg-orange-200',
      )}
    >
      {children}
    </Link>
  );
}
