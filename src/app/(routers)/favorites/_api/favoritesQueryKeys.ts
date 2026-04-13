export const favoritesQueryKeys = {
  all: ['favorites'] as const,
  list: () => [...favoritesQueryKeys.all, 'list'] as const,
};
