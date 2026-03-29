import GoalsInnerTab from '@/app/(routers)/(todo)/goals/[goalId]/_components/GoalsInnerTab';

export default async function GoalId({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;

  return (
    <div className="flex h-full w-86 flex-col space-y-12 pt-8 pb-14 md:min-w-159 md:space-y-0 md:pt-0 lg:w-265 lg:max-w-328">
      <GoalsInnerTab goalId={Number(goalId)} />
    </div>
  );
}
