import { apiClient } from '@/lib/apiClient.browser';
import { parseUserFromBackendUnknown } from '@/lib/auth/schemas/user';
import { authUserStore } from '@/stores/authUserStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';



import { communityQueryKeys } from '../../(board)/community/_api/communityQueryKeys';





const USER_ME = 'user-me';
const USERS_URL = '/users';

export interface UserProfile {
  id: number;
  teamId: string;
  email: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NickNameCheckResponse {
  available: boolean;
}

interface PatchProfilePayload {
  name?: string;
  image?: string | null;
}

interface PatchPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface Response {
  code: string;
  message: string;
}

// 내 프로필 조회
export const useGetMe = () => {
  return useQuery({
    queryKey: [USER_ME],
    queryFn: async () => {
      return await apiClient<UserProfile>(`${USERS_URL}/me`);
    },
  });
};

// 닉네임 중복 확인
export const useGetCheckNickname = ({ name, enabled }: { name: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['check-nickname', name],
    queryFn: async () => {
      return await apiClient<NickNameCheckResponse>(`${USERS_URL}/check-nickname?name=${name}`);
    },
    enabled,
  });
};

// 프로필 수정 (이름, 이미지)
export const usePatchProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PatchProfilePayload) => {
      return await apiClient<UserProfile>(`${USERS_URL}/me`, {
        method: 'PATCH',
        body: payload,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData([USER_ME], data); // 캐시 즉시 업데이트
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all });

      const prev = authUserStore.getState().user;
      if (prev) {
        authUserStore.getState().setUser({
          ...prev,
          id: String(data.id),
          email: data.email,
          name: data.name,
          image: data.image,
          teamId: data.teamId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } else {
        // 만약 이전 사용자 정보가 없다면 백엔드 응답 데이터를 사용하여 사용자 정보 설정
        const parsed = parseUserFromBackendUnknown(data);
        if (parsed) authUserStore.getState().setUser(parsed);
      }
    },
    onError: (error: Response) => {
      console.error(error);
    },
  });
};

// 비밀번호 변경
export const usePatchPassword = (options: {
  onSuccess?: (data: Pick<Response, 'message'>) => void;
  onError?: (error: Response) => void;
}) => {
  return useMutation({
    mutationFn: async (payload: PatchPasswordPayload) => {
      return await apiClient<{ message: string }>(`${USERS_URL}/me/password`, {
        method: 'PATCH',
        body: payload,
      });
    },
    ...options,
    onSuccess: (data: Pick<Response, 'message'>) => {
      options?.onSuccess?.(data);
    },
    onError: (error: Response) => {
      options?.onError?.(error);
      console.error(error);
    },
  });
};
