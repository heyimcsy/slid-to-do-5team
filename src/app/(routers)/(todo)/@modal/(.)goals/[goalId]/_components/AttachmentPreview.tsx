import Image from 'next/image';

import { Icon } from '@/components/icon/Icon';

interface AttachmentPreviewProps {
  url?: string;
  image?: string;
}

export function AttachmentPreview({ url, image }: AttachmentPreviewProps) {
  return (
    <div className="flex flex-col gap-2">
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-base-regular flex items-center gap-1 text-sm text-gray-700 no-underline"
        >
          <Icon name="linkEditor" size={24} />
          {url}
        </a>
      )}
      {image && (
        <div className="relative h-44.5 w-full overflow-hidden rounded-[16px] border-gray-200 md:h-51.5">
          <Image src={image} alt="첨부된 이미지" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
