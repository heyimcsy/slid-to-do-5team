import { useMemo } from 'react';
import { useGetGoal } from '@/api/goals';
import { useGetTodos } from '@/api/todos';

export function useGoalWithTodos(goalId: number) {
  const goalResult = useGetGoal({ id: goalId });

  const todoResult = useGetTodos({ goalId, done: false, limit: 1 });
  const doneResult = useGetTodos({ goalId, done: true, limit: 1 });

  const progressPercent: number = useMemo(() => {
    const todoCount: number = todoResult.data?.totalCount ?? 0;
    const doneCount: number = doneResult.data?.totalCount ?? 0;
    const total: number = todoCount + doneCount;
    return total === 0 ? 0 : Math.round((doneCount / total) * 100);
  }, [todoResult.data?.totalCount, doneResult.data?.totalCount]);

  const refetch = () => {
    if (goalResult.isError) goalResult.refetch();
    if (todoResult.isError) todoResult.refetch();
    if (doneResult.isError) doneResult.refetch();
  };

  return {
    goalData: goalResult.data,
    progressPercent,
    isLoading: goalResult.isLoading || todoResult.isLoading || doneResult.isLoading,
    isError: goalResult.isError || todoResult.isError || doneResult.isError,
    isSuccess: goalResult.isSuccess && todoResult.isSuccess && doneResult.isSuccess,
    refetch,
  };
}
