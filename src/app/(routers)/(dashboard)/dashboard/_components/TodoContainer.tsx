'use client';

import { useInfiniteTodos } from '@/api/todos';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { ErrorFallback } from '@/components/ErrorFallback';

import { PAGE_LIMIT } from '../_constants/todos';
import { TodoListSection } from './TodoListSection';

function matchesTodoSearch(title: string, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return title.toLowerCase().includes(q);
}

export function TodoContainer({
  goalId,
  searchQuery = '',
}: {
  goalId: number;
  searchQuery?: string;
}) {
  const pendingQuery = useInfiniteTodos({ goalId, done: false, limit: PAGE_LIMIT });
  const doneQuery = useInfiniteTodos({ goalId, done: true, limit: PAGE_LIMIT });

  const pendingTodosRaw = pendingQuery.data?.pages.flatMap((p) => p.todos) ?? [];
  const doneTodosRaw = doneQuery.data?.pages.flatMap((p) => p.todos) ?? [];

  const todoList = pendingTodosRaw.filter((item) => matchesTodoSearch(item.title, searchQuery));
  const doneList = doneTodosRaw.filter((item) => matchesTodoSearch(item.title, searchQuery));

  const { observerRef: pendingObserverRef } = useInfiniteScroll({
    hasNextPage: pendingQuery.hasNextPage ?? false,
    isFetchingNextPage: pendingQuery.isFetchingNextPage,
    fetchNextPage: pendingQuery.fetchNextPage,
  });

  const { observerRef: doneObserverRef } = useInfiniteScroll({
    hasNextPage: doneQuery.hasNextPage ?? false,
    isFetchingNextPage: doneQuery.isFetchingNextPage,
    fetchNextPage: doneQuery.fetchNextPage,
  });

  if (pendingQuery.isError || doneQuery.isError) {
    return (
      <div className="w-full">
        <ErrorFallback
          variant="compact"
          title="할 일을 불러오지 못했습니다"
          onRetry={() => {
            void pendingQuery.refetch();
            void doneQuery.refetch();
          }}
        />
      </div>
    );
  }

  const pendingFooter =
    pendingQuery.hasNextPage || todoList.length > 0 ? (
      <>
        {pendingQuery.hasNextPage ? (
          <div ref={pendingObserverRef} className="h-5 w-full shrink-0" aria-hidden />
        ) : null}
        {pendingQuery.isFetchingNextPage ? (
          <p className="font-sm-regular py-1 text-center text-gray-400">불러오는 중…</p>
        ) : null}
      </>
    ) : null;

  const doneFooter =
    doneQuery.hasNextPage || doneList.length > 0 ? (
      <>
        {doneQuery.hasNextPage ? (
          <div ref={doneObserverRef} className="h-5 w-full shrink-0" aria-hidden />
        ) : null}
        {doneQuery.isFetchingNextPage ? (
          <p className="font-sm-regular py-1 text-center text-gray-400">불러오는 중…</p>
        ) : null}
      </>
    ) : null;

  return (
    <div className="flex min-h-0 flex-col gap-x-8 gap-y-2 md:flex-row md:gap-2 lg:flex-row lg:gap-8">
      <TodoListSection
        title="TO DO"
        items={todoList}
        variant="pending"
        isLoading={pendingQuery.isLoading}
        listFooter={pendingFooter}
      />

      <TodoListSection
        title="DONE"
        items={doneList}
        variant="completed"
        isLoading={doneQuery.isLoading}
        listFooter={doneFooter}
      />
    </div>
  );
}
