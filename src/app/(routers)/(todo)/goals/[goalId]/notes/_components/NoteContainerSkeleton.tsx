export default function NotesContainerSkeleton() {
  return (
    <>
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between">
        <div className="hidden h-7 w-32 animate-pulse rounded bg-gray-200 md:flex" />
        <div className="flex w-[343px] items-center justify-between md:w-[369px] lg:w-[409px]">
          <div className="h-10 w-62 animate-pulse rounded-[16px] bg-gray-200 md:w-70 lg:w-80" />
          <div className="h-10 w-10 animate-pulse rounded-[16px] bg-gray-200" />
        </div>
      </div>

      {/* 목표 탭 */}
      <div className="mt-6 h-16 w-full animate-pulse rounded-[16px] bg-orange-100 md:mt-8 md:h-20 lg:mt-12" />

      {/* 노트 카드 리스트 */}
      <div className="mt-4 space-y-3 md:mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex h-24 w-full animate-pulse flex-col justify-between rounded-[16px] bg-white p-4 md:h-[138px] md:px-[38px] md:pt-7 md:pb-8"
          >
            <div className="flex items-center space-x-3">
              <div className="size-8 shrink-0 rounded-full bg-gray-200 lg:size-10" />
              <div className="h-4 w-48 rounded bg-gray-200" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-12 rounded-full bg-gray-200" />
                <div className="h-4 w-32 rounded bg-gray-200" />
              </div>
              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
