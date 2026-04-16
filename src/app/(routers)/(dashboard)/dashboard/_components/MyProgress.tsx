'use client';

import Image from 'next/image';
import { useGetTodos } from '@/api/todos';
import { useUserInfo } from '@/hooks/auth/useUserInfo';

import { DonutProgress } from '@/components/common/DonutProgress';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Skeleton } from '@/components/ui/skeleton';

import { ProgressPercentage } from './ProgressPercentage';

const MyProgressSkeleton = () => {
  return (
    <div className="my-progress-list flex flex-col gap-4">
      <div className="my-progress-list-header flex justify-between">
        <section className="flex items-center justify-between">
          <h2 className="flex items-center gap-2">
            <Skeleton variant="gray" className="size-8 rounded-xl md:size-8 lg:size-10" />
            <Skeleton variant="gray" className="h-6 w-28 rounded-lg md:w-32 lg:h-7 lg:w-36" />
          </h2>
        </section>
      </div>
      <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-blue-200 bg-linear-to-b from-transparent to-black/5 dark:bg-blue-300">
        <div className="relative flex w-full items-center gap-x-5 px-6 py-12 md:gap-x-5 md:px-6 md:py-12 lg:gap-x-8 lg:px-12 lg:py-12">
          <Skeleton
            variant="gray"
            className="size-23 shrink-0 rounded-full md:size-23 lg:size-40"
          />
          <div className="flex flex-col gap-y-2">
            <Skeleton variant="gray" className="h-5 w-32 rounded-md md:w-40 lg:h-7 lg:w-52" />
            <Skeleton variant="gray" className="h-9 w-18 rounded-md md:w-22 lg:h-12 lg:w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MyProgress = () => {
  const user = useUserInfo();
  const name = user?.name ?? '손';
  const { data: todos, isLoading, error, refetch } = useGetTodos({ limit: 100 });
  const completedTodos = todos?.todos.filter((todo) => todo.done).length ?? 0;
  const totalTodos = todos?.todos.length ?? 0;
  const progress = totalTodos === 0 ? 0 : Number(Math.round((completedTodos / totalTodos) * 100));
  if (isLoading) return <MyProgressSkeleton />;
  if (error || !todos) return <ErrorFallback variant="compact" onRetry={() => void refetch()} />;
  /**
   * 필요 데이터: name, 전체 완료된 일, 완료되지 않은 할 일 (완료/(완료+미완료))
   */
  // const name = '홍길동';
  // const progress = 49;
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
      <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-blue-200 bg-linear-to-b from-transparent to-black/5 transition-shadow duration-300 hover:shadow-[0_10px_40px_0_oklch(0.79_0.128_184.6/0.4)] dark:bg-blue-300">
        <Image
          src="/images/img-progress-mascot.svg"
          alt=""
          aria-hidden
          width={480}
          height={480}
          priority
          fetchPriority="high"
          className="pointer-events-none absolute right-[-4%] bottom-0 z-0 h-[75%] w-auto opacity-40 md:h-[85%] lg:h-[90%] dark:opacity-35"
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
            <ProgressPercentage value={progress} />
          </div>
        </div>
      </div>
    </div>
  );
};
