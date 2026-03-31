'use client';

import { uploadImage } from '../_api/communityApi';
import { useCreatePost } from '../_api/communityQueries';
import { compressImage } from '../_utils/compressImage';
import { PostFormClient } from './PostFormClient';

interface Props {
  mode: 'create' | 'edit';
  postId?: number;
  initialValues?: { title: string; content: string };
  initialImageUrls?: string[];
}

export function PostSubmitClient({ mode, postId: _postId, initialValues, initialImageUrls }: Props) {
  const { mutateAsync: createPost } = useCreatePost();

  const handleSubmit = async (
    data: { title: string; contentJson: string },
    newFiles: File[],
    existingUrls: string[],
  ) => {
    const compressedFiles = await Promise.all(newFiles.map(compressImage));
    const newUrls = await Promise.all(compressedFiles.map(uploadImage));

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
      image: finalImageUrls[0] ?? null,
    };

    if (mode === 'create') {
      await createPost(payload);
    } else {
      // useUpdatePost
    }
  };

  return (
    <PostFormClient
      mode={mode}
      initialImageUrls={initialImageUrls}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}
