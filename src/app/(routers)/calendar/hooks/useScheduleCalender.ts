import type { Todo } from '@/api/todos';

import { useState } from 'react';

type CalendarTodo = Pick<Todo, 'id' | 'title' | 'dueDate' | 'done'>;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function toDateStr(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export function useScheduleCalendar(todos: CalendarTodo[] = []) {
  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const [current, setCurrent] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const y = current.getFullYear();
  const m = current.getMonth();

  const firstDay = new Date(y, m, 1).getDay();
  const lastDate = new Date(y, m + 1, 0).getDate();
  const prevLastDate = new Date(y, m, 0).getDate();
  const totalCells = Math.ceil((firstDay + lastDate) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    let day: number;
    let dateStr: string;
    let isOther = false;

    if (i < firstDay) {
      day = prevLastDate - firstDay + i + 1;
      dateStr = toDateStr(m === 0 ? y - 1 : y, m === 0 ? 11 : m - 1, day);
      isOther = true;
    } else if (i >= firstDay + lastDate) {
      day = i - firstDay - lastDate + 1;
      dateStr = toDateStr(m === 11 ? y + 1 : y, m === 11 ? 0 : m + 1, day);
      isOther = true;
    } else {
      day = i - firstDay + 1;
      dateStr = toDateStr(y, m, day);
    }

    const dow = i % 7;
    const isToday = dateStr === todayStr;
    const dayTodos = todos.filter((t) => t.dueDate?.startsWith(dateStr));

    return { day, dateStr, isOther, isToday, dow, dayTodos };
  });

  const selectedSchedule = {
    date: selectedDate,
    todos: todos.filter((t) => t.dueDate?.startsWith(selectedDate)),
  };

  return {
    y,
    m,
    cells,
    totalCells,
    todayStr,
    selectedDate,
    setSelectedDate,
    selectedSchedule,
    prevMonth: () => setCurrent(new Date(y, m - 1, 1)),
    nextMonth: () => setCurrent(new Date(y, m + 1, 1)),
    prevYear: () => setCurrent(new Date(y - 1, m, 1)),
    nextYear: () => setCurrent(new Date(y + 1, m, 1)),
    findToday: () => setCurrent(today),
  };
}
