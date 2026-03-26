export function TodoSectionSkeleton({ showActions }: { showActions?: boolean }) {
  return (
    <div className="flex h-fit w-full min-w-0 flex-col space-y-[10px]">
      {/* 헤더 */}
      <div className="flex h-fit w-full items-center justify-between px-2 lg:h-10">
        <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
        {showActions && (
          <div className="flex space-x-2">
            <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          </div>
        )}
      </div>

      {/* 리스트 영역 */}
      <div className="h-49 w-full rounded-[28px] bg-orange-100 px-4 py-5 md:h-80 lg:h-144">
        <div className="flex h-full w-full flex-col space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex h-9 items-center space-x-2 px-1 md:h-11 md:px-2">
              {/* 체크박스 */}
              <div className="h-[18px] w-[18px] shrink-0 animate-pulse rounded bg-gray-200" />
              {/* 타이틀 - 길이 랜덤하게 */}
              <div
                className="h-4 animate-pulse rounded bg-gray-200"
                style={{ width: `${[40, 55, 70, 50, 65][i % 5]}%` }}
              />
              {/* 액션 아이콘들 */}
              <div className="ml-auto flex space-x-1">
                <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
