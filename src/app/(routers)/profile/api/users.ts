import { PROFILE_TEXT } from '@/app/(routers)/profile/constants';
import { apiClient } from '@/lib/apiClient.browser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
      toast.success(PROFILE_TEXT.SUCCESS_PROFILE_MESSAGE);
    },
    onError: () => {
      toast.error(PROFILE_TEXT.ERROR_MESSAGE(PROFILE_TEXT.IMAGE_NAME));
    },
  });
};

// 비밀번호 변경
export const usePatchPassword = (options: { onError?: (error: Response) => void }) => {
  return useMutation({
    mutationFn: async (payload: PatchPasswordPayload) => {
      return await apiClient<{ message: string }>(`${USERS_URL}/me/password`, {
        method: 'PATCH',
        body: payload,
      });
    },
    ...options,
    onSuccess: () => {
      toast.success(PROFILE_TEXT.SUCCESS_PASSWORD_MESSAGE);
    },
    onError: (error: Response) => {
      options?.onError?.(error);
      toast.error(PROFILE_TEXT.ERROR_MESSAGE(PROFILE_TEXT.PASSWORD));
    },
  });
};
