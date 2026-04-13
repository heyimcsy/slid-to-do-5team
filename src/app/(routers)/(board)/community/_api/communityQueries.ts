import type {
  Comment,
  CommentLikeResponse,
  CommentsResponse,
  Post,
  PostInput,
  PostsResponse,
  SortOption,
} from '../types';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { BEST_POSTS_LIMIT, communityQueryKeys, POSTS_PAGE_LIMIT } from './communityQueryKeys';

const toApiType = (sort: SortOption): 'all' | 'best' => (sort === '인기순' ? 'best' : 'all');

// 게시물 목록 조회
export const useGetPosts = (sort: SortOption = '최신순', search?: string) => {
  const type = toApiType(sort);
  const normalizedSearch = search?.trim() || undefined;

  return useInfiniteQuery<PostsResponse>({
    queryKey: communityQueryKeys.postsList(type, normalizedSearch),
    queryFn: ({ pageParam }) =>
      apiClient<PostsResponse>(
        `/posts?type=${type}&limit=${POSTS_PAGE_LIMIT}${normalizedSearch ? `&search=${encodeURIComponent(normalizedSearch)}` : ''}${pageParam ? `&cursor=${pageParam}` : ''}`,
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
    queryKey: [...communityQueryKeys.postsList('best'), { limit: BEST_POSTS_LIMIT }],
    queryFn: () => apiClient<PostsResponse>(`/posts?type=best&limit=${BEST_POSTS_LIMIT}`),
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
        comments: [],
        totalCount: 0,
        nextCursor: null,
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
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
    },
  });
};

// 댓글 등록
export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: number }) =>
      apiClient<Comment>(`/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          ...(parentId !== undefined && { parentId }),
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.all });
    },
  });
};

// 댓글 목록 조회
export const useGetComments = (postId: number) => {
  return useQuery({
    queryKey: communityQueryKeys.comments(postId),
    queryFn: () => apiClient<CommentsResponse>(`/posts/${postId}/comments`),
    staleTime: 1000 * 60 * 5,
    enabled: Number.isInteger(postId) && postId > 0,
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

// 댓글 좋아요 토글
export const useToggleCommentLike = (postId: number, commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isLiked: boolean) =>
      apiClient<CommentLikeResponse>(`/posts/${postId}/comments/${commentId}/likes`, {
        method: isLiked ? 'DELETE' : 'POST',
      }),
    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({ queryKey: communityQueryKeys.comments(postId) });
      const previous = queryClient.getQueryData(communityQueryKeys.comments(postId));
      queryClient.setQueryData(communityQueryKeys.comments(postId), (old: CommentsResponse) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  isLiked: !isLiked,
                  likeCount: Math.max(0, c.likeCount + (isLiked ? -1 : 1)),
                }
              : c,
          ),
        };
      });
      return { previous };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(communityQueryKeys.comments(postId), (old: CommentsResponse) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments.map((c) =>
            c.id === commentId ? { ...c, isLiked: data.isLiked, likeCount: data.likeCount } : c,
          ),
        };
      });
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(communityQueryKeys.comments(postId), context?.previous);
    },
  });
};
