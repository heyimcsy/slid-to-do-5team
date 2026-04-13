import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { prefetchPostsList } from './_api/communityApis';
import CommunityClient from './CommunityClient';

export default async function CommunityPage() {
  const queryClient = new QueryClient();
  await prefetchPostsList(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommunityClient />
    </HydrationBoundary>
  );
}
