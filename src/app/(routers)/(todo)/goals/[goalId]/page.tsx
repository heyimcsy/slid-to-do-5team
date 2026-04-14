import type { User } from '@/lib/auth/schemas/user';

import { GOALS_TEXT } from '@/app/(routers)/(todo)/constants';
import { GoalInfoTab, TotalListTab } from '@/app/(routers)/(todo)/goals/[goalId]/_components';
import { getCurrentUser } from '@/lib/auth/getCurrentUser.server';

export default async function GoalId({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const userInfo: User | null = await getCurrentUser();
  const userName: string = userInfo?.name ? userInfo.name : '';
  return (
    <div className="flex h-full w-86 flex-col space-y-12 pt-8 pb-14 md:min-w-159 md:space-y-0 md:pt-0 lg:w-265 lg:max-w-328">
      <h1 className="font-xl-semibold lg:text-2xl-semibold hidden pt-12 pb-7 text-black md:block md:pt-20 md:pb-10">
        {userName}
        {GOALS_TEXT.PAGE_TITLE_SUFFIX}
      </h1>
      <GoalInfoTab goalId={Number(goalId)} />
      <TotalListTab goalId={Number(goalId)} />
    </div>
  );
}
