import { apiClient } from '@/lib/apiClient.browser';

import { compressImage } from '@/utils/compressImage';

export const uploadImage = async (file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) throw new Error('이미지 파일만 업로드할 수 있습니다.');
  let compressedFile: File;
  try {
    compressedFile = await compressImage(file);
  } catch (err) {
    console.warn('[uploadImage] 압축 실패, 원본 파일로 업로드합니다.', err);
    compressedFile = file;
  }

  const { uploadUrl, url } = await apiClient<{ uploadUrl: string; url: string }>('/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: compressedFile.name }),
  });

  const res = await fetch(uploadUrl, { method: 'PUT', body: compressedFile });
  if (!res.ok) throw new Error('이미지 업로드에 실패했습니다.');

  return url;
};
