'use client';

import { useInfiniteTodos } from '@/api/todos';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

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

  return (
    <div className="flex min-h-0 flex-col gap-x-8 gap-y-2 md:flex-row md:gap-2 lg:flex-row lg:gap-8">
      <TodoListSection
        title="TO DO"
        items={todoList}
        variant="pending"
        isLoading={pendingQuery.isLoading}
        isError={pendingQuery.isError}
        onRetry={() => {
          void pendingQuery.refetch();
        }}
        showScrollTail={Boolean(pendingQuery.hasNextPage || todoList.length > 0)}
        scrollSentinelRef={pendingObserverRef}
        isFetchingNextPage={pendingQuery.isFetchingNextPage}
      />

      <TodoListSection
        title="DONE"
        items={doneList}
        variant="completed"
        isLoading={doneQuery.isLoading}
        isError={doneQuery.isError}
        onRetry={() => {
          void doneQuery.refetch();
        }}
        showScrollTail={Boolean(doneQuery.hasNextPage || doneList.length > 0)}
        scrollSentinelRef={doneObserverRef}
        isFetchingNextPage={doneQuery.isFetchingNextPage}
      />
    </div>
  );
}
