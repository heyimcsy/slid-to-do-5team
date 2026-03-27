export function TodoDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* 제목 + 뱃지 */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
      </div>
      {/* 목표 */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
      </div>
      {/* 마감기한 */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      </div>
      {/* 태그 */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-14 animate-pulse rounded-full bg-gray-200" />
        <div className="h-6 w-14 animate-pulse rounded-full bg-gray-200" />
      </div>
      {/* 첨부자료 */}
      <div className="h-24 w-full animate-pulse rounded-xl bg-gray-200" />
    </div>
  );
}
