'use client';

import React from 'react';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';

export interface OgInfoResponse {
  description: string | null;
  favicon: string | null;
  image: string | null;
  title: string | null;
}
interface LinkEmbedProps {
  url: string;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  data: OgInfoResponse | undefined;
}

export function LinkEmbed({ url, data, onDelete }: LinkEmbedProps) {
  return (
    <div className="relative h-full w-full space-y-1 overflow-hidden rounded-[16px] bg-gray-50 px-4 py-[14px]">
      <Button
        variant="icon"
        size="none"
        className="absolute top-[14px] right-4 h-fit w-fit min-w-0"
        onClick={onDelete}
      >
        <Icon name="delete" size={24} />
      </Button>

      <div className="flex min-w-0 items-center justify-start space-x-2 pr-4">
        {data?.favicon && <img src={data.favicon} alt="favicon" className="size-6 shrink-0" />}
        {data?.description && <p className="font-sm-medium truncate">{data.description}</p>}
      </div>

      <p className="font-xs-regular truncate text-gray-400">{url}</p>
    </div>
  );
}
