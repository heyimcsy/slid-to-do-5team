'use client';

import type { TodoWithFavorites } from '@/api/todos';
import type { TotalListTabProps } from '@/app/(routers)/(todo)/goals/types';

import { useGetTodos } from '@/api/todos';
import { TodoSection } from '@/app/(routers)/(todo)/goals/[goalId]/_components/TodoSection';
import { TodoSectionSkeleton } from '@/app/(routers)/(todo)/goals/[goalId]/_components/TodoSectionSkeleton';

export default function TotalListTab({ goalId }: TotalListTabProps) {
  const { data, isSuccess, isLoading } = useGetTodos({ goalId });

  const todoLists = data?.todos.filter((todo: TodoWithFavorites) => !todo.done) ?? [];
  const todoListsDone = data?.todos.filter((todo: TodoWithFavorites) => todo.done) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 md:space-y-4 lg:flex-row lg:space-x-8">
        <TodoSectionSkeleton showActions />
        <TodoSectionSkeleton />
      </div>
    );
  }
  if (isSuccess)
    return (
      <div className="flex flex-col space-y-4 md:space-y-4 lg:flex-row lg:space-x-8">
        <TodoSection
          goalId={goalId}
          title="TO DO"
          todos={todoLists}
          bgColor="bg-orange-100"
          emptyImage="/images/big-zero-todo.svg"
          emptyText="해야할 일이 아직 없어요"
          showActions
        />
        <TodoSection
          goalId={goalId}
          title="DONE"
          todos={todoListsDone}
          bgColor="bg-white"
          emptyImage="/images/big-zero-done.svg"
          emptyText="완료한 일이 아직 없어요"
        />
      </div>
    );
}
