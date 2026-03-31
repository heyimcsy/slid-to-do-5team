'use client';

import type { Todo } from '@/api/todos';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetGoals } from '@/api/goals';
import { useGetTodos } from '@/api/todos';
import {
  CalendarGrid,
  CalendarHead,
  CalendarScheduleList,
  ScheduleCalendarSkeleton,
} from '@/app/(routers)/calendar/_components/index';
import { useScheduleCalendar } from '@/app/(routers)/calendar/hooks/useScheduleCalendar';

export default function ScheduleCalendar() {
  const searchParams = useSearchParams();
  const goalId: number = Number(searchParams.get('goalId'));

  const [selectedGoalId, setSelectedGoalId] = useState<number>(goalId);

  const { data: goalsData, isLoading: goalsLoading } = useGetGoals({});
  const needMore: undefined | boolean = goalsData && goalsData.goals.length < goalsData.totalCount;
  const { data: allGoalsData } = useGetGoals({
    limit: goalsData?.totalCount,
    enabled: !!needMore,
  });

  const { data: getAllTodos, isLoading: todosLoading } = useGetTodos({
    goalId: selectedGoalId === 0 ? undefined : selectedGoalId,
    limit: 100,
  });
  const isLoading = goalsLoading || todosLoading || (needMore && !allGoalsData);
  const todos: Pick<Todo, 'id' | 'title' | 'dueDate' | 'done'>[] =
    getAllTodos?.todos.map((todo) => {
      return {
        id: todo.id,
        title: todo.title,
        done: todo.done,
        dueDate: todo.dueDate,
      };
    }) ?? [];

  const allGoals = useMemo(() => {
    const source = needMore ? allGoalsData?.goals : goalsData?.goals;
    if (!source) return [{ label: '전체 목표', value: 0 }];
    return [
      { label: '전체 목표', value: 0 },
      ...source.map((goal) => ({ label: goal.title, value: goal.id })),
    ];
  }, [goalsData, allGoalsData, needMore]);

  const {
    y,
    m,
    cells,
    totalCells,
    selectedDate,
    setSelectedDate,
    selectedSchedule,
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
    findToday,
  } = useScheduleCalendar(todos);

  const onGoalChange = (value: number) => {
    setSelectedGoalId(value);
  };
  if (isLoading) return <ScheduleCalendarSkeleton />;
  return (
    <div className="h-full w-full bg-white md:h-fit md:rounded-[24px] lg:h-228">
      <CalendarHead
        y={y}
        m={m}
        prevYear={prevYear}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        nextYear={nextYear}
        findToday={findToday}
        selectValue={allGoals}
        selectedGoalId={selectedGoalId}
        onGoalChange={onGoalChange}
      />
      <CalendarGrid
        cells={cells}
        totalCells={totalCells}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <CalendarScheduleList date={selectedSchedule.date} todos={selectedSchedule.todos} />
    </div>
  );
}
