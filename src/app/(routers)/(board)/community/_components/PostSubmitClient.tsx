'use client';

import { compressImage } from '../_utils/compressImage';
import { PostFormClient } from './PostFormClient';

interface Props {
  mode: 'create' | 'edit';
  postId?: number;
  initialValues?: { title: string; content: string };
  initialImageUrls?: string[];
}

export function PostSubmitClient({ mode, postId, initialValues, initialImageUrls }: Props) {
  const handleSubmit = async (data: { title: string; contentJson: string }, images: File[]) => {
    const compressedImages = await Promise.all(images.map(compressImage));

    if (mode === 'create') {
      // useCreatePost
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
