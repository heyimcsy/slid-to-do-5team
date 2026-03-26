export const communityQueryKeys = {
  all: ['community'] as const,
  posts: (type: 'all' | 'best' = 'all') => [...communityQueryKeys.all, 'posts', type] as const,
  post: (id: number) => [...communityQueryKeys.all, 'post', id] as const,
} as const;
