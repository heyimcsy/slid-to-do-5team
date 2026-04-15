'use client';

import type { Goal } from '@/api/goals';

import { useState } from 'react';
import Image from 'next/image';
import { useInfiniteGoals } from '@/api/goals';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { SEARCH_DEBOUNCE_MS } from '@/constants/query';

import { GoalCreateModal } from '@/components/common/GoalCreateModal';
import { ErrorFallback } from '@/components/ErrorFallback';
import { FlagLineIcon } from '@/components/icon/icons/FlagLine';
import { IconButton } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { GOALS_PAGE_SIZE } from '../_constants/goals';
import { GoalsContainer } from './GoalsContainer';
import { GoalSectionHeader } from './GoalSectionHeader';
import { TodoContainer } from './TodoContainer';

type GoalListItem = Pick<Goal, 'id' | 'title' | 'completedCount' | 'todoCount'>;

function GoalTodosRow({ goal }: { goal: GoalListItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const progress =
    goal.todoCount === 0 ? 0 : Math.round((goal.completedCount / goal.todoCount) * 100);

  return (
    <GoalsContainer>
      <GoalSectionHeader
        goalId={goal.id}
        title={goal.title}
        progress={progress}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <TodoContainer goalId={goal.id} searchQuery={debouncedSearch} />
    </GoalsContainer>
  );
}

function GoalRowTodoColumnsSkeleton() {
  const row = (key: number) => (
    <div
      key={key}
      className="flex h-10 min-h-10 w-full items-center gap-2 px-1 md:px-2 lg:h-12 lg:min-h-12"
    >
      <Skeleton variant="gray" className="size-[18px] shrink-0 rounded-md md:size-5" />
      <Skeleton variant="gray" className="h-4 flex-1 rounded-md" />
      <div className="ml-auto flex gap-1">
        <Skeleton variant="gray" className="size-5 shrink-0 rounded-md" />
        <Skeleton variant="gray" className="size-5 shrink-0 rounded-md" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-x-8 gap-y-2 md:flex-row md:gap-2 lg:flex-row lg:gap-8">
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-orange-100 p-4 md:p-4 lg:p-6 dark:bg-orange-300 dark:text-black">
        <Skeleton variant="gray" className="mb-4 h-7 w-14 shrink-0 rounded-lg" />
        <div className="flex max-h-40 flex-col gap-3 overflow-hidden">{[0, 1, 2].map(row)}</div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl p-4 md:p-4 lg:p-6">
        <Skeleton variant="gray" className="mb-4 h-7 w-12 shrink-0 rounded-lg" />
        <div className="flex max-h-40 flex-col gap-3 overflow-hidden">{[3, 4, 5].map(row)}</div>
      </div>
    </div>
  );
}

function TodosByGoalSectionSkeleton() {
  return (
    <section className="todos-by-goal-section-container mt-8 flex w-full md:mt-10 lg:mt-10">
      <div className="todos-by-goal-section flex w-full flex-col gap-4">
        <div className="todos-by-goal-section-header flex justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton variant="gray" className="size-8 shrink-0 rounded-xl md:size-8 lg:size-10" />
            <Skeleton variant="gray" className="h-7 w-40 rounded-xl" />
          </div>
          <Skeleton variant="gray" className="h-10 w-36 shrink-0 rounded-xl md:w-40" />
        </div>
        <section className="todos-by-goal-section flex w-full flex-col gap-6 pb-6 md:pb-6 lg:pb-8">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="goals-container w-full rounded-[1.75rem] bg-white px-4 py-4.5 text-black md:min-h-46.5 md:rounded-[1.75rem] md:px-4 md:py-4.5 lg:rounded-[2.5rem] lg:px-8 lg:py-6"
            >
              <div className="goal-section-header grid w-full grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-4 px-2 pb-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-4">
                <Skeleton
                  variant="gray"
                  className="col-span-2 h-8 max-w-md rounded-lg md:col-span-1"
                />
                <Skeleton
                  variant="gray"
                  className="col-span-2 h-10 w-full rounded-lg md:col-span-1 md:w-52.5"
                />
                <Skeleton
                  variant="gray"
                  className="col-start-2 row-start-1 h-10 w-10 shrink-0 rounded-full md:col-start-3 md:row-start-1"
                />
              </div>
              <GoalRowTodoColumnsSkeleton />
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}

export function TodosByGoalSection() {
  const [isGoalCreateModalOpen, setIsGoalCreateModalOpen] = useState(false);
  const {
    data: goalsInfinite,
    isLoading: goalsLoading,
    isError: goalsIsError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteGoals({ limit: GOALS_PAGE_SIZE });

  const { observerRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  });

  const goalsList = goalsInfinite?.pages.flatMap((page) => page.goals) ?? [];

  if (goalsLoading) {
    return <TodosByGoalSectionSkeleton />;
  }

  if (goalsIsError) {
    return (
      <section className="todos-by-goal-section-container mt-8 flex w-full md:mt-10 lg:mt-10">
        <ErrorFallback variant="embedded" onRetry={() => void refetch()} />
      </section>
    );
  }

  const handleNewGoal = () => {
    setIsGoalCreateModalOpen(true);
  };

  return (
    <section className="todos-by-goal-section-container mt-8 flex w-full md:mt-10 lg:mt-10">
      <div className="todos-by-goal-section flex w-full flex-col gap-4">
        <div className="todos-by-goal-section-header flex justify-between">
          <section className="flex items-center">
            <h2 className="flex items-center justify-between gap-2">
              <Image
                src="/images/img-goal.svg"
                alt="할 일 아이콘"
                aria-hidden
                width={40}
                height={40}
                className="size-8 md:size-8 lg:size-10"
              />
              <span className="font-base-medium md:font-base-medium lg:font-lg-medium">
                목표 별 할 일
              </span>
            </h2>
          </section>
          <section className="flex items-center">
            <IconButton variant="ghost" size="sm" type="button" onClick={handleNewGoal}>
              <FlagLineIcon variant="orange" />
              <span className="font-sm-semibold md:font-sm-semibold lg:font-base-semibold">
                새 목표 추가
              </span>
            </IconButton>
          </section>
        </div>
        <section className="todos-by-goal-section flex w-full flex-col gap-6 pb-6 md:pb-6 lg:pb-8">
          {goalsList.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-y-4.5 py-4.25">
              <Image
                src="/images/big-zero-done.svg"
                alt="최근에 등록한 목표 없음"
                width={130}
                height={140}
                className="h-21.25 w-20 object-contain md:h-35 md:w-32.5 lg:h-35 lg:w-32.5"
              />
              <span className="font-sm-medium md:font-base-medium lg:font-base-medium text-gray-500">
                최근에 등록한 목표가 없어요
              </span>
            </div>
          ) : (
            <>
              {goalsList.map((goal) => (
                <GoalTodosRow key={goal.id} goal={goal} />
              ))}
              {hasNextPage ? (
                <div
                  ref={observerRef}
                  className="flex min-h-8 w-full justify-center py-2"
                  aria-hidden
                >
                  {isFetchingNextPage ? (
                    <span className="font-sm-medium text-gray-500">목표를 불러오는 중…</span>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
      <GoalCreateModal
        isOpen={isGoalCreateModalOpen}
        onClose={() => setIsGoalCreateModalOpen(false)}
      />
    </section>
  );
}
