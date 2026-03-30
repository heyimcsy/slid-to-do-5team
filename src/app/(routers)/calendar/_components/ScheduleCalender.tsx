'use client';

import type { Todo } from '@/api/todos';

import {
  CalenderGrid,
  CalenderHead,
  CalenderScheduleList,
} from '@/app/(routers)/calendar/_components/index';
import { useScheduleCalendar } from '@/app/(routers)/calendar/hooks/useScheduleCalender';

interface CalenderProps {
  todos?: Pick<Todo, 'id' | 'title' | 'dueDate' | 'done'>[];
}

export default function ScheduleCalender({ todos = [] }: CalenderProps) {
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
      <CalenderHead
        y={y}
        m={m}
        prevYear={prevYear}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        nextYear={nextYear}
        findToday={findToday}
      />
      <CalenderGrid
        cells={cells}
        totalCells={totalCells}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <CalenderScheduleList date={selectedSchedule.date} todos={selectedSchedule.todos} />
    </div>
  );
}
