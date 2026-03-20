import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getPosts } from './_api/communityApi';
import { communityQueryKeys } from './_api/communityQueryKeys';
import CommunityClient from './CommunityClient';

export default async function CommunityPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: communityQueryKeys.posts(),
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommunityClient />
    </HydrationBoundary>
  );
}
