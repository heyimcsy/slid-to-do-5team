import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { prefetchPostDetail } from '../_api/communityApis';
import { PostDetailClient } from './PostDetailClient';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const numId = Number(id);

  if (!Number.isInteger(numId) || numId <= 0) notFound();

  const queryClient = new QueryClient();
  await prefetchPostDetail(queryClient, numId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailClient postId={numId} />
    </HydrationBoundary>
  );
}
