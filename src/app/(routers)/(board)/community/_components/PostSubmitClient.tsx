'use client';

import { uploadImages } from '../_api/communityApi';
import { compressImage } from '../_utils/compressImage';
import { PostFormClient } from './PostFormClient';

interface Props {
  mode: 'create' | 'edit';
  postId?: number;
  initialValues?: { title: string; content: string };
  initialImageUrls?: string[];
}

export function PostSubmitClient({ mode, postId, initialValues, initialImageUrls }: Props) {
  const handleSubmit = async (
    data: { title: string; contentJson: string },
    newFiles: File[],
    existingUrls: string[],
  ) => {
    const compressedFiles = await Promise.all(newFiles.map(compressImage));
    const newUrls = await Promise.all(compressedFiles.map(uploadImages));

    const finalImageUrls = [...existingUrls, ...newUrls];

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
