import { PostDetailClient } from './PostDetailClient';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  return <PostDetailClient id={Number(id)} />;
}
