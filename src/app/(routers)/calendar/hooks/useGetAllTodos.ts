import type { CalendarTodo } from '@/app/(routers)/calendar/types';

import { useEffect, useMemo } from 'react';
import { useInfiniteTodos } from '@/api/todos';

export const useGetAllTodos = ({ goalId }: { goalId: number | undefined }) => {
  const { data, refetch, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteTodos({
      goalId: goalId === 0 ? undefined : goalId,
      limit: 100,
    });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allTodos = useMemo<CalendarTodo[]>(
    () =>
      data?.pages.flatMap((page) =>
        page.todos.map((todo) => ({
          id: todo.id,
          title: todo.title,
          done: todo.done,
          dueDate: todo.dueDate,
        })),
      ) ?? [],
    [data],
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const dueDates = allTodos
    .map((t) => t.dueDate)
    .filter(Boolean)
    .map((d) => new Date(d!).getTime())
    .sort((a, b) => a - b);

  const oldestDueDate = dueDates.length ? new Date(dueDates[0]).toString() : null;
  const newestDueDate = dueDates.length ? new Date(dueDates[dueDates.length - 1]).toString() : null;

  const isFetchDone = !hasNextPage && !isFetchingNextPage;

  return {
    todos: allTodos,
    totalCount,
    oldestDueDate,
    newestDueDate,
    isLoading: isLoading || !isFetchDone,
    isError,
    refetch,
  };
};
