import type { TodoWithFavorites } from '@/api/todos';

import { useGetGoal } from '@/api/goals';
import { useGetTodos } from '@/api/todos';

export function useGoalWithTodos(goalId: number) {
  const goalResult = useGetGoal({ id: goalId });
  const todosResult = useGetTodos({ goalId, limit: 20 });

  const todoLists = todosResult.data?.todos.filter((todo: TodoWithFavorites) => !todo.done) ?? [];
  const todoListsDone =
    todosResult.data?.todos.filter((todo: TodoWithFavorites) => todo.done) ?? [];
  const todoDoneCount = todoListsDone.length;
  const totalCount = todoListsDone.length + todoLists.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((todoDoneCount / totalCount) * 100);

  const refetch = () => {
    if (goalResult.isError) goalResult.refetch();
    if (todosResult.isError) todosResult.refetch();
  };

  return {
    goalData: goalResult.data,
    todoLists,
    todoListsDone,
    progressPercent,
    isLoading: goalResult.isLoading || todosResult.isLoading,
    isError: goalResult.isError || todosResult.isError,
    isSuccess: goalResult.isSuccess && todosResult.isSuccess,
    refetch,
  };
}
