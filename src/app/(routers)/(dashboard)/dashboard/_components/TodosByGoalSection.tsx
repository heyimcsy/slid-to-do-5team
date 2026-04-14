'use client';

import type { Goal } from '@/api/goals';
import type { TodoWithFavorites } from '@/api/todos';

import { useState } from 'react';
import Image from 'next/image';
import { useGetGoals } from '@/api/goals';
import { useGetTodos } from '@/api/todos';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

import { SEARCH_DEBOUNCE_MS } from '@/constants/query';

import { FlagLineIcon } from '@/components/icon/icons/FlagLine';
import { IconButton } from '@/components/ui/button';

import { GoalsContainer } from './GoalsContainer';
import { GoalSectionHeader } from './GoalSectionHeader';
import { TodoContainer } from './TodoContainer';

type GoalListItem = Pick<Goal, 'id' | 'title' | 'completedCount' | 'todoCount'>;

function GoalTodosRow({ goal, todos }: { goal: GoalListItem; todos: TodoWithFavorites[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const progress =
    goal.todoCount === 0 ? 0 : Math.round((goal.completedCount / goal.todoCount) * 100);

  return (
    <GoalsContainer>
      <GoalSectionHeader
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
  const { data: todos, isLoading, error } = useGetTodos({ limit: 100 });
  // const { data: todosByGoalData } = useGetTodos({ limit: 100 });
  // const todosData = todosByGoalData?.todos ?? [];
  // console.log(todosData);
  // Object.groupBy 메서드를 사용해 목표별로 그룹화
  // const byGoal = Object.groupBy(todosData, (todo) => todo.goalId);

  // 목표 2개 조회(초기 렌더링)
  const { data: goals, isLoading: goalsLoading, error: goalsError } = useGetGoals({ limit: 100 });

  if (isLoading || goalsLoading) return <div>로딩중...</div>;
  if (error || !todos || goalsError || !goals) return <div>에러</div>;

  const allTodos = todos.todos ?? [];
  const todosByGoalId = Object.groupBy(allTodos, (todo) => todo.goalId);

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
            <IconButton variant="ghost" size="sm" type="button">
              <FlagLineIcon variant="orange" />
              <span className="font-sm-semibold md:font-sm-semibold lg:font-base-semibold">
                새 목표 추가
              </span>
            </IconButton>
          </section>
        </div>
        <section className="todos-by-goal-section flex w-full flex-col gap-6">
          {goals.goals.length === 0 ? (
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
            goals.goals.map((goal) => (
              <GoalTodosRow key={goal.id} goal={goal} todos={todosByGoalId[goal.id] ?? []} />
            ))
          )}
        </section>
      </div>
    </section>
  );
}
