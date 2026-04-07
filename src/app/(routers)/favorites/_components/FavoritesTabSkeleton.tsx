import { Skeleton } from '@/components/ui/skeleton';

export function FavoritesTabSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 hidden items-center gap-2 md:flex">
        <Skeleton variant="gray" className="h-7 w-24" />
        <Skeleton variant="gray" className="h-7 w-8" />
      </div>

      <div className="mb-3 flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="gray" className="h-7 w-14 rounded-full" />
        ))}
      </div>

      <div className="flex flex-1 flex-col rounded-[28px] bg-white p-4 shadow-sm md:p-6">
        <Skeleton variant="gray" className="mb-4 h-13 w-full rounded-xl" />

        <div className="flex flex-col">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-2xl px-2 py-3 md:px-4 md:py-4 lg:px-8"
            >
              <Skeleton variant="gray" className="h-[22px] w-[22px] shrink-0 rounded" />
              <Skeleton
                variant="gray"
                className="h-6 rounded"
                style={{ width: `${[30, 40, 25, 35, 30, 40][i % 6]}%` }}
              />
              <Skeleton variant="gray" className="ml-auto h-6 w-6 shrink-0 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
