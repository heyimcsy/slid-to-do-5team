import { apiClient } from '@/lib/apiClient.browser';

export const uploadImage = async (file: File): Promise<string> => {
  const { uploadUrl, url } = await apiClient<{ uploadUrl: string; url: string }>('/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name }),
  });

  await fetch(uploadUrl, { method: 'PUT', body: file });

  return url;
};
