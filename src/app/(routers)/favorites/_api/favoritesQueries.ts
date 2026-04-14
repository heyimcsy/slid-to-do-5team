import type { FavoritesResponse } from '../types';

import { apiClient } from '@/lib/apiClient.browser';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { FAVORITES_PAGE_LIMIT, favoritesQueryKeys } from './favoritesQueryKeys';

export const useGetFavorites = () => {
  return useInfiniteQuery<FavoritesResponse>({
    queryKey: favoritesQueryKeys.list(),
    queryFn: ({ pageParam }) =>
      apiClient<FavoritesResponse>(
        `/todos/favorites?limit=${FAVORITES_PAGE_LIMIT}${pageParam ? `&cursor=${pageParam}` : ''}`,
      ),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};
