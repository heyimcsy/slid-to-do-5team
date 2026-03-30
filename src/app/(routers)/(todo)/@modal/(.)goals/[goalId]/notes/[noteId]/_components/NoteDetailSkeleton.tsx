export default function NoteDetailSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="shrink-0 space-y-6 md:space-y-7.5">
        {/* 아이콘 + 제목 */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="size-8 shrink-0 animate-pulse rounded-full bg-gray-200 md:size-10" />
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200 md:w-64" />
        </div>

        {/* MetaTags */}
        <div className="flex flex-col space-y-3">
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
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="my-4 h-px w-full shrink-0 bg-gray-100 md:my-6" />

      {/* 링크 카드 */}
      <div className="mb-6 h-16 w-full animate-pulse rounded-[12px] bg-gray-100" />

      {/* 본문 */}
      <div className="flex flex-1 flex-col space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-gray-100" />
        <div className="mt-4 h-5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-3/6 animate-pulse rounded bg-gray-100" />
        <div className="mt-4 h-5 w-40 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}
