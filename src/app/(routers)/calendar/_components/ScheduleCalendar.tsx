'use client';

import type { Todo } from '@/api/todos';

import CalendarGrid from '@/app/(routers)/calendar/_components/CalenderGrid';
import CalendarHeader from '@/app/(routers)/calendar/_components/CalenderHead';
import CalendarScheduleList from '@/app/(routers)/calendar/_components/CalenderScheduleList';
import { useScheduleCalendar } from '@/app/(routers)/calendar/hooks/useScheduleCalender';

interface CalendarProps {
  todos?: Pick<Todo, 'id' | 'title' | 'dueDate' | 'done'>[];
}

export default function ScheduleCalendar({ todos = [] }: CalendarProps) {
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

  return (
    <div className="h-fit w-full rounded-[24px] bg-white lg:h-228">
      <CalendarHeader
        y={y}
        m={m}
        prevYear={prevYear}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        nextYear={nextYear}
        findToday={findToday}
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
