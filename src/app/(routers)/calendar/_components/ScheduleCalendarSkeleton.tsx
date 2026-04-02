export default function ScheduleCalendarSkeleton() {
  return (
    <div className="h-full w-full bg-white md:h-fit md:rounded-[24px] lg:h-228">
      {/* 헤더 */}
      <div className="flex h-33 flex-col items-center justify-center space-y-4 px-4 lg:h-22 lg:flex-row lg:justify-between lg:space-y-0 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-[16px] bg-gray-200 lg:w-85" />
      </div>

      {/* 요일 헤더 */}
      <div className="grid h-8 grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="border border-gray-100 py-2">
            <div className="mx-auto h-3 w-4 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="grid grid-cols-7" style={{ gridTemplateRows: 'repeat(5, 1fr)' }}>
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="h-24 border-t border-r border-gray-100 p-1.5 [&:nth-child(7n)]:border-r-0"
          >
            <div className="mb-2 h-6 w-6 animate-pulse rounded-full bg-gray-200" />
            <div className="space-y-1">
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
