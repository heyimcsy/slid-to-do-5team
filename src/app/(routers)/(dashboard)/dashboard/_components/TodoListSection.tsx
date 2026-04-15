import type { Todo } from '@/api/todos';
import type { RefObject } from 'react';

import Image from 'next/image';
import { cn } from '@/lib';

import { ErrorFallback } from '@/components/ErrorFallback';
import { Skeleton } from '@/components/ui/skeleton';

import TodoList from './TodoList';

function TodoListSectionSkeleton({ variant }: { variant: 'completed' | 'pending' }) {
  return (
    <div
      className={cn(
        'mt-4 flex max-h-40 min-h-16 flex-col gap-3 overflow-hidden pr-0.5',
        variant === 'completed' ? '' : '',
      )}
      role="status"
      aria-live="polite"
      aria-label="불러오는 중"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex h-10 min-h-10 w-full items-center gap-2 px-1 md:px-2 lg:h-12 lg:min-h-12"
        >
          <Skeleton variant="gray" className="size-[18px] shrink-0 rounded-md md:size-5" />
          <Skeleton
            variant="gray"
            className="h-4 flex-1 rounded-md"
            style={{ maxWidth: `${[72, 88, 64, 80][i % 4]}%` }}
          />
          <div className="ml-auto flex gap-1">
            <Skeleton variant="gray" className="size-5 shrink-0 rounded-md" />
            <Skeleton variant="gray" className="size-5 shrink-0 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TodoListSection({
  title,
  items,
  variant,
  isLoading = false,
  isError = false,
  onRetry,
  /** hasNextPage || items.length > 0 일 때 무한 스크롤 앵커 영역 표시 */
  showScrollTail = false,
  scrollSentinelRef,
  isFetchingNextPage = false,
  /** 검색/필터 적용 후에만 0건이고, 서버에서 내려온 원본 목록에는 항목이 있을 때 */
  isSearchNoResults = false,
}: {
  title: string;
  items: Todo[];
  variant: 'completed' | 'pending';
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  showScrollTail?: boolean;
  scrollSentinelRef?: RefObject<HTMLDivElement | null>;
  isFetchingNextPage?: boolean;
  isSearchNoResults?: boolean;
}) {
  const emptyText = variant === 'completed' ? '완료된' : '해야';
  const emptyImage =
    variant === 'completed' ? '/images/big-zero-done.svg' : '/images/big-zero-todo.svg';

  const showEmptyIllustration =
    items.length === 0 && !isLoading && !isError && !showScrollTail && !isSearchNoResults;

  return (
    <section
      className={cn(
        'flex min-h-0 flex-1 flex-col rounded-2xl p-4 md:w-1/2 md:flex-none md:p-4 lg:w-1/2 lg:flex-none lg:p-6',
        variant === 'completed'
          ? ''
          : 'bg-orange-100 text-black dark:bg-orange-300 dark:text-black',
      )}
    >
      <h2
        className={`shrink-0 text-xl font-bold ${variant === 'completed' ? 'text-gray-400' : 'text-orange-600'}`}
      >
        {title}
      </h2>

      {isError && onRetry ? (
        <div className="mt-4 min-h-0 flex-1">
          <ErrorFallback variant="compact" onRetry={onRetry} />
        </div>
      ) : isLoading && items.length === 0 ? (
        <TodoListSectionSkeleton variant={variant} />
      ) : isSearchNoResults ? (
        <div className="mt-4 flex flex-col items-center justify-center py-6">
          <p className="text-sm text-gray-500 dark:text-black">검색 결과가 없어요</p>
        </div>
      ) : showEmptyIllustration ? (
        <div className="mt-4 flex flex-col items-center justify-center">
          <Image
            src={emptyImage}
            alt={`${emptyText} 할 일 없음`}
            width={130}
            height={140}
            className="h-21.25 w-20 object-contain md:h-35 md:w-32.5 lg:h-35 lg:w-32.5"
          />
          <p className="text-sm text-gray-500 dark:text-black">{`${emptyText} 할 일이 없어요`}</p>
        </div>
      ) : (
        <div
          className={cn(
            'mt-4 max-h-40 min-h-0 overflow-x-hidden overflow-y-auto pr-0.5',
            'flex flex-col',
          )}
        >
          {items.map((item) => (
            <TodoList key={item.id} {...item} variant={variant} />
          ))}
          {showScrollTail && scrollSentinelRef ? (
            <div ref={scrollSentinelRef} className="h-5 w-full shrink-0" aria-hidden />
          ) : null}
          {isFetchingNextPage ? (
            <p className="font-sm-regular shrink-0 py-1 text-center text-gray-400">불러오는 중…</p>
          ) : null}
        </div>
      )}
    </section>
  );
}
