'use client';

import type { Notes } from '@/api/notes';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import goalImage from '@/../public/images/large-goal.svg';
import { useGetGoal } from '@/api/goals';
import { useGetNotesInfinite } from '@/api/notes';
import { GOAL_IMAGE_BIG, NOTES_TEXT } from '@/app/(routers)/(todo)/constants';
import NotesContainerSkeleton from '@/app/(routers)/(todo)/goals/[goalId]/notes/_components/NoteContainerSkeleton';
import NoteList from '@/app/(routers)/(todo)/goals/[goalId]/notes/_components/NoteList';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { SearchInput } from '@/components/common/SearchInput';
import { SortFilter } from '@/components/common/SortFilter';

export default function NotesContainer() {
  const pathname = usePathname();
  const goalId: number = Number(pathname.split('/')[2]);

  const { data: goalData } = useGetGoal({ id: goalId });
  const { data, isLoading, isSuccess, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetNotesInfinite({ goalId });
  const allNotes = data?.pages.flatMap((page) => page.notes) ?? [];

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebouncedValue(searchValue, 300);

  // 클라이언트 필터링
  const filteredNotes: Notes[] = allNotes.filter((note: Notes) =>
    note.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const { observerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading) return <NotesContainerSkeleton />;
  if (isSuccess)
    return (
      <>
        {/* 헤더 */}
        <div className="flex w-full items-center justify-between">
          <h1 className="font-xl-semibold lg:font-2xl-semibold hidden md:flex">
            {NOTES_TEXT.NOTE_ALL}
          </h1>
          <div className="flex w-[343px] items-center justify-between md:w-[369px] lg:w-[409px]">
            <div className="w-62 md:w-70 lg:w-80">
              <SearchInput
                className="overflow-hidden bg-white"
                placeholder={NOTES_TEXT.NOTE_SEARCH_INPUT}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <SortFilter options={['최신순', '오래된순']} />
          </div>
        </div>

        {/* 목표 탭 */}
        <div className="lg:h=30 mt-6 flex h-16 w-full min-w-0 items-center justify-start space-x-3 rounded-[16px] bg-orange-100 p-4 md:mt-8 md:h-20 md:p-6 lg:mt-12 lg:space-x-6 lg:p-10">
          <Image
            src={goalImage}
            alt={GOAL_IMAGE_BIG.ALT}
            width={GOAL_IMAGE_BIG.WIDTH}
            height={GOAL_IMAGE_BIG.HEIGHT}
            className="w-8 object-contain lg:w-10"
          />
          <h2 className="lg:font-2xl-semibold font-base-semibold md:font-xl-semibold truncate text-gray-700">
            {goalData?.title}
          </h2>
        </div>

        {/* 노트 리스트 */}
        <div className="mt-4 md:mt-6">
          <NoteList
            notes={filteredNotes ?? []}
            goalId={goalId}
            observerRef={observerRef}
            hasNextPage={hasNextPage}
          />
        </div>
      </>
    );
}
