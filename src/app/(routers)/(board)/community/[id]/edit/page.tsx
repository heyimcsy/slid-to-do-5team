import { PostSubmitClient } from '../../_components/PostSubmitClient';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);

  return <PostSubmitClient mode="edit" postId={postId} />;
}
