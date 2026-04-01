import { Skeleton } from '@/components/ui/skeleton';

function CommentItemSkeleton() {
  return (
    <li className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="gray" className="size-8 rounded-full" />
        <Skeleton variant="gray" className="h-4 w-20" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton variant="gray" className="h-4 w-full" />
        <Skeleton variant="gray" className="h-3 w-16" />
      </div>
    </li>
  );
}

export function PostDetailSkeleton() {
  return (
    <div
      className="h-full w-full overflow-y-auto bg-gray-100 px-4 py-4 md:px-8 md:py-10 lg:p-14"
      aria-busy="true"
      aria-label="게시물 로딩 중"
    >
      <div className="mx-auto w-full md:max-w-[636px] lg:max-w-[768px]">
        <div className="flex flex-col gap-10 rounded-3xl bg-white px-5 py-6 md:gap-14 md:p-10 lg:p-14">
          {/* 게시물 */}
          <div className="w-full">
            <Skeleton variant="gray" className="h-6 w-3/4" />
            <div className="mt-6 flex items-center gap-1">
              <Skeleton variant="gray" className="size-8 rounded-full" />
              <Skeleton variant="gray" className="h-4 w-20" />
            </div>
            <hr className="mt-4 border-gray-200" />
            <div className="mt-6 flex flex-col gap-3">
              <Skeleton variant="gray" className="h-4 w-full" />
              <Skeleton variant="gray" className="h-4 w-full" />
              <Skeleton variant="gray" className="h-4 w-2/3" />
            </div>
            <Skeleton variant="gray" className="mt-4 h-3 w-32" />
          </div>

          {/* 댓글 */}
          <div className="flex flex-col gap-6">
            <Skeleton variant="gray" className="h-5 w-16" />
            <div className="flex gap-3 md:gap-4">
              <Skeleton variant="gray" className="h-12 flex-1 md:h-14 md:rounded-2xl" />
              <Skeleton variant="gray" className="h-12 w-16 rounded-full md:h-14 md:w-20" />
            </div>
            <ul className="flex flex-col gap-8 md:gap-10">
              {Array.from({ length: 3 }).map((_, i) => (
                <CommentItemSkeleton key={i} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
