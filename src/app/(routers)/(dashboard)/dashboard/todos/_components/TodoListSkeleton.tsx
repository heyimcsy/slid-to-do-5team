import { Skeleton } from '@/components/ui/skeleton';

const TodoListSkeleton = () => {
  return (
    <div className="w-full flex-1 rounded-2xl bg-white px-2 py-3 shadow-sm md:max-w-[636px] lg:max-w-[672px]">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-2 rounded-2xl px-2 py-2 md:px-4 md:py-3 lg:justify-center lg:px-8"
        >
          <Skeleton variant="gray" className="size-[24px] shrink-0 rounded-md" />

          <div className="flex flex-1 items-center justify-between gap-2">
            <Skeleton variant="gray" className="h-4 w-2/3" />

            <Skeleton variant="gray" className="size-5 shrink-0 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoListSkeleton;
