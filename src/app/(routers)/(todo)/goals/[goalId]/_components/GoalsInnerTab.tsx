'use client';

import Image from 'next/image';
import Link from 'next/link';
import noteImage from '@/../public/images/large-note.svg';
import {
  DONUT_PROGRESS_COLORS,
  GOALS_TEXT,
  NOTE_IMAGE_BIG,
} from '@/app/(routers)/(todo)/constants';
import { GoalProgressPercentage } from '@/app/(routers)/(todo)/goals/[goalId]/_components/GoalProgressPercentage';
import GoalsInnerTabSkeleton from '@/app/(routers)/(todo)/goals/[goalId]/_components/GoalsInnerTabSkeleton';
import GoalsTab from '@/app/(routers)/(todo)/goals/[goalId]/_components/GoalsTab';
import TotalListTab from '@/app/(routers)/(todo)/goals/[goalId]/_components/TotalListTab';
import { useGoalWithTodos } from '@/app/(routers)/(todo)/goals/[goalId]/hooks/useGoalWithTodos';

import { ROUTES } from '@/constants/routes';

import { DonutProgress } from '@/components/common/DonutProgress';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Icon } from '@/components/icon/Icon';

export default function GoalsInnerTab({ goalId }: { goalId: number }) {
  const userInfo = localStorage.getItem('user-info');
  const parsedUserInfo = userInfo ? JSON.parse(userInfo).state : null;
  const userName: string = parsedUserInfo?.user?.name ? parsedUserInfo.user.name : '';

  const {
    goalData,
    todoLists,
    todoListsDone,
    progressPercent,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGoalWithTodos(goalId);

  if (isLoading) return <GoalsInnerTabSkeleton userName={userName} />;
  if (isError) return <ErrorFallback onRetry={refetch} title={GOALS_TEXT.ERROR_TITLE} />;
  if (isSuccess)
    return (
      <>
        <h1 className="font-xl-semibold lg:text-2xl-semibold hidden pt-12 pb-7 text-black md:block md:pt-20 md:pb-10">
          {userName}
          {GOALS_TEXT.PAGE_TITLE_SUFFIX}
        </h1>
        <div className="w-full space-y-4 md:space-y-6 lg:flex lg:space-x-8">
          {/*흰색 목표 표기*/}
          <GoalsTab goalId={goalId} goalData={goalData} />
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-5 lg:w-1/2 lg:flex-row lg:space-y-0 lg:space-x-6">
            {/*목표 진행도*/}
            <div className="flex h-40 w-full items-center justify-center space-x-8 rounded-[16px] bg-orange-500 text-white hover:shadow-2xl hover:shadow-orange-300 lg:w-1/2">
              <DonutProgress
                trackColor={DONUT_PROGRESS_COLORS.TRACK_COLOR}
                value={progressPercent}
              />
              <div className="flex flex-col items-center justify-start">
                <h3 className="font-lg-bold">{GOALS_TEXT.PROGRESS_LABEL}</h3>
                <GoalProgressPercentage value={progressPercent} />
              </div>
            </div>
            {/*노트 모아보기*/}
            <Link
              href={ROUTES.NOTES(goalId)}
              className="relative h-40 w-full rounded-[16px] bg-blue-200 text-white hover:shadow-2xl hover:shadow-blue-100 lg:w-1/2"
            >
              <Image
                src={noteImage}
                alt={NOTE_IMAGE_BIG.ALT}
                width={NOTE_IMAGE_BIG.WIDTH}
                height={NOTE_IMAGE_BIG.HEIGHT}
                className="absolute right-2 bottom-5 object-contain"
              />
              <div className="absolute bottom-8 left-10 flex items-center justify-center">
                <h3 className="font-2xl-bold">{GOALS_TEXT.NOTE_LINK_LABEL}</h3>
                <Icon name="arrow" variant="white" direction="right" />
              </div>
            </Link>
          </div>
        </div>
        {/*할일탭*/}
        <TotalListTab goalId={goalId} todoLists={todoLists} todoListsDone={todoListsDone} />
      </>
    );
}
