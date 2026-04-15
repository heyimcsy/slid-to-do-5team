import type { SaveCheckToastProps } from '@/app/(routers)/(todo)/goals/[goalId]/notes/types';

import { NOTES_TEXT } from '@/app/(routers)/(todo)/constants';

import { Icon } from '@/components/icon/Icon';

export default function SaveCheckToast({ saveCheck, elapsedSeconds }: SaveCheckToastProps) {
  return (
    <>
      {saveCheck && (
        <div className="absolute bottom-40 left-1/2 z-1 flex h-10 w-[311px] -translate-x-1/2 items-center rounded-[28px] bg-orange-100 px-4 md:w-[576px] lg:w-[688px]">
          <Icon name="check" variant="orange" />
          <p className="font-sm-semibold text-orange-600">
            {NOTES_TEXT.TEMPORARY_SAVED_CHECK(elapsedSeconds)}
          </p>
        </div>
      )}
    </>
  );
}
