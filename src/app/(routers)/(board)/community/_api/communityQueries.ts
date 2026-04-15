import type {
  Comment,
  CommentLikeResponse,
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

import { updateComments, updatePost, updatePosts } from './communityActions';
import {
  BEST_POSTS_LIMIT,
  CACHE_TIMES,
  COMMENTS_PAGE_LIMIT,
  communityQueryKeys,
  POSTS_PAGE_LIMIT,
} from './communityQueryKeys';

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
    staleTime: CACHE_TIMES.posts * 1000,
    placeholderData: keepPreviousData,
  });
};

// 게시물 인기순 3개 조회
export const useGetBestPosts = () => {
  return useQuery({
    queryKey: [...communityQueryKeys.postsList('best'), { limit: BEST_POSTS_LIMIT }],
    queryFn: () => apiClient<PostsResponse>(`/posts?type=best&limit=${BEST_POSTS_LIMIT}`),
    staleTime: CACHE_TIMES.bestPosts * 1000,
  });
};

// 게시물 상세 조회
export const useGetPostById = (postId: number) => {
  return useQuery({
    queryKey: communityQueryKeys.post(postId),
    queryFn: () => apiClient<Post>(`/posts/${postId}`),
    staleTime: CACHE_TIMES.post * 1000,
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
    onSuccess: async (data) => {
      queryClient.setQueryData(communityQueryKeys.post(data.id), data);
      queryClient.setQueryData(communityQueryKeys.comments(data.id), {
        pages: [{ comments: [], totalCount: 0, nextCursor: null }],
        pageParams: [undefined],
      });
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
      await updatePosts();
      router.replace(`/community/${data.id}`);
    },
  });
};

// 게시물 수정
export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (postInput: PostInput) =>
      apiClient<Post>(`/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postInput),
      }),
    onSuccess: async (data) => {
      queryClient.setQueryData(communityQueryKeys.post(data.id), data);
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
      await updatePost(data.id);
      await updatePosts();
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
      void updatePosts();
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
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.comments(postId) });
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
      void updateComments(postId);
      void updatePost(postId);
      void updatePosts();
    },
  });
};

// 댓글 목록 조회
export const useGetComments = (postId: number) => {
  return useInfiniteQuery<CommentsResponse>({
    queryKey: communityQueryKeys.comments(postId),
    queryFn: ({ pageParam }) =>
      apiClient<CommentsResponse>(
        `/posts/${postId}/comments?limit=${COMMENTS_PAGE_LIMIT}&parentId=null${pageParam ? `&cursor=${pageParam}` : ''}`,
      ),
    enabled: Number.isInteger(postId) && postId > 0,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: CACHE_TIMES.comments * 1000,
    placeholderData: keepPreviousData,
  });
};

// 대댓글 목록 조회
export const useGetCommentsByParentId = (postId: number, parentId: number, enabled: boolean) => {
  return useInfiniteQuery<CommentsResponse>({
    queryKey: communityQueryKeys.replyComments(postId, parentId),
    queryFn: ({ pageParam }) =>
      apiClient<CommentsResponse>(
        `/posts/${postId}/comments?limit=${COMMENTS_PAGE_LIMIT}&parentId=${parentId}${pageParam ? `&cursor=${pageParam}` : ''}`,
      ),
    enabled,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: CACHE_TIMES.comments * 1000,
    placeholderData: keepPreviousData,
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
      void updateComments(postId);
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
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.comments(postId) });
      queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts() });
      void updateComments(postId);
      void updatePost(postId);
      void updatePosts();
    },
  });
};

// 댓글 좋아요 토글
export const useToggleCommentLike = (postId: number, commentId: number, parentId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isLiked: boolean) =>
      apiClient<CommentLikeResponse>(`/posts/${postId}/comments/${commentId}/likes`, {
        method: isLiked ? 'DELETE' : 'POST',
      }),
    onSuccess: (data) => {
      const queryKey =
        parentId !== undefined
          ? communityQueryKeys.replyComments(postId, parentId)
          : communityQueryKeys.comments(postId);

      queryClient.setQueryData<InfiniteData<CommentsResponse>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) =>
              c.id === commentId ? { ...c, isLiked: data.isLiked, likeCount: data.likeCount } : c,
            ),
          })),
        };
      });
    },
  });
};
