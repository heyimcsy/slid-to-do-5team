'use client';

import type { Goal } from '@/api/goals';
import type { TodoWithFavorites } from '@/api/todos';

import { useState } from 'react';
import Image from 'next/image';
import { useInfiniteGoals } from '@/api/goals';
import { useGetTodos } from '@/api/todos';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { SEARCH_DEBOUNCE_MS } from '@/constants/query';

import { GoalCreateModal } from '@/components/common/GoalCreateModal';
import { FlagLineIcon } from '@/components/icon/icons/FlagLine';
import { IconButton } from '@/components/ui/button';

import { GOALS_PAGE_SIZE } from '../_constants/goals';
import { GoalsContainer } from './GoalsContainer';
import { GoalSectionHeader } from './GoalSectionHeader';
import { TodoContainer } from './TodoContainer';

type GoalListItem = Pick<Goal, 'id' | 'title' | 'completedCount' | 'todoCount'>;

function GoalTodosRow({
  goal,
  todos,
}: {
  goalId: number;
  goal: GoalListItem;
  todos: TodoWithFavorites[];
}) {
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
      <TodoContainer todos={todos} searchQuery={debouncedSearch} />
    </GoalsContainer>
  );
}

export function TodosByGoalSection() {
  const [isGoalCreateModalOpen, setIsGoalCreateModalOpen] = useState(false);
  const { data: todos, isLoading, error } = useGetTodos({ limit: 100 });

  const {
    data: goalsInfinite,
    isLoading: goalsLoading,
    error: goalsError,
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

  if (isLoading || goalsLoading) return <div>로딩중...</div>;
  if (error || !todos || goalsError) return <div>에러</div>;

  const allTodos = todos.todos ?? [];
  const todosByGoalId = Object.groupBy(allTodos, (todo) => todo.goalId);
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
        <section className="todos-by-goal-section flex w-full flex-col gap-6">
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
                <GoalTodosRow
                  key={goal.id}
                  goalId={goal.id}
                  goal={goal}
                  todos={todosByGoalId[goal.id] ?? []}
                />
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
