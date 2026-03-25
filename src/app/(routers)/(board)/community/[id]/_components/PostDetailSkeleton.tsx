export function PostDetailSkeleton() {
  return (
    <div className="h-full w-full overflow-y-auto bg-gray-100 px-4 py-4 md:px-8 md:py-10 lg:p-14">
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
        </div>
      </div>
    </div>
  );
}
