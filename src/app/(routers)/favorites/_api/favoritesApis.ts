import 'server-only';

import type { FavoritesResponse } from '../types';

import { apiClientServer } from '@/lib/apiClient.server';
import { QueryClient } from '@tanstack/react-query';

import { favoritesQueryKeys } from './favoritesQueryKeys';

export const prefetchFavorites = (queryClient: QueryClient) =>
  queryClient.prefetchInfiniteQuery({
    queryKey: favoritesQueryKeys.list(),
    queryFn: () =>
      apiClientServer<FavoritesResponse>(`/todos/favorites?limit=20`, { retry: false }),
    initialPageParam: undefined as number | undefined,
  });
