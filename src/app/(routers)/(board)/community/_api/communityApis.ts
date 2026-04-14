import 'server-only';

import type { CommentsResponse, Post, PostsResponse } from '../types';

import { notFound } from 'next/navigation';
import { apiClientServer } from '@/lib/apiClient.server';
import { QueryClient } from '@tanstack/react-query';

import {
  BEST_POSTS_LIMIT,
  COMMENTS_PAGE_LIMIT,
  communityQueryKeys,
  POSTS_PAGE_LIMIT,
} from './communityQueryKeys';

const getPostsServer = (type: 'all' | 'best' = 'all') =>
  apiClientServer<PostsResponse>(`/posts?type=${type}&limit=${POSTS_PAGE_LIMIT}`, { retry: false });

const getBestPostsServer = () =>
  apiClientServer<PostsResponse>(`/posts?type=best&limit=${BEST_POSTS_LIMIT}`, { retry: false });

const getPostByIdServer = (postId: number) =>
  apiClientServer<Post>(`/posts/${postId}`, { retry: false });

const getCommentsServer = (postId: number) =>
  apiClientServer<CommentsResponse>(
    `/posts/${postId}/comments?limit=${COMMENTS_PAGE_LIMIT}&parentId=null`,
    { retry: false },
  );

export const prefetchPostsList = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: communityQueryKeys.postsList('all'),
      queryFn: () => getPostsServer('all'),
      initialPageParam: undefined as string | undefined,
    }),
    queryClient.prefetchQuery({
      queryKey: [...communityQueryKeys.postsList('best'), { limit: 3 }],
      queryFn: () => getBestPostsServer(),
    }),
  ]);

export const prefetchPostDetail = async (queryClient: QueryClient, postId: number) => {
  await Promise.all([
    queryClient
      .fetchQuery({
        queryKey: communityQueryKeys.post(postId),
        queryFn: () => getPostByIdServer(postId),
      })
      .catch(() => {
        notFound();
      }),
    queryClient.prefetchInfiniteQuery({
      queryKey: communityQueryKeys.comments(postId),
      queryFn: () => getCommentsServer(postId),
      initialPageParam: undefined as string | undefined,
    }),
  ]);
};
