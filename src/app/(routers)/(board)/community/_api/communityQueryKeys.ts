export const communityQueryKeys = {
  all: ['community'] as const,
  posts: () => [...communityQueryKeys.all, 'posts'] as const,
} as const;
