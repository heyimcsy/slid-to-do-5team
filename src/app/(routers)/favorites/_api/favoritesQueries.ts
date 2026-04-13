import type { FavoritesResponse } from '../types';

import { apiClient } from '@/lib/apiClient.browser';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { favoritesQueryKeys } from './favoritesQueryKeys';

export const useGetFavorites = () => {
  const limit = 20;

  return useInfiniteQuery({
    queryKey: favoritesQueryKeys.list(),
    queryFn: ({ pageParam }) =>
      apiClient<FavoritesResponse>(
        `/todos/favorites?limit=${limit}${pageParam ? `&cursor=${pageParam}` : ''}`,
      ),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};
