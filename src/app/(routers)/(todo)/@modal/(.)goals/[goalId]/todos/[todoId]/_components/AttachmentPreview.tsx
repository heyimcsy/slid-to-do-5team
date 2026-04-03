import Image from 'next/image';

import { Icon } from '@/components/icon/Icon';

interface AttachmentPreviewProps {
  linkUrl: string | null;
  fileUrl: string | null;
}

export function AttachmentPreview({ linkUrl, fileUrl }: AttachmentPreviewProps) {
  return (
    <div className="flex flex-col gap-2">
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-base-regular flex items-center gap-1 text-sm text-gray-700 no-underline"
        >
          <Icon name="link" size={24} variant="default" />
          {linkUrl}
        </a>
      )}
      {fileUrl && (
        <div className="relative h-44.5 w-full overflow-hidden rounded-[16px] border-gray-200 md:h-51.5">
          <Image
            src={fileUrl}
            alt="할일 관련 이미지"
            width={500}
            height={350}
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
