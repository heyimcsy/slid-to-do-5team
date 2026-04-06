import type { PaginatedResponse } from '@/api/response';
import type { QueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/apiClient.browser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// comment 타입
export interface NotificationCommentData {
  commentAuthor: string;
  commentContent: string;
  postTitle: string;
  userImage: string;
}

// todo 타입
export interface NotificationTodoData {
  goalTitle: string;
  todoTitle: string;
  userImage: string;
}

export interface NotificationGoalData {
  goalTitle: string;
  totalTodos: number;
  userImage: string;
}
interface NotificationBase {
  id: number;
  teamId: string;
  userId: number;
  message: string;
  isRead: boolean;
  resourceId: number;
  createdAt: string;
}

export type Notification = NotificationBase &
  (
    | { type: 'comment'; data: NotificationCommentData }
    | { type: 'todo'; data: NotificationTodoData }
    | { type: 'goal'; data: NotificationGoalData }
    | { type: string; data: null }
  );

export type NotificationResponse = PaginatedResponse<Notification, 'notifications'>;

export const NOTIFICATIONS = 'notifications';
export const NOTIFICATION = 'notification';
export const NOTIFICATIONS_URL = '/notifications';

interface GetNotesParams {
  cursor?: number;
  limit?: number;
}
export const useGetNotifications = ({ cursor, limit }: GetNotesParams) => {
  return useQuery({
    queryKey: [NOTIFICATIONS, { cursor, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (cursor !== undefined) params.append('cursor', String(cursor));
      if (limit !== undefined) params.append('limit', String(limit));

      const queryString = params.toString();
      const url = queryString ? `${NOTIFICATIONS_URL}?${queryString}` : NOTIFICATIONS_URL;

      return await apiClient<NotificationResponse>(url);
    },
  });
};

export const usePatchNotification = () => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return await apiClient<Notification>(`${NOTIFICATIONS_URL}/${id}`, {
        method: 'PATCH',
        body: {
          isRead: true,
        },
      });
    },

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: [NOTIFICATIONS] });

      const previousData = queryClient.getQueriesData<NotificationResponse>({
        queryKey: [NOTIFICATIONS],
      });

      queryClient.setQueriesData<NotificationResponse>({ queryKey: [NOTIFICATIONS] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        };
      });

      return { previousData };
    },

    onError: (_error, _payload, context) => {
      context?.previousData.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: (_, __, payload) => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS] });
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION, payload.id] });
    },
  });
};

export const usePatchNotifications = () => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await apiClient<Notification>(`${NOTIFICATIONS_URL}`, {
        method: 'PATCH',
      });
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [NOTIFICATIONS] });

      const previousData = queryClient.getQueriesData<NotificationResponse>({
        queryKey: [NOTIFICATIONS],
      });

      // 전체 알림 isRead → true
      queryClient.setQueriesData<NotificationResponse>({ queryKey: [NOTIFICATIONS] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map((n) => ({ ...n, isRead: true })),
        };
      });

      return { previousData };
    },

    onError: (_error, _payload, context) => {
      context?.previousData.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS] });
    },
  });
};

// Delete 훅은 패턴만 잡아둔 상태 (API 스펙 확정 후 onMutate 채우면 됩니다)
export const useDeleteNotification = () => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return await apiClient<Notification>(`${NOTIFICATIONS_URL}/${id}`, {
        method: 'DELETE',
      });
    },

    onMutate: async ({ id }: { id: number }) => {
      await queryClient.cancelQueries({ queryKey: [NOTIFICATIONS] });
      console.log(id);
      const previousData = queryClient.getQueriesData<NotificationResponse>({
        queryKey: [NOTIFICATIONS],
      });

      // TODO: 단건 삭제 낙관적 업데이트 (API 스펙 확정 후 작성)
      // queryClient.setQueriesData(...)

      return { previousData };
    },

    onError: (_error, _payload, context) => {
      context?.previousData.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS] });
    },
  });
};

export const useDeleteNotifications = () => {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await apiClient<Notification>(`${NOTIFICATIONS_URL}`, {
        method: 'DELETE',
      });
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [NOTIFICATIONS] });

      const previousData = queryClient.getQueriesData<NotificationResponse>({
        queryKey: [NOTIFICATIONS],
      });

      // TODO: 전체 삭제 낙관적 업데이트 (API 스펙 확정 후 작성)
      // queryClient.setQueriesData(...)

      return { previousData };
    },

    onError: (_error, _payload, context) => {
      context?.previousData.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS] });
    },
  });
};
