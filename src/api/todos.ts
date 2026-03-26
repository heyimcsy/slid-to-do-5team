import type { Goal } from '@/api/goals';
import type { PaginatedResponse } from '@/api/response';

import { apiClient } from '@/lib/apiClient.browser';
import { useQuery } from '@tanstack/react-query';

export interface Tag {
  id: number;
  title: string;
}

export interface Todo {
  id: number;
  teamId: string;
  userId: number;
  goalId: number;
  title: string;
  done: boolean;
  fileUrl: string | null;
  linkUrl: string | null;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  goal: Pick<Goal, 'id' | 'title'>;
  noteIds: number[];
  tags: Tag[];
}

const TODOS = 'todos';
// const TODO = 'todo';
const TODOS_URL = '/todos';

interface GetTodosParams {
  goalId?: number;
  done?: boolean;
  limit?: number;
  cursor?: number;
}

export interface Favorite {
  id: number;
  teamId: string;
  userId: number;
  todoId: number;
  createdAt: string;
  todo: Pick<Todo, 'id' | 'title' | 'done' | 'goal'>;
}

// 기존 Todo 타입에 isFavorite 추가된 버전
export type TodoWithFavorites = Todo & { favorites: boolean };

// useGetTodos 반환 response 타입
export type TodosWithFavoriteResponse = PaginatedResponse<TodoWithFavorites, 'todos'>;

export const useGetTodos = ({ goalId, done, limit, cursor }: GetTodosParams) => {
  return useQuery({
    queryKey: [TODOS, { goalId, done, limit, cursor }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (goalId !== undefined) params.append('goalId', String(goalId));
      if (done !== undefined) params.append('done', String(done));
      if (limit !== undefined) params.append('limit', String(limit));
      if (cursor !== undefined) params.append('cursor', String(cursor));

      const queryString = params.toString();
      const url = queryString ? `${TODOS_URL}?${queryString}` : TODOS_URL;

      // 두 개 병렬 요청
      const [todosData, favoritesData] = await Promise.all([
        apiClient<PaginatedResponse<Todo, 'todos'>>(url),
        apiClient<PaginatedResponse<Favorite, 'favorites'>>(`${TODOS_URL}/favorites`),
      ]);

      // favorites의 todoId만 Set으로 추출 (O(1) 조회)
      const favoriteTodoIds = new Set(favoritesData.favorites.map((f) => f.todoId));
      const todosWithFavorite = todosData.todos.map((todo) => ({
        ...todo,
        favorites: favoriteTodoIds.has(todo.id),
      }));

      return {
        ...todosData,
        todos: todosWithFavorite,
      };
    },
  });
};
