import type { TotalListTabProps } from '@/app/(routers)/(todo)/goals/types';

import { GOALS_TEXT } from '@/app/(routers)/(todo)/constants';
import { TodoSection } from '@/app/(routers)/(todo)/goals/[goalId]/_components/TodoSection';

export default function TotalListTab({ goalId, todoLists, todoListsDone }: TotalListTabProps) {
  return (
    <div className="flex flex-col space-y-4 md:space-y-4 lg:flex-row lg:space-x-8">
      <TodoSection
        goalId={goalId}
        title={GOALS_TEXT.TODO}
        todos={todoLists}
        bgColor="bg-orange-100 dark:bg-orange-500"
        emptyImage="/images/big-zero-todo.svg"
        emptyText={GOALS_TEXT.EMPTY.TODO}
        showActions
      />
      <TodoSection
        goalId={goalId}
        title={GOALS_TEXT.DONE}
        todos={todoListsDone}
        bgColor="bg-white"
        emptyImage="/images/big-zero-done.svg"
        emptyText={GOALS_TEXT.EMPTY.DONE}
      />
    </div>
  );
}
