'use client';

import type { FilterType } from './_components/TodoTabs';

import { useState } from 'react';
import { useGetTodos } from '@/api/todos';

import { Button } from '@/components/ui/button';

import TodoHeader from './_components/TodoHeader';
import TodoList from './_components/TodoList';
import TodoTabs from './_components/TodoTabs';

export default function TodosPage() {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const { data, isLoading, error } = useGetTodos({ limit: 40 });

  if (isLoading) return <div>로딩중...</div>;
  if (error || !data) return <div>에러</div>;

  const filteredTasks = data.todos.filter((todo) => {
    if (filter === 'TODO') return !todo.done;
    if (filter === 'DONE') return todo.done;
    return true;
  });

  return (
    <div className="flex h-full w-full flex-col items-center px-4 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <div className="mb-4 hidden px-2 md:block">
          <TodoHeader count={data.todos.length} />
        </div>

        <div className="mb-2 flex items-center justify-between">
          <TodoTabs active={filter} onChange={setFilter} />
          <Button variant="ghost" size="sm" className="min-w-0 md:hidden">
            + 할 일 추가
          </Button>
          <Button variant="ghost" size="md" className="hidden min-w-0 md:block">
            + 할 일 추가
          </Button>
        </div>

        <TodoList todolists={filteredTasks} />
      </div>
    </div>
  );
}
