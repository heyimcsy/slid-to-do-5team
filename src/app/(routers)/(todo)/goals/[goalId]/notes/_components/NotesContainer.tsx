'use client';

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { useState } from 'react';
import Image from 'next/image';
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import goalImage from '@/../public/images/large-goal.svg';
import { useGetGoal } from '@/api/goals';
import { useGetNotesInfinite } from '@/api/notes';
import { GOAL_IMAGE_BIG, NOTES_SORT, NOTES_TEXT } from '@/app/(routers)/(todo)/constants';
import {
  NoteContainerSkeleton,
  NoteList,
} from '@/app/(routers)/(todo)/goals/[goalId]/notes/_components';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { SearchInput } from '@/components/common/SearchInput';
import { SortFilter } from '@/components/common/SortFilter';
import { ErrorFallback } from '@/components/ErrorFallback';

export default function NotesContainer() {
  const pathname: string = usePathname();
  const router: AppRouterInstance = useRouter();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const goalId: number = Number(pathname.split('/')[2]);
  const sortFromUrl: string | null = searchParams.get('sort');

  const [searchValue, setSearchValue] = useState<string>('');
  const sortValue =
    sortFromUrl === NOTES_SORT.OLD.LABEL ? NOTES_SORT.OLD.LABEL : NOTES_SORT.UPDATE.LABEL;
  const sortParam =
    sortValue === NOTES_SORT.OLD.LABEL ? NOTES_SORT.OLD.VALUE : NOTES_SORT.UPDATE.VALUE;

  const debouncedSearch = useDebouncedValue(searchValue, 300);
  const { data: goalData } = useGetGoal({ id: goalId });
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetNotesInfinite({
    goalId,
    sort: sortParam,
    search: debouncedSearch,
  });

  const allNotes = data?.pages.flatMap((page) => page.notes) ?? [];

  const { observerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === NOTES_SORT.OLD.LABEL) {
      params.set(NOTES_SORT.SORT, NOTES_SORT.OLD.LABEL);
    } else {
      params.delete(NOTES_SORT.SORT);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  if (isLoading) return <NoteContainerSkeleton />;
  if (isError) return <ErrorFallback onRetry={refetch} title={NOTES_TEXT.GET_NOTES} />;
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
            <SortFilter
              options={[NOTES_SORT.UPDATE.LABEL, NOTES_SORT.OLD.LABEL]}
              value={sortValue}
              onChange={handleSortChange}
            />
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
        <div className="mt-4 pb-6 md:mt-6 md:pb-10">
          <NoteList
            notes={allNotes}
            goalId={goalId}
            observerRef={observerRef}
            hasNextPage={hasNextPage}
          />
        </div>
      </>
    );
}
