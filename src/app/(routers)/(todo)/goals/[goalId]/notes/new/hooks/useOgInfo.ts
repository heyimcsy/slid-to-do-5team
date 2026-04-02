import type { OgInfoResponse } from '@/components/common/LinkEmbed';

import { useQuery } from '@tanstack/react-query';

export const useOgInfo = (url?: string | null) => {
  return useQuery({
    queryKey: ['og-image', url],
    queryFn: async () => {
      const res = await fetch(`/api/og?url=${encodeURIComponent(url!)}`);
      const data: OgInfoResponse = await res.json();
      return data;
    },
    enabled: !!url,
  });
};
