'use client';

import type { FilterType } from './_components/TodoTabs';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteTodos } from '@/api/todos';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import TodoList from '@/components/common/TodoList';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import TodoHeader from './_components/TodoHeader';
import TodoListSkeleton from './_components/TodoListSkeleton';
import TodoTabs from './_components/TodoTabs';

export default function TodosPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [isNavigating, setIsNavigating] = useState(false);
  const doneParam = filter === 'TODO' ? false : filter === 'DONE' ? true : undefined;
  const { data, isLoading, error, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteTodos({ done: doneParam, limit: 40 });
  const { observerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });
  const allTodos = data?.pages.flatMap((page) => page.todos) ?? [];
  const handleAddTodo = () => {
    setIsNavigating(true);
    router.push(`/goals/todos/new`);
  };
  if (error || !data) return <ErrorFallback title="모든 할 일" onRetry={refetch} />;

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto px-4 py-10">
      {isNavigating && <Spinner text="로딩 중" />}
      <div className="mx-auto flex w-full max-w-2xl flex-col">
        <div className="mb-4 hidden px-2 md:block">
          <TodoHeader count={data?.pages[0]?.totalCount ?? 0} />
        </div>

        <div className="mb-2 flex items-center justify-between">
          <TodoTabs active={filter} onChange={setFilter} />
          <Button variant="ghost" size="sm" className="min-w-0 md:hidden" onClick={handleAddTodo}>
            + 할 일 추가
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="hidden min-w-0 md:block"
            onClick={handleAddTodo}
          >
            + 할 일 추가
          </Button>
        </div>
        {isLoading ? (
          <TodoListSkeleton />
        ) : (
          <TodoList todolists={allTodos} observerRef={observerRef} />
        )}
      </div>
    </div>
  );
}
