import { useOgImage } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/hooks/useOgImage';

import { Icon } from '@/components/icon/Icon';

interface AttachmentPreviewProps {
  url?: string;
}

export function AttachmentPreview({ url }: AttachmentPreviewProps) {
  const { data: ogImage } = useOgImage(url);
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
      {ogImage && (
        <div className="relative h-44.5 w-full overflow-hidden rounded-[16px] border-gray-200 md:h-51.5">
          <img src={ogImage} alt="링크 미리보기 이미지" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
