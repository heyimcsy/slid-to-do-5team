'use client';

import type { Notes } from '@/api/notes';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import goalImage from '@/../public/images/large-goal.svg';
import { useGetGoal } from '@/api/goals';
import { useGetNotes } from '@/api/notes';
import NotesContainerSkeleton from '@/app/(routers)/(todo)/goals/[goalId]/notes/_components/NoteContainerSkeleton';
import NoteList from '@/app/(routers)/(todo)/goals/[goalId]/notes/_components/NoteList';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

import { SearchInput } from '@/components/common/SearchInput';
import { SortFilter } from '@/components/common/SortFilter';

export default function NotesContainer() {
  const pathname = usePathname();
  const goalId: number = Number(pathname.split('/')[2]);
  const { data, isLoading, isSuccess } = useGetNotes({ goalId });
  const { data: goalData } = useGetGoal({ id: goalId });

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebouncedValue(searchValue, 300);

  // 클라이언트 필터링
  const filteredNotes = data?.notes.filter((note: Notes) =>
    note.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  if (isLoading) return <NotesContainerSkeleton />;
  if (isSuccess)
    return (
      <>
        {/* 헤더 */}
        <div className="flex w-full items-center justify-between">
          <h1 className="font-xl-semibold lg:font-2xl-semibold hidden md:flex">노트 모아보기</h1>
          <div className="flex w-[343px] items-center justify-between md:w-[369px] lg:w-[409px]">
            <div className="w-62 md:w-70 lg:w-80">
              <SearchInput
                className="overflow-hidden bg-white"
                placeholder="노트를 검색해주세요"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <SortFilter />
          </div>
        </div>

        {/* 목표 탭 */}
        <div className="lg:h=30 mt-6 flex h-16 w-full min-w-0 items-center justify-start space-x-3 rounded-[16px] bg-orange-100 p-4 md:mt-8 md:h-20 md:p-6 lg:mt-12 lg:space-x-6 lg:p-10">
          <Image
            src={goalImage}
            alt="describe goal icon"
            width={40}
            height={40}
            className="w-8 object-contain lg:w-10"
          />
          <h2 className="lg:font-2xl-semibold font-base-semibold md:font-xl-semibold truncate text-gray-700">
            {goalData?.title}
          </h2>
        </div>

        {/* 노트 리스트 */}
        <div className="mt-4 md:mt-6">
          <NoteList notes={filteredNotes ?? []} goalId={goalId} />
        </div>
      </>
    );
}
