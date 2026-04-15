import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { PerfRecorder } from '@/utils/perfRecorder';

import { prefetchFavorites } from './_api/favoritesApis';
import FavoritesTab from './_components/FavoritesTab';

export default async function FavoritesPage() {
  const perf = new PerfRecorder({ route: '/favorites', warnThreshold: 300 });

  const queryClient = new QueryClient();
  await prefetchFavorites(queryClient);
  await perf.flush();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FavoritesTab />
    </HydrationBoundary>
  );
}
