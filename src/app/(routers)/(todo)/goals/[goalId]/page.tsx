import Image from 'next/image';
import Link from 'next/link';
import GoalsTab from '@/app/(routers)/(todo)/goals/[goalId]/_components/GoalsTab';
import TotalListTab from '@/app/(routers)/(todo)/goals/[goalId]/_components/TotalListTab';

import { DonutProgress } from '@/components/common/DonutProgress';
import { Icon } from '@/components/icon/Icon';

export default async function GoalId({ params }: { params: Promise<{ goalId: string }> }) {
  const progressPercent: number = 64;
  const { goalId } = await params;

  return (
    <div className="flex h-full w-86 flex-col space-y-12 overflow-scroll pt-8 pb-14 md:min-w-159 md:space-y-0 md:pt-0 lg:w-265 lg:max-w-328">
      {/*상단 탭*/}
      <h1 className="font-xl-semibold lg:text-2xl-semibold hidden pt-12 pb-7 text-black md:block md:pt-20 md:pb-10">
        체다치즈님의 목표
      </h1>
      <div className="w-full space-y-4 md:space-y-6 lg:flex lg:space-x-8">
        {/*흰색 목표 표기*/}
        <GoalsTab />
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-5 lg:w-1/2 lg:flex-row lg:space-y-0 lg:space-x-6">
          {/*목표 진행도*/}
          <div className="flex h-40 w-full items-center justify-center space-x-8 rounded-[16px] bg-orange-500 text-white hover:shadow-2xl hover:shadow-orange-300 lg:w-1/2">
            <DonutProgress trackColor="#FFA96C" value={progressPercent} />
            <div className="flex flex-col items-center justify-start">
              <h3 className="font-lg-bold">목표 진행도</h3>
              <p className="display-lg-bold">
                {progressPercent}
                <span className="font-xl-medium mr-1">%</span>
              </p>
            </div>
          </div>
          {/*노트 모아보기*/}
          <Link
            href={`/goals/${goalId}/notes`}
            className="relative h-40 w-full rounded-[16px] bg-blue-200 text-white hover:shadow-2xl hover:shadow-blue-100 lg:w-1/2"
          >
            <Image
              src="/images/large-note.svg"
              alt="note image for note page route"
              width={122}
              height={122}
              className="absolute right-2 bottom-5 object-contain"
            />
            <div className="absolute bottom-8 left-10 flex items-center justify-center">
              <h3 className="font-2xl-bold">노트 모아보기</h3>
              <Icon name="arrow" variant="white" direction="right" />
            </div>
          </Link>
        </div>
      </div>
      {/*할일탭*/}
      <TotalListTab />
    </div>
  );
}
