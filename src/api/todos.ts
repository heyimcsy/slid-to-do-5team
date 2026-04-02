import type { Goal } from '@/api/goals';
import type { PaginatedResponse } from '@/api/response';
import type { TagColor } from '@/utils/tag';

import { apiClient } from '@/lib/apiClient.browser';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { mapTagsWithColor } from '@/utils/tag';

export interface Tag {
  id: number;
  name: string;
}

export interface Tags {
  id: number;
  name: string;
  color: TagColor;
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

export interface TodoResponse {
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
  tags: Tags[];
}

export const TODOS = 'todos';
export const TODO = 'todo';
export const TODOS_URL = '/todos';

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

// usePostTodo 타입
type CreateTodoPayload = Pick<Todo, 'title' | 'goalId' | 'dueDate'> &
  Partial<Pick<Todo, 'linkUrl' | 'fileUrl'>> & {
    tags?: string[];
  };

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

export const useInfiniteTodos = ({ goalId, done, limit }: GetTodosParams) => {
  return useInfiniteQuery<PaginatedResponse<TodoWithFavorites, 'todos'>>({
    queryKey: [TODOS, 'infinite', { goalId, done, limit }],

    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();

      if (goalId !== undefined) params.append('goalId', String(goalId));
      if (done !== undefined) params.append('done', String(done));
      if (limit !== undefined) params.append('limit', String(limit));
      if (pageParam !== undefined) params.append('cursor', String(pageParam));

      const queryString = params.toString();
      const url = queryString ? `${TODOS_URL}?${queryString}` : TODOS_URL;

      // 기존 로직 그대로 유지 👍
      const [todosData, favoritesData] = await Promise.all([
        apiClient<PaginatedResponse<Todo, 'todos'>>(url),
        apiClient<PaginatedResponse<Favorite, 'favorites'>>(`${TODOS_URL}/favorites`),
      ]);

      const favoriteTodoIds = new Set(favoritesData.favorites.map((f) => f.todoId));

      const todosWithFavorite: TodoWithFavorites[] = todosData.todos.map((todo) => ({
        ...todo,
        favorites: favoriteTodoIds.has(todo.id),
      }));

      return {
        ...todosData,
        todos: todosWithFavorite,
      };
    },

    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },

    initialPageParam: 0,
  });
};

export const useGetTodo = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [TODO, id],
    queryFn: async () => {
      const data = await apiClient<Todo>(`${TODOS_URL}/${id}`);
      return {
        ...data,
        tags: mapTagsWithColor(data.tags),
      };
    },
    enabled: !!id,
  });
};

type PatchTodoPayload = Pick<Todo, 'id'> &
  Partial<Pick<Todo, 'title' | 'done' | 'linkUrl' | 'dueDate' | 'fileUrl'>> & {
    tags?: string[];
  };

export const usePatchTodos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PatchTodoPayload) => {
      const { id, ...rest } = payload;
      const body = Object.fromEntries(Object.entries(rest).filter(([_, v]) => v !== undefined));
      return await apiClient(`${TODOS_URL}/${id}`, { method: 'PATCH', body });
    },
    onMutate: async (payload: PatchTodoPayload) => {
      // 진행 중인 refetch 취소 (덮어쓰기 방지)
      await queryClient.cancelQueries({ queryKey: [TODOS] });
      // 현재 캐시 스냅샷 저장 (롤백용)
      const previousTodos = queryClient.getQueriesData({ queryKey: [TODOS] });
      // 캐시 즉시 업데이트
      queryClient.setQueriesData({ queryKey: [TODOS] }, (old: PaginatedResponse<Todo, 'todos'>) => {
        if (!old) return old;
        return {
          ...old,
          todos: old.todos.map((todo: Todo) =>
            todo.id === payload.id ? { ...todo, ...payload } : todo,
          ),
        };
      });

      return { previousTodos }; // context로 전달
    },

    onError: (_: Error, __: PatchTodoPayload, context) => {
      // 실패 시 스냅샷으로 롤백
      context?.previousTodos.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: (_, __, payload) => {
      // 성공/실패 상관없이 최종적으로 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: [TODOS] });
      queryClient.invalidateQueries({ queryKey: [TODO, payload.id] });
    },
  });
};

export const useDeleteTodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return await apiClient(`${TODOS_URL}/${id}`, { method: 'DELETE' });
    },
    onMutate: async ({ id }: { id: number }) => {
      await queryClient.cancelQueries({ queryKey: [TODOS] });
      const previousTodos = queryClient.getQueriesData({ queryKey: [TODOS] });
      queryClient.setQueriesData({ queryKey: [TODOS] }, (old: PaginatedResponse<Todo, 'todos'>) => {
        if (!old) return old;
        return {
          ...old,
          todos: old.todos.filter((todo: Todo) => todo.id !== id),
          totalCount: old.totalCount - 1,
        };
      });
      return { previousTodos };
    },
    onError: (_: Error, __, context) => {
      context?.previousTodos.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: (_, __, payload) => {
      queryClient.invalidateQueries({ queryKey: [TODOS] });
      queryClient.invalidateQueries({ queryKey: [TODO, payload.id] });
    },
  });
};

export const usePostTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTodoPayload) => {
      return await apiClient<Todo>(TODOS_URL, { method: 'POST', body: payload });
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: [TODOS] });
      const previousTodos = queryClient.getQueriesData({ queryKey: [TODOS] });

      // API 응답 전에 캐시에 즉시 추가
      queryClient.setQueriesData(
        { queryKey: [TODOS] },
        (old: PaginatedResponse<TodoWithFavorites, 'todos'>) => {
          if (!old) return old;
          const optimisticTodo: TodoWithFavorites = {
            id: Date.now(), // 임시 id
            teamId: '',
            userId: 0,
            goalId: payload.goalId,
            title: payload.title,
            done: false,
            fileUrl: null,
            linkUrl: payload.linkUrl ?? null,
            dueDate: payload.dueDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            goal: { id: payload.goalId, title: '' },
            noteIds: [],
            tags: [],
            favorites: false,
          };
          return {
            ...old,
            todos: [optimisticTodo, ...old.todos],
            totalCount: old.totalCount + 1,
          };
        },
      );

      return { previousTodos };
    },
    onError: (_, __, context) => {
      context?.previousTodos.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS] });
    },
  });
};
