import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { PerfRecorder } from '@/utils/perfRecorder';

import { prefetchPostDetail } from '../_api/communityApis';
import { PostDetailClient } from './PostDetailClient';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) notFound();

  const perf = new PerfRecorder({ route: `/community/${postId}`, warnThreshold: 300 });

  const queryClient = new QueryClient();
  await prefetchPostDetail(queryClient, postId);
  await perf.flush();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailClient postId={postId} />
    </HydrationBoundary>
  );
}
