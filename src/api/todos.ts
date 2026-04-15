import type { Goal } from '@/api/goals';
import type { PaginatedResponse } from '@/api/response';
import type { TagColor } from '@/utils/tag';
import type { InfiniteData } from '@tanstack/react-query';

import { NOTIFICATIONS } from '@/api/notifications';
import { favoritesQueryKeys } from '@/app/(routers)/favorites/_api/favoritesQueryKeys';
import { apiClient } from '@/lib/apiClient.browser';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

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
  isFavorite: boolean;
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

export type TodosGetResponse = PaginatedResponse<Todo, 'todos'>;
interface GetTodosParams {
  goalId?: number;
  done?: boolean;
  limit?: number;
  cursor?: number;
  enabled?: boolean;
}

// TODO: 낙관적 업데이트 inifiniteTodos 버전에도 추가하기

// usePostTodo 타입
type CreateTodoPayload = Pick<Todo, 'title' | 'goalId' | 'dueDate'> &
  Partial<Pick<Todo, 'linkUrl' | 'fileUrl'>> & {
    tags?: string[];
  };

export const useGetTodos = ({ goalId, done, limit, cursor, enabled }: GetTodosParams) => {
  return useQuery<TodosGetResponse>({
    queryKey: [TODOS, { goalId, done, limit, cursor }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (goalId !== undefined) params.append('goalId', String(goalId));
      if (done !== undefined) params.append('done', String(done));
      if (limit !== undefined) params.append('limit', String(limit));
      if (cursor !== undefined) params.append('cursor', String(cursor));

      const queryString = params.toString();
      const url = queryString ? `${TODOS_URL}?${queryString}` : TODOS_URL;

      return apiClient<TodosGetResponse>(url);
    },
    enabled,
  });
};

export const useInfiniteTodos = ({ goalId, done, limit }: GetTodosParams) => {
  return useInfiniteQuery<TodosGetResponse>({
    queryKey: [TODOS, 'infinite', { goalId, done, limit }],

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      if (goalId !== undefined) params.append('goalId', String(goalId));
      if (done !== undefined) params.append('done', String(done));
      if (limit !== undefined) params.append('limit', String(limit));
      if (pageParam !== null) params.append('cursor', String(pageParam));

      const queryString = params.toString();
      const url = queryString ? `${TODOS_URL}?${queryString}` : TODOS_URL;

      return apiClient<TodosGetResponse>(url);
    },

    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? null;
    },
    initialPageParam: null as number | null,
    placeholderData: keepPreviousData,
  });
};

export const fetchTodo = async (id: number) => {
  const data = await apiClient<Todo>(`${TODOS_URL}/${id}`);
  return {
    ...data,
    tags: mapTagsWithColor(data.tags),
  };
};

export const useGetTodo = ({ id }: { id: number | null }) => {
  return useQuery({
    queryKey: [TODO, id],
    queryFn: () => fetchTodo(id!),
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
      await queryClient.cancelQueries({ queryKey: [TODOS] });
      const previousTodos = queryClient.getQueriesData({ queryKey: [TODOS] });

      queryClient.setQueriesData(
        { queryKey: [TODOS] },
        (old: TodosGetResponse | InfiniteData<TodosGetResponse>) => {
          if (!old) return old;

          // 인피니트 쿼리
          if ('pages' in old) {
            return {
              ...old,
              pages: old.pages.map((page: TodosGetResponse) => ({
                ...page,
                todos: page.todos.map((todo: Todo) =>
                  todo.id === payload.id ? { ...todo, ...payload } : todo,
                ),
              })),
            };
          }

          // 일반 쿼리
          if (!('todos' in old) || !old.todos) return old;
          return {
            ...old,
            todos: old.todos.map((todo: Todo) =>
              todo.id === payload.id ? { ...todo, ...payload } : todo,
            ),
          };
        },
      );

      return { previousTodos };
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
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS] });
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

      queryClient.setQueriesData(
        { queryKey: [TODOS] },
        (old: TodosGetResponse | InfiniteData<TodosGetResponse> | undefined) => {
          if (!old) return old;

          if ('pages' in old) {
            return {
              ...old,
              pages: old.pages.map((page: TodosGetResponse) => ({
                ...page,
                todos: page.todos.filter((todo: Todo) => todo.id !== id),
                totalCount: page.totalCount - 1,
              })),
            };
          }

          if (!('todos' in old) || !old.todos) return old;
          return {
            ...old,
            todos: old.todos.filter((todo: Todo) => todo.id !== id),
            totalCount: old.totalCount - 1,
          };
        },
      );

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
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
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

      const optimisticTodo: Todo = {
        id: Date.now(),
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
        isFavorite: false,
      };

      queryClient.setQueriesData(
        { queryKey: [TODOS] },
        (old: TodosGetResponse | InfiniteData<TodosGetResponse> | undefined) => {
          if (!old) return old;

          if ('pages' in old) {
            return {
              ...old,
              pages: old.pages.map((page: TodosGetResponse, index: number) =>
                index === 0
                  ? {
                      ...page,
                      todos: [optimisticTodo, ...page.todos],
                      totalCount: page.totalCount + 1,
                    }
                  : page,
              ),
            };
          }

          if (!('todos' in old) || !old.todos) return old;
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
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
    },
  });
};
