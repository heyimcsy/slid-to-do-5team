import type { ComponentType } from 'react';

import { cn } from '@/lib/shadcn';

export type ErrorFallbackVariant = 'full' | 'embedded' | 'compact';

export interface ErrorFallbackProps {
  onRetry: () => void;
  title?: string;
  /** full: 페이지급(기본), embedded: 섹션/탭, compact: 카드·위젯 */
  variant?: ErrorFallbackVariant;
  className?: string;
}

const variantClassNames: Record<
  ErrorFallbackVariant,
  { root: string; title: string; body: string; message: string; button: string }
> = {
  full: {
    root: 'h-full w-full bg-gray-100 px-4 py-6 md:px-8 md:py-12',
    title: 'font-xl-semibold md:font-2xl-semibold mb-6 px-2 text-black md:mb-8',
    body: 'flex flex-col items-center gap-4 py-40',
    message: 'font-3xl-regular mb-4 text-gray-600',
    button: 'font-sm-medium rounded-xl bg-orange-500 px-5 py-2.5 text-white',
  },
  embedded: {
    root: 'flex h-full min-h-[12rem] w-full min-w-0 flex-col bg-gray-100 px-4 py-4 md:px-6 md:py-6',
    title: 'font-lg-semibold md:font-xl-semibold mb-3 shrink-0 px-1 text-black md:mb-4',
    body: 'flex min-h-0 flex-1 flex-col items-center justify-center gap-3 py-8 md:py-12',
    message: 'font-xl-regular text-center text-gray-600',
    button: 'font-sm-medium rounded-xl bg-orange-500 px-5 py-2.5 text-white',
  },
  compact: {
    root: 'flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-5',
    title: 'font-sm-semibold mb-0.5 text-center text-gray-800',
    body: 'flex flex-col items-center gap-2',
    message: 'font-base-regular text-center text-gray-600',
    button: 'font-xs-medium rounded-lg bg-orange-500 px-4 py-2 text-white',
  },
};

/**
 * @description 각 variant 별 스타일이 적용됨
 * @param onRetry - 다시 시도하기 버튼 클릭 시 호출되는 함수
 * @param title - 에러 메시지 제목
 * @param variant - full: 페이지급(기본), embedded: 섹션/탭, compact: 카드·위젯
 * @param className - 에러 메시지 컴포넌트 클래스
 * @returns ErrorFallback 컴포넌트
 */
export function ErrorFallback({ onRetry, title, variant = 'full', className }: ErrorFallbackProps) {
  const v = variantClassNames[variant];

  return (
    <div className={cn(v.root, className)}>
      <h1 className={cn(v.title, title ? 'block' : 'hidden')}>{title}</h1>
      <div className={v.body}>
        <p className={v.message}>데이터를 불러오지 못했어요.</p>
        <button type="button" onClick={onRetry} className={v.button}>
          다시 시도하기
        </button>
      </div>
    </div>
  );
}

/** HOC: `isError` / `onRetry`가 props로 전달될 때 분기 로직을 공통화 */
export type WithErrorFallbackProps = {
  isError: boolean;
  onRetry: () => void;
};

/**
 *
 * @param Component - 에러 메시지를 표시할 컴포넌트
 * @param options - 에러 메시지 컴포넌트 옵션
 * @param options.title - 에러 메시지 제목
 * @param options.variant - 에러 메시지 컴포넌트 변형
 * @param options.className - 에러 메시지 컴포넌트 클래스
 * @returns
 */
export function withErrorFallback<P extends object>(
  Component: ComponentType<P>,
  options: {
    title?: string;
    variant?: ErrorFallbackVariant;
    className?: string;
  },
): ComponentType<P & WithErrorFallbackProps> {
  function WithErrorFallback(props: P & WithErrorFallbackProps) {
    const { isError, onRetry, ...rest } = props;
    if (isError) {
      return (
        <ErrorFallback
          onRetry={onRetry}
          title={options.title ?? '알 수 없는 오류'}
          variant={options.variant ?? 'full'}
          className={options.className}
        />
      );
    }
    return <Component {...(rest as P)} />;
  }

  const name = Component.displayName ?? Component.name ?? 'Component';
  WithErrorFallback.displayName = `withErrorFallback(${name})`;

  return WithErrorFallback;
}
