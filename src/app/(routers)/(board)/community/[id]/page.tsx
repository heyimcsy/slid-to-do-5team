import { notFound } from 'next/navigation';

import { PostDetailClient } from './PostDetailClient';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const numId = Number(id);

  if (!Number.isInteger(numId) || numId <= 0) notFound();

  return <PostDetailClient postId={numId} />;
}
