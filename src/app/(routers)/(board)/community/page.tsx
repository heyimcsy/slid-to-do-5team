import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import CommunityClient from './CommunityClient';
import { getPosts } from './_api/communityApi';

export default async function CommunityPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['community', 'posts'],
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommunityClient />
    </HydrationBoundary>
  );
}
