import type { OgInfoResponse } from '@/components/common/LinkEmbed';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';

interface LinkEmbedOgImageProps {
  showEmbed: boolean;
  linkUrl: string | null;
  linkData: OgInfoResponse | undefined;
  linkSuccess: boolean;
  handleLinkClick: () => void;
}

export default function LinkEmbedOgImage({
  showEmbed,
  linkUrl,
  linkData,
  linkSuccess,
  handleLinkClick,
}: LinkEmbedOgImageProps) {
  return (
    <>
      {showEmbed && linkUrl && linkData?.image && linkSuccess && (
        <>
          {/* mobile / md - 하단에서 올라오는 패널 */}
          <div className="fixed bottom-0 left-0 z-10 flex h-fit w-full flex-col lg:hidden">
            <Button
              variant="icon"
              size="none"
              onClick={handleLinkClick}
              aria-label="링크 미리보기 패널 닫기"
              className="absolute -top-7 right-5 flex h-7 w-11 cursor-pointer items-center justify-center rounded-b-[12px] border border-b-0 border-gray-200 bg-slate-50 md:-top-9 md:h-9 md:w-15"
            >
              <Icon name="arrow" direction="down" size={16} />
            </Button>
            <div className="flex h-[230px] w-full items-center justify-center overflow-auto border-t border-gray-200 bg-slate-50 p-4 md:h-[417px] md:p-10">
              <img src={linkData.image} alt="og image" className="object-cover" />
            </div>
          </div>

          {/* lg - 오른쪽 사이드 패널 */}
          <div className="fixed top-0 right-0 z-10 hidden h-full w-fit flex-col lg:flex">
            <Button
              variant="icon"
              size="none"
              onClick={handleLinkClick}
              aria-label="링크 미리보기 패널 닫기"
              className="absolute top-5 -left-9 flex h-15 w-9 cursor-pointer items-center justify-center rounded-r-[12px] border border-r-0 border-gray-200 bg-slate-50"
            >
              <Icon name="arrow" direction="right" size={16} />
            </Button>
            <div className="flex h-full w-140 items-center justify-center overflow-auto border-l border-gray-200 bg-slate-50 p-10">
              <img src={linkData.image} alt="og image" className="object-cover" />
            </div>
          </div>
        </>
      )}
    </>
  );
}
