import type { Post, PostsResponse, SortOption, UpdatePostInput, User } from '../types';

import { apiClient } from '@/lib/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { communityQueryKeys } from './communityQueryKeys';

const toApiType = (sort: SortOption): 'all' | 'best' => (sort === '인기순' ? 'best' : 'all');

export const useGetUser = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => apiClient<User>('/users/me'),
    staleTime: 1000 * 60 * 10,
  });
};

// 게시물 전체 조회
export const useGetPosts = (sort: SortOption = '최신순') => {
  const type = toApiType(sort);
  return useQuery({
    queryKey: communityQueryKeys.posts(type),
    queryFn: () => apiClient<PostsResponse>(`/posts?type=${type}`),
    staleTime: 1000 * 60 * 5,
  });
};

// 게시물 상세 조회
export const useGetPostById = (postId: number) => {
  return useQuery({
    queryKey: communityQueryKeys.post(postId),
    queryFn: () => apiClient<Post>(`/posts/${postId}`),
    staleTime: 1000 * 60 * 5,
    enabled: Number.isInteger(postId) && postId > 0,
  });
};

// 게시물 수정
export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatePost: UpdatePostInput) =>
      apiClient<Post>(`/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(updatePost),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.post(postId) });
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
    },
  });

  return { ...mutation, postId };
};

// 게시물 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) =>
      apiClient<void>(`/posts/${postId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
    },
  });
};
