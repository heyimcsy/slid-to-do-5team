'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetGoals } from '@/api/goals';
import {
  CalendarGrid,
  CalendarHead,
  CalendarScheduleList,
  ScheduleCalendarSkeleton,
} from '@/app/(routers)/calendar/_components/index';
import { CALENDAR_TEXT } from '@/app/(routers)/calendar/constants';
import { useGetAllTodos } from '@/app/(routers)/calendar/hooks/useGetAllTodos';
import { useScheduleCalendar } from '@/app/(routers)/calendar/hooks/useScheduleCalendar';

import { ROUTES } from '@/constants/routes';

import { ErrorFallback } from '@/components/ErrorFallback';

const goalsLimit = 20;

export default function ScheduleCalendar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const goalId = Number(searchParams.get('goalId'));
  const safeGoalId = isNaN(goalId) || goalId === 0 ? 0 : goalId;

  const [selectedGoalId, setSelectedGoalId] = useState<number>(safeGoalId);

  const {
    data: goalsData,
    isLoading: goalsLoading,
    isError: goalsError,
    refetch: refetchGoals,
  } = useGetGoals({ limit: goalsLimit });
  const needMore = goalsData && goalsLimit < goalsData.totalCount;
  const {
    data: allGoalsData,
    isLoading: allGoalsLoading,
    isError: allGoalsError,
    refetch: allGoalsRefetch,
  } = useGetGoals({
    limit: goalsData?.totalCount,
    enabled: !!needMore,
  });

  const {
    todos,
    totalCount,
    oldestDueDate,
    newestDueDate,
    isLoading: todosLoading,
    isError: todosError,
    refetch: refetchTodo,
  } = useGetAllTodos({ goalId: selectedGoalId });

  const isLoading = goalsLoading || allGoalsLoading || todosLoading || (needMore && !allGoalsData);
  const isError = todosError || goalsError || allGoalsError;
  const refetch = () => {
    if (goalsError || allGoalsError) refetchGoals();
    if (allGoalsError) allGoalsRefetch();
    if (todosError) refetchTodo();
  };
  const allGoals = useMemo(() => {
    const source = needMore ? allGoalsData?.goals : goalsData?.goals;
    if (!source) return [{ label: CALENDAR_TEXT.ALL_GOALS, value: 0 }];
    return [
      { label: CALENDAR_TEXT.ALL_GOALS, value: 0 },
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
    router.replace(ROUTES.CALENDAR(value));
    setSelectedGoalId(value);
    findToday();
  };

  if (isError) return <ErrorFallback onRetry={refetch} title={CALENDAR_TEXT.ERROR_TITLE} />;
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
        totalCount={totalCount}
        oldestDueDate={oldestDueDate}
        newestDueDate={newestDueDate}
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
