import type { Post, SortOption } from '../types';

import { apiClient } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

import { communityQueryKeys } from './communityQueryKeys';

export interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
  totalCount: number;
}

const toApiType = (sort: SortOption): 'all' | 'best' => (sort === '인기순' ? 'best' : 'all');

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
export const useGetPostById = (id: number) => {
  return useQuery({
    queryKey: communityQueryKeys.post(id),
    queryFn: () => apiClient<Post>(`/posts/${id}`),
    staleTime: 1000 * 60 * 5,
  });
};
