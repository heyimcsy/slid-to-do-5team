import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { PerfRecorder } from '@/utils/perfRecorder';

import { prefetchPostsList } from './_api/communityApis';
import CommunityClient from './CommunityClient';

export default async function CommunityPage() {
  const perf = new PerfRecorder({ route: '/community', warnThreshold: 300 });

  const queryClient = new QueryClient();
  await prefetchPostsList(queryClient);
  await perf.flush();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommunityClient />
    </HydrationBoundary>
  );
}
