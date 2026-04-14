import { favoritesQueryKeys } from '@/app/(routers)/favorites/_api/favoritesQueryKeys';
import { apiClient } from '@/lib/apiClient.browser';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type PaginatedResponse } from './response';
import { type Todo } from './todos';

const TODOS = 'todos';
const FAVORITES_URL = (todoId: number) => `/todos/${todoId}/favorites`;

export const usePostFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (todoId: number) => apiClient(FAVORITES_URL(todoId), { method: 'POST' }),

    onMutate: async (todoId: number) => {
      await queryClient.cancelQueries({ queryKey: [TODOS] });
      const previousTodos = queryClient.getQueriesData({ queryKey: [TODOS] });

      queryClient.setQueriesData({ queryKey: [TODOS] }, (old: PaginatedResponse<Todo, 'todos'>) => {
        if (!old || !old.todos) return old;
        return {
          ...old,
          todos: old.todos.map((todo) =>
            todo.id === todoId ? { ...todo, isFavorite: true } : todo,
          ),
        };
      });

      return { previousTodos };
    },

    onError: (_, __, context) => {
      context?.previousTodos.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS] });
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
    },
  });
};

export const useDeleteFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (todoId: number) => apiClient(FAVORITES_URL(todoId), { method: 'DELETE' }),

    onMutate: async (todoId: number) => {
      await queryClient.cancelQueries({ queryKey: [TODOS] });
      const previousTodos = queryClient.getQueriesData({ queryKey: [TODOS] });

      queryClient.setQueriesData({ queryKey: [TODOS] }, (old: PaginatedResponse<Todo, 'todos'>) => {
        if (!old || !old.todos) return old;
        return {
          ...old,
          todos: old.todos.map((todo) =>
            todo.id === todoId ? { ...todo, isFavorite: false } : todo,
          ),
        };
      });

      return { previousTodos };
    },

    onError: (_, __, context) => {
      context?.previousTodos.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS] });
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
    },
  });
};
