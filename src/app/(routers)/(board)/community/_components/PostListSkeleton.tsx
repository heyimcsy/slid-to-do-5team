import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_COUNT = 5;

function FeaturedPostCardSkeleton() {
  return (
    <Skeleton
      variant="gray"
      className="h-[204px] w-[260px] shrink-0 rounded-[24px] md:h-[250px] md:w-[384px] md:rounded-[32px]"
    />
  );
}

export function PostListItemSkeleton() {
  return (
    <div className="flex w-full items-center gap-6 px-4 py-6 md:gap-8 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-gray-300">
      <div className="flex flex-1 flex-col gap-2 md:gap-[26px]">
        <div className="flex flex-col gap-1 md:gap-4">
          <Skeleton variant="gray" className="h-5 w-3/4" />
          <Skeleton variant="gray" className="h-8 w-full" />
        </div>
        <Skeleton variant="gray" className="h-4 w-1/2" />
      </div>
      <Skeleton
        variant="gray"
        className="size-[72px] shrink-0 rounded-[12px] md:size-[120px] md:rounded-[16px]"
      />
    </div>
  );
}

export function PostListSkeleton() {
  return (
    <div className="h-full w-full bg-gray-100 px-4 py-6 md:px-8 md:py-12" aria-busy="true">
      <div className="mx-auto w-full max-w-[1200px]">
        <Skeleton variant="gray" className="mb-6 h-8 w-40 md:mb-8" />

        <div className="mb-6 flex gap-4 overflow-x-auto pb-2 md:mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <FeaturedPostCardSkeleton key={i} />
          ))}
        </div>

        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col self-stretch">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <PostListItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
