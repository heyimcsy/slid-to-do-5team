import { useQuery } from '@tanstack/react-query';

export const useOgImage = (url?: string | null) => {
  return useQuery({
    queryKey: ['og-image', url],
    queryFn: async () => {
      const res = await fetch(`/api/og?url=${encodeURIComponent(url!)}`);
      const data = await res.json();
      return data.image as string | null;
    },
    enabled: !!url,
  });
};
