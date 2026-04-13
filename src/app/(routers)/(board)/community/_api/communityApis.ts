import 'server-only';

import type { CommentsResponse, Post, PostsResponse } from '../types';

import { apiClientServer } from '@/lib/apiClient.server';
import { QueryClient } from '@tanstack/react-query';

import { communityQueryKeys } from './communityQueryKeys';

const getPostsServer = (type: 'all' | 'best' = 'all', search?: string) =>
  apiClientServer<PostsResponse>(
    `/posts?type=${type}&limit=5${search ? `&search=${encodeURIComponent(search)}` : ''}`,
    { retry: false },
  );

const getPostByIdServer = (postId: number) =>
  apiClientServer<Post>(`/posts/${postId}`, { retry: false });

const getCommentsServer = (postId: number) =>
  apiClientServer<CommentsResponse>(`/posts/${postId}/comments`, { retry: false });

export const prefetchPostsList = (queryClient: QueryClient) =>
  queryClient.prefetchInfiniteQuery({
    queryKey: communityQueryKeys.postsList('all'),
    queryFn: () => getPostsServer('all'),
    initialPageParam: undefined as string | undefined,
  });

export const prefetchPostDetail = (queryClient: QueryClient, postId: number) =>
  Promise.all([
    queryClient.prefetchQuery({
      queryKey: communityQueryKeys.post(postId),
      queryFn: () => getPostByIdServer(postId),
    }),
    queryClient.prefetchQuery({
      queryKey: communityQueryKeys.comments(postId),
      queryFn: () => getCommentsServer(postId),
    }),
  ]);
