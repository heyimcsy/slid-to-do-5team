export default function NewNoteSkeleton() {
  return (
    <div className="relative flex h-full w-full flex-col items-center p-4 md:w-159 md:pt-12 md:pb-7.5 lg:w-192 lg:pt-18 lg:pb-15.5">
      {/* 헤더 */}
      <div className="flex h-6 w-[343px] items-center justify-between md:h-10 md:w-full">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200 md:h-8 md:w-44" />
        <div className="flex space-x-2">
          <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>

      <div className="mt-4 flex h-full w-[343px] flex-col rounded-[24px] bg-white p-4 pb-8 md:w-full">
        {/* 툴바 */}
        <div className="h-11 w-full animate-pulse rounded-[18px] bg-gray-100" />

        {/* 제목 */}
        <div className="mt-4 flex items-center space-x-2 md:mt-7">
          <div className="size-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
          <div className="h-7 w-64 animate-pulse rounded bg-gray-200 md:w-96" />
        </div>

        {/* MetaTags */}
        <div className="mt-7 flex flex-col space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
            <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
            <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>

        <hr className="mt-4 w-full border-gray-200 lg:mt-7" />

        {/* 에디터 본문 */}
        <div className="mt-4 flex h-3/4 flex-col space-y-3 lg:mt-7">
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-3/6 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
