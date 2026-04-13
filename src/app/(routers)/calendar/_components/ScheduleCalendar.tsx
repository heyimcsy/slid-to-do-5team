'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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

export default function ScheduleCalendar() {
  const searchParams = useSearchParams();
  const goalId = Number(searchParams.get('goalId'));
  const safeGoalId = isNaN(goalId) || goalId === 0 ? 0 : goalId;

  const [selectedGoalId, setSelectedGoalId] = useState<number>(safeGoalId);

  const { data: goalsData, isLoading: goalsLoading } = useGetGoals({});
  const needMore = goalsData && goalsData.goals.length < goalsData.totalCount;
  const { data: allGoalsData } = useGetGoals({
    limit: goalsData?.totalCount,
    enabled: !!needMore,
  });

  const {
    todos,
    totalCount,
    oldestDueDate,
    newestDueDate,
    isLoading: todosLoading,
  } = useGetAllTodos({ goalId: selectedGoalId });

  const isLoading = goalsLoading || todosLoading || (needMore && !allGoalsData);

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
    setSelectedGoalId(value);
    findToday();
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
