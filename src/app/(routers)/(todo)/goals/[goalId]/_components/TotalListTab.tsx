'use client';

import type { TotalListTabProps } from '@/app/(routers)/(todo)/goals/types';

import { TodoSection } from '@/app/(routers)/(todo)/goals/[goalId]/_components/TodoSection';

export default function TotalListTab({ goalId, todoLists, todoListsDone }: TotalListTabProps) {
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
