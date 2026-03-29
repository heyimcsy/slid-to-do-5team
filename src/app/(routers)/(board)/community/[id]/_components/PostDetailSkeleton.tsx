export function PostDetailSkeleton() {
  return (
    <div
      className="h-full w-full overflow-y-auto bg-gray-100 px-4 py-4 md:px-8 md:py-10 lg:p-14"
      aria-busy="true"
      aria-label="게시물 로딩 중"
    >
      <div className="mx-auto w-full md:max-w-[636px] lg:max-w-[768px]">
        <div className="flex flex-col gap-10 rounded-3xl bg-white px-5 py-6 md:gap-14 md:p-10 lg:p-14">
          <div className="w-full">
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-gray-200" />

            <div className="mt-6 flex items-center gap-1">
              <div className="size-8 animate-pulse rounded-full bg-gray-200" />
              <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200" />
            </div>

            <hr className="mt-4 border-gray-200" />

            <div className="mt-6 flex flex-col gap-3">
              <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-200" />
            </div>

            <div className="mt-4 h-3 w-32 animate-pulse rounded-md bg-gray-200" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="h-5 w-16 animate-pulse rounded-md bg-gray-200" />

            <div className="flex gap-3 md:gap-4">
              <div className="h-12 flex-1 animate-pulse rounded-xl bg-gray-200 md:h-14 md:rounded-2xl" />
              <div className="h-12 w-16 animate-pulse rounded-full bg-gray-200 md:h-14 md:w-20" />
            </div>

            <ul className="flex flex-col gap-8 md:gap-10">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
                    <div className="h-3 w-16 animate-pulse rounded-md bg-gray-200" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
