export const communityQueryKeys = {
  all: ['community'] as const,
  posts: (type: 'all' | 'best' = 'all', search?: string) =>
    [...communityQueryKeys.all, 'posts', type, { search }] as const,
  post: (id: number) => [...communityQueryKeys.all, 'post', id] as const,
  comments: (postId: number) =>
    [...communityQueryKeys.all, 'comments', 'infinite', postId] as const,
} as const;
