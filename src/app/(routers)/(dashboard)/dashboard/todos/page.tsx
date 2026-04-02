'use client';

import type { FilterType } from './_components/TodoTabs';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTodos } from '@/api/todos';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

import TodoList from '../../../../../components/common/TodoList';
import TodoHeader from './_components/TodoHeader';
import TodoTabs from './_components/TodoTabs';

export default function TodosPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [isNavigating, setIsNavigating] = useState(false);
  const doneParam = filter === 'TODO' ? false : filter === 'DONE' ? true : undefined;
  const { data, isLoading, error } = useGetTodos({ done: doneParam, limit: 40 });
  const handleAddTodo = () => {
    setIsNavigating(true);
    router.push(`/goals/todos/new`);
  };
  if (isLoading)
    return (
      <div className="w-full flex-1 rounded-2xl bg-white px-2 py-3 shadow-sm">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 rounded-2xl px-2 py-2 md:px-4 md:py-3 lg:px-8"
          >
            <Skeleton variant="gray" className="size-[18px] shrink-0 rounded-md" />

            <div className="flex flex-1 items-center justify-between gap-2">
              <Skeleton variant="gray" className="h-4 w-1/2" />

              <Skeleton variant="gray" className="size-5 shrink-0 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  if (error || !data) return <div>에러</div>;

  return (
    <div className="flex h-full w-full flex-col items-center px-4 py-10">
      {isNavigating && <Spinner text="로딩 중" />}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <div className="mb-4 hidden px-2 md:block">
          <TodoHeader count={data.totalCount} />
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

        <TodoList todolists={data.todos} />
      </div>
    </div>
  );
}
