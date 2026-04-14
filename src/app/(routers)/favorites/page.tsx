import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { prefetchFavorites } from './_api/favoritesApis';
import FavoritesTab from './_components/FavoritesTab';

export default async function FavoritesPage() {
  const queryClient = new QueryClient();
  await prefetchFavorites(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FavoritesTab />
    </HydrationBoundary>
  );
}
