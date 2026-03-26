export const communityQueryKeys = {
  all: ['community'] as const,
  posts: (type: 'all' | 'best' = 'all') => [...communityQueryKeys.all, 'posts', type] as const,
} as const;
