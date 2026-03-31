import { apiClient } from '@/lib/apiClient.browser';

export const uploadImage = async (file: File): Promise<string> => {
  const { uploadUrl, url } = await apiClient<{ uploadUrl: string; url: string }>('/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name }),
  });

  const res = await fetch(uploadUrl, { method: 'PUT', body: file });
  if (!res.ok) throw new Error('이미지 업로드에 실패했습니다.');

  return url;
};
