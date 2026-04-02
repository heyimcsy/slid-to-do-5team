'use client';

import type { FilterType } from './_components/TodoTabs';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTodos } from '@/api/todos';

import { Button } from '@/components/ui/button';

import TodoList from '../../../../../components/common/TodoList';
import TodoHeader from './_components/TodoHeader';
import TodoTabs from './_components/TodoTabs';

export default function TodosPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const doneParam = filter === 'TODO' ? false : filter === 'DONE' ? true : undefined;
  const { data, isLoading, error } = useGetTodos({ done: doneParam, limit: 40 });

  if (isLoading) return <div>로딩중...</div>;
  if (error || !data) return <div>에러</div>;

  return (
    <div className="flex h-full w-full flex-col items-center px-4 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <div className="mb-4 hidden px-2 md:block">
          <TodoHeader count={data.totalCount} />
        </div>

        <div className="mb-2 flex items-center justify-between">
          <TodoTabs active={filter} onChange={setFilter} />
          <Button
            variant="ghost"
            size="sm"
            className="min-w-0 md:hidden"
            onClick={() => {
              router.push(`/goals/todos/new`);
            }}
          >
            + 할 일 추가
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="hidden min-w-0 md:block"
            onClick={() => {
              router.push(`/goals/todos/new`);
            }}
          >
            + 할 일 추가
          </Button>
        </div>

        <TodoList todolists={data.todos} />
      </div>
    </div>
  );
}
