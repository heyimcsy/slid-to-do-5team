import { TodoSectionSkeleton } from '@/app/(routers)/(todo)/goals/[goalId]/_components/TodoSectionSkeleton';

export default function GoalsInnerTabSkeleton({ userName }: { userName: string }) {
  return (
    <>
      <h1 className="font-xl-semibold lg:text-2xl-semibold hidden pt-12 pb-7 text-black md:block md:pt-20 md:pb-10">
        {userName}님의 목표
      </h1>
      <div className="w-full space-y-4 md:space-y-6 lg:flex lg:space-x-8">
        {/* 흰색 목표 표기 skeleton */}
        <div className="flex h-16 w-full animate-pulse items-center rounded-[16px] bg-white p-4 lg:h-40 lg:w-1/2">
          <div className="h-8 w-8 rounded-full bg-gray-200" />
          <div className="ml-3 h-4 w-40 rounded bg-gray-200" />
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-5 lg:w-1/2 lg:flex-row lg:space-y-0 lg:space-x-6">
          {/* 목표 진행도 skeleton */}
          <div className="flex h-40 w-full animate-pulse items-center justify-center space-x-8 rounded-[16px] bg-orange-200 lg:w-1/2" />
          {/* 노트 모아보기 skeleton */}
          <div className="h-40 w-full animate-pulse rounded-[16px] bg-blue-100 lg:w-1/2" />
        </div>
      </div>
      <div className="flex flex-col space-y-4 md:space-y-4 lg:flex-row lg:space-x-8">
        <TodoSectionSkeleton showActions />
        <TodoSectionSkeleton />
      </div>
    </>
  );
}
