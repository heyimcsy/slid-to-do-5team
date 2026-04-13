export const FAVORITES_PAGE_LIMIT = 20;

export const favoritesQueryKeys = {
  all: ['favorites'] as const,
  list: () => [...favoritesQueryKeys.all, 'list'] as const,
};
