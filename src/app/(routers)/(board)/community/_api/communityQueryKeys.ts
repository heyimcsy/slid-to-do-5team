export const POSTS_PAGE_LIMIT = 5;
export const BEST_POSTS_LIMIT = 3;
export const COMMENTS_PAGE_LIMIT = 5;

export const CACHE_TIMES = {
  posts: 180,
  bestPosts: 600,
  post: 300,
  comments: 180,
} as const;

export const communityQueryKeys = {
  all: ['community'] as const,
  posts: () => [...communityQueryKeys.all, 'posts'] as const,
  postsList: (type: 'all' | 'best' = 'all', search?: string) =>
    [...communityQueryKeys.posts(), type, { search }] as const,
  post: (id: number) => [...communityQueryKeys.all, 'post', id] as const,
  comments: (postId: number) =>
    [...communityQueryKeys.all, 'comments', 'infinite', postId] as const,
  replyComments: (postId: number, commentId: number) =>
    [...communityQueryKeys.all, 'comments', 'infinite', postId, commentId] as const,
} as const;

export const communityTags = {
  posts: 'community-posts',
  bestPosts: 'community-best-posts',
  post: (id: number) => `community-post-${id}`,
  comments: (postId: number) => `community-comments-${postId}`,
} as const;
