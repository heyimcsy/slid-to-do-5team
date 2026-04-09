import type {
  Comment,
  CommentsResponse,
  Post,
  PostInput,
  PostsResponse,
  SortOption,
} from '../types';
import type { InfiniteData } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { communityQueryKeys } from './communityQueryKeys';

const toApiType = (sort: SortOption): 'all' | 'best' => (sort === '인기순' ? 'best' : 'all');

// 게시물 목록 조회
export const useGetPosts = (sort: SortOption = '최신순', isSearchMode: boolean = false) => {
  const type = toApiType(sort);
  const limit = isSearchMode ? 100 : 5;

  return useInfiniteQuery({
    queryKey: [...communityQueryKeys.posts(type), { isSearchMode }],
    queryFn: ({ pageParam }) =>
      apiClient<PostsResponse>(
        `/posts?type=${type}&limit=${limit}${pageParam ? `&cursor=${pageParam}` : ''}`,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};

// 게시물 인기순 3개 조회
export const useGetBestPosts = () => {
  return useQuery({
    queryKey: [...communityQueryKeys.posts('best'), { limit: 3 }],
    queryFn: () => apiClient<PostsResponse>(`/posts?type=best&limit=3`),
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

// 게시물 작성
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (post: PostInput) =>
      apiClient<Post>('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(communityQueryKeys.post(data.id), data);
      queryClient.setQueryData(communityQueryKeys.comments(data.id), {
        pages: [{ comments: [], totalCount: 0, nextCursor: null }],
        pageParams: [undefined],
      });
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
      router.replace(`/community/${data.id}`);
    },
  });
};

// 게시물 수정
export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (updatePost: PostInput) =>
      apiClient<Post>(`/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePost),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(communityQueryKeys.post(data.id), data);
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
      router.replace(`/community/${data.id}`);
    },
  });
};

// 게시물 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) =>
      apiClient<void>(`/posts/${postId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_data, deletedPostId) => {
      queryClient.removeQueries({ queryKey: communityQueryKeys.post(deletedPostId) });
      queryClient.invalidateQueries({ queryKey: [...communityQueryKeys.all, 'posts'] });
    },
  });
};

// 댓글 등록
export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      apiClient<Comment>(`/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all });
    },
  });
};

// 댓글 목록 조회
export const useGetComments = (postId: number) => {
  return useInfiniteQuery({
    queryKey: communityQueryKeys.comments(postId),
    queryFn: ({ pageParam }) =>
      apiClient<CommentsResponse>(
        `/posts/${postId}/comments?limit=5${pageParam ? `&cursor=${pageParam}` : ''}`,
      ),
    staleTime: 1000 * 60 * 5,
    enabled: Number.isInteger(postId) && postId > 0,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });
};

// 댓글 수정
export const useUpdateComment = (postId: number, commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      apiClient<Comment>(`/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.comments(postId) });
    },
  });
};

// 댓글 삭제
export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      apiClient<void>(`/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all });
    },
  });
};

const updateCommentLikeCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  postId: number,
  commentId: number,
  liked: boolean,
) => {
  queryClient.setQueryData(
    communityQueryKeys.comments(postId),
    (old: InfiniteData<CommentsResponse>) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          comments: page.comments.map((c) =>
            c.id === commentId
              ? { ...c, isLiked: liked, likeCount: Math.max(0, c.likeCount + (liked ? 1 : -1)) }
              : c,
          ),
        })),
      };
    },
  );
};

// 댓글 좋아요
export const useCreateCommentLike = (postId: number, commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient<void>(`/posts/${postId}/comments/${commentId}/likes`, { method: 'POST' }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: communityQueryKeys.comments(postId) });
      const previous = queryClient.getQueryData(communityQueryKeys.comments(postId));
      updateCommentLikeCache(queryClient, postId, commentId, true);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(communityQueryKeys.comments(postId), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.comments(postId) });
    },
  });
};

// 댓글 좋아요 취소
export const useDeleteCommentLike = (postId: number, commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient<void>(`/posts/${postId}/comments/${commentId}/likes`, { method: 'DELETE' }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: communityQueryKeys.comments(postId) });
      const previous = queryClient.getQueryData(communityQueryKeys.comments(postId));
      updateCommentLikeCache(queryClient, postId, commentId, false);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(communityQueryKeys.comments(postId), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.comments(postId) });
    },
  });
};
