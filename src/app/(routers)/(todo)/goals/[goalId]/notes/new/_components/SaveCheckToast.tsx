import { Icon } from '@/components/icon/Icon';

interface SaveCheckToastProps {
  saveCheck: boolean;
  elapsedSeconds: number;
}
export default function SaveCheckToast({ saveCheck, elapsedSeconds }: SaveCheckToastProps) {
  return (
    <>
      {saveCheck && (
        <div className="absolute bottom-40 left-1/2 z-1 flex h-10 w-[311px] -translate-x-1/2 items-center rounded-[28px] bg-orange-100 px-4 md:w-[576px] lg:w-[688px]">
          <Icon name="check" variant="orange" />
          <p className="font-sm-semibold text-orange-600">
            임시 저장이 완료되었습니다 ㆍ{elapsedSeconds}초 전
          </p>
        </div>
      )}
    </>
  );
}
