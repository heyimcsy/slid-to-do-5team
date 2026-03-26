import GoalsInnerTab from '@/app/(routers)/(todo)/goals/[goalId]/_components/GoalsInnerTab';

export default async function GoalId({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;

  return (
    <div className="flex h-full w-86 flex-col space-y-12 pt-8 pb-14 md:min-w-159 md:space-y-0 md:pt-0 lg:w-265 lg:max-w-328">
      <h1 className="font-xl-semibold lg:text-2xl-semibold hidden pt-12 pb-7 text-black md:block md:pt-20 md:pb-10">
        체다치즈님의 목표
      </h1>
      <GoalsInnerTab goalId={Number(goalId)} />
    </div>
  );
}
