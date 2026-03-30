'use client';

import type { ToasterProps } from 'sonner';

import { cn } from '@/lib/shadcn';
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
  MultiplicationSignCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

/**
 * Sonner가 `classNames[toastType]`을 `<li data-sonner-toast>`에 붙임 — 제목·본문·아이콘 래퍼까지 색 상속/후손 선택자로 통일.
 * `richColors`가 true면 라이브러리 기본 팔레트가 우선할 수 있어 기본은 false (`...props`로 켤 수 있음).
 */
const toastTypeTextClassNames = {
  success:
    'text-emerald-800 dark:text-emerald-300 [&_[data-description]]:text-emerald-700/90 dark:[&_[data-description]]:text-emerald-400/90',
  info: 'text-sky-800 dark:text-sky-300 [&_[data-description]]:text-sky-700/90 dark:[&_[data-description]]:text-sky-400/90',
  warning:
    'text-amber-950 dark:text-amber-200 [&_[data-description]]:text-amber-900/90 dark:[&_[data-description]]:text-amber-300/90',
  error:
    'text-red-800 dark:text-red-300 [&_[data-description]]:text-red-700/90 dark:[&_[data-description]]:text-red-400/90',
  loading: 'text-muted-foreground [&_[data-description]]:text-muted-foreground/90',
} as const satisfies Record<'success' | 'info' | 'warning' | 'error' | 'loading', string>;

const iconToneClassName = {
  success: 'size-4 text-emerald-600',
  info: 'size-4 text-sky-600',
  warning: 'size-4 text-amber-600',
  error: 'size-4 text-red-600',
  loading: 'size-4 animate-spin text-muted-foreground',
} as const;

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      visibleToasts={5}
      richColors={false}
      className={cn('toaster group', className)}
      position="top-center"
      icons={{
        success: (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            strokeWidth={1}
            className={iconToneClassName.success}
          />
        ),
        info: (
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={1}
            className={iconToneClassName.info}
          />
        ),
        warning: (
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={1} className={iconToneClassName.warning} />
        ),
        error: (
          <HugeiconsIcon
            icon={MultiplicationSignCircleIcon}
            strokeWidth={1}
            className={iconToneClassName.error}
          />
        ),
        loading: (
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={1}
            className={iconToneClassName.loading}
          />
        ),
      }}
      style={
        {
          '--normal-bg': 'color-mix(in oklch, var(--popover) 12.5%, transparent)',
          '--normal-text': 'var(--font-base-medium)',
          '--normal-border': 'var(--orange-500)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            'cn-toast backdrop-blur-xl backdrop-saturate-150 shadow-lg ring-1 ring-orange-500/20 border-none',
          ...toastTypeTextClassNames,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
