import type { QueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/apiClient.browser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface TODO {
  id: number;
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// base 타입 하나만 정의
export interface Goal {
  id: number;
  teamId: string;
  userId: number;
  title: string;
  completedCount: number;
  todoCount: number;
  createdAt: Date;
  updatedAt: Date;
  todos: TODO[];
}

// GET 목록 응답 - 제네릭 공통 래퍼로
export interface PaginatedResponse<T> {
  goals: T[];
  nextCursor: number | null;
  totalCount: number;
}

// POST 응답 - Goal에서 필요한 것만 Pick
export type GoalResponse = Pick<
  Goal,
  'id' | 'teamId' | 'userId' | 'title' | 'createdAt' | 'updatedAt'
>;

// POST 요청 body - Goal에서 필요한 것만 Pick
type CreateGoalPayload = Pick<Goal, 'title'>;
// DELETE 요청 body - Goal에서 필요한 것만 Pick
type DeleteGoalPayload = Pick<Goal, 'id'>;
// PATCH 요청 body - Goal에서 필요한 것만 Pick
type PatchGoalPayload = Pick<Goal, 'id' | 'title'>;

const GOAL = 'goal';
const GOALS = 'goals';
const GOALS_URL = '/goals';

// Pick 원하는 값만 꺼내서 사용
export const useGetGoals = () => {
  return useQuery({
    queryKey: [GOALS],
    queryFn: async () => {
      const data: PaginatedResponse<
        Pick<
          Goal,
          | 'id'
          | 'teamId'
          | 'userId'
          | 'title'
          | 'todoCount'
          | 'completedCount'
          | 'createdAt'
          | 'updatedAt'
        >
      > =
        await apiClient<
          PaginatedResponse<
            Pick<
              Goal,
              | 'id'
              | 'teamId'
              | 'userId'
              | 'title'
              | 'todoCount'
              | 'completedCount'
              | 'createdAt'
              | 'updatedAt'
            >
          >
        >(GOALS_URL);
      return data;
    },
  });
};

// 예시를 한 페이지에서 전부 보여주기 위해서 enable 옵션을 사용했는데 , 사용하지 않아도 됩니다.
// Omit 원하는 값만 제외해서 사용
export const useGetGoal = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [GOAL, id],
    queryFn: async () => {
      const data: Omit<Goal, 'completedCount' | 'todoCount'> = await apiClient<
        Omit<Goal, 'completedCount' | 'todoCount'>
      >(`${GOALS_URL}/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const usePostGoals = (options: { onSuccess?: (response: GoalResponse) => void }) => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateGoalPayload) => {
      const data: GoalResponse = await apiClient<GoalResponse>(GOALS_URL, {
        method: 'POST',
        body: payload,
      });
      return data;
    },
    ...options,
    onSuccess: (data: GoalResponse) => {
      queryClient.invalidateQueries({ queryKey: [GOALS] });
      options?.onSuccess?.(data);
    },
  });
};

export const useDeleteGoals = (options: { onSuccess?: () => void }) => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DeleteGoalPayload) => {
      const data: GoalResponse = await apiClient<GoalResponse>(`${GOALS_URL}/${payload.id}`, {
        method: 'DELETE',
      });
      return data;
    },
    ...options,
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [GOALS] });
      queryClient.invalidateQueries({ queryKey: [GOAL, payload.id] });
      options?.onSuccess?.();
    },
  });
};

export const usePatchGoals = () => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PatchGoalPayload) => {
      const data: GoalResponse = await apiClient<GoalResponse>(`${GOALS_URL}/${payload.id}`, {
        method: 'PATCH',
        body: { title: payload.title },
      });
      return data;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [GOALS] });
      queryClient.invalidateQueries({ queryKey: [GOAL, payload.id] });
    },
  });
};
