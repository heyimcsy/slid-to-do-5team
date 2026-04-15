'use client';

import Image from 'next/image';
import Link from 'next/link';
import noteImage from '@/../public/images/large-note.svg';
import {
  DONUT_PROGRESS_COLORS,
  GOALS_TEXT,
  NOTE_IMAGE_BIG,
} from '@/app/(routers)/(todo)/constants';
import { GoalHeader } from '@/app/(routers)/(todo)/goals/[goalId]/_components';
import { GoalsInnerTabSkeleton } from '@/app/(routers)/(todo)/goals/[goalId]/_components/index';
import { useGoalWithTodos } from '@/app/(routers)/(todo)/goals/[goalId]/hooks/useGoalWithTodos';

import { ROUTES } from '@/constants/routes';

import { DonutProgress } from '@/components/common/DonutProgress';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Icon } from '@/components/icon/Icon';

export default function GoalInfoTab({ goalId }: { goalId: number }) {
  const { goalData, progressPercent, isLoading, isError, isSuccess, refetch } =
    useGoalWithTodos(goalId);

  if (isLoading) return <GoalsInnerTabSkeleton />;
  if (isError)
    return <ErrorFallback onRetry={refetch} title={GOALS_TEXT.ERROR_TITLE} variant="compact" />;
  if (isSuccess)
    return (
      <div className="w-full space-y-4 md:space-y-6 lg:flex lg:space-x-8">
        {/*상단 흰색 목표 표기*/}
        <GoalHeader goalId={goalId} goalData={goalData} />
        {/*하부 탭*/}
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-5 lg:w-1/2 lg:flex-row lg:space-y-0 lg:space-x-6">
          {/*목표 진행도*/}
          <div className="flex h-40 w-full items-center justify-center space-x-6 rounded-[16px] bg-orange-500 text-white hover:shadow-2xl hover:shadow-orange-300 lg:w-1/2">
            <DonutProgress trackColor={DONUT_PROGRESS_COLORS.TRACK_COLOR} value={progressPercent} />
            <div className="flex w-24 flex-col items-center justify-start">
              <h3 className="font-lg-bold">{GOALS_TEXT.PROGRESS_LABEL}</h3>
              <p className="display-lg-bold">
                {progressPercent}
                <span className="font-xl-medium mr-1">{GOALS_TEXT.PROGRESS_UNIT}</span>
              </p>
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
    );
}
