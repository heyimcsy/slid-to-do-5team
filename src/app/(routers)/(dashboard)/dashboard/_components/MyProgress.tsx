import Image from 'next/image';

import { DonutProgress } from '@/components/common/DonutProgress';

export function MyProgress() {
  //FIXME: 일단 임시 데이터 넣어두고 추후 백엔드 연동 필요
  const name = '홍길동';
  const progress = 49;
  return (
    <div className="my-progress-list flex flex-col gap-4">
      <div className="my-progress-list-header flex justify-between">
        <section className="flex items-center justify-between">
          <h2 className="flex items-center gap-2">
            <Image
              src="/images/img-progress.svg"
              alt="나의 진행 상황 아이콘"
              aria-hidden
              width={40}
              height={40}
              className="size-8 md:size-8 lg:size-10"
            />
            <span className="font-base-medium md:font-base-medium lg:font-lg-medium">
              나의 진행 상황
            </span>
          </h2>
        </section>
      </div>
      <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-blue-200 bg-linear-to-b from-transparent to-black/5 dark:bg-blue-300">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/img-progress-mascot.svg')] bg-size-[auto_75%] bg-position-[right_-4%_bottom_0] bg-no-repeat opacity-40 md:bg-size-[auto_85%] lg:bg-size-[auto_90%] dark:opacity-35"
          aria-hidden
        />
        <div className="relative flex w-full items-center gap-x-5 md:gap-x-5 lg:gap-x-8">
          <div className="my-progress-list-progress-donut py-12 pl-6 md:py-12 md:pl-6 lg:py-12 lg:pl-12">
            <DonutProgress
              value={progress}
              responsive
              className="size-23 backdrop-blur-[1px] md:size-23 lg:size-40"
              trackColor="#009D97CC"
            />
          </div>
          <div className="my-progress-list-progress-text gap-y-1 text-white backdrop-blur-[0.5px] text-shadow-[0_0_4px_rgba(0,0,0,0.125)] md:gap-y-1 lg:gap-y-3 dark:text-black">
            <h3 className="font-sm-semibold md:font-sm-semibold lg:font-xl-semibold">
              {name}님의 진행도는
            </h3>
            <h5 className="display-lg-bold md:display-lg-bold lg:display-xl-bold after:font-xl-medium md:after:font-xl-medium lg:after:font-3xl-medium font-features-['ss01','ss02','ss06','ss08'] after:content-['%']">
              {progress}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
