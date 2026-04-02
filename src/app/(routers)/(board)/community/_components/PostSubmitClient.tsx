'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/api/images';
import { useGetMe } from '@/app/(routers)/profile/api/users';
import { toast } from 'sonner';

import { useCreatePost, useGetPostById, useUpdatePost } from '../_api/communityQueries';
import { extractImagesFromContent } from '../_utils/extractImagesFromContent';
import { PostFormClient } from './PostFormClient';

interface Props {
  mode: 'create' | 'edit';
  postId?: number;
}

export function PostSubmitClient({ mode, postId }: Props) {
  const router = useRouter();

  const { data: post } = useGetPostById(postId ?? 0);
  const { data: user } = useGetMe();
  const userId = Number(user?.id);

  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: updatePost } = useUpdatePost(postId ?? 0);

  useEffect(() => {
    if (mode === 'edit' && post && user && post.userId !== userId) {
      toast.error('본인이 작성한 게시물만 수정할 수 있습니다.', { id: 'unauthorized' });
      router.replace('/community');
    }
  }, [mode, post, userId, router, user]);

  if (mode === 'edit' && (!post || post.userId !== userId)) return null;

  const { contentWithoutImages, imageUrls } = post
    ? extractImagesFromContent(post.content)
    : { contentWithoutImages: undefined, imageUrls: [] };

  const handleSubmit = async (
    data: { title: string; contentJson: string },
    newFiles: File[],
    existingUrls: string[],
  ) => {
    try {
      const newUrls = await Promise.all(newFiles.map(uploadImage));

      const finalImageUrls = [...existingUrls, ...newUrls];

      let json;
      try {
        json = JSON.parse(data.contentJson);
      } catch {
        throw new Error('게시물 내용이 올바르지 않습니다.');
      }

      const imageNodes = finalImageUrls.map((url) => ({
        type: 'paragraph',
        content: [{ type: 'image', attrs: { src: url } }],
      }));
      const contentWithImages =
        finalImageUrls.length > 0
          ? JSON.stringify({
              ...json,
              content: [...json.content, ...imageNodes],
            })
          : data.contentJson;

      const payload = {
        title: data.title,
        content: contentWithImages,
        ...(finalImageUrls[0] && { image: finalImageUrls[0] }),
      };

      if (mode === 'create') {
        await createPost(payload);
      } else {
        await updatePost(payload);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '게시물 작성에 실패했습니다.');
    }
  };

  return (
    <PostFormClient
      mode={mode}
      initialValues={post ? { title: post.title, content: contentWithoutImages ?? '' } : undefined}
      initialImageUrls={imageUrls}
      onSubmit={handleSubmit}
    />
  );
}
