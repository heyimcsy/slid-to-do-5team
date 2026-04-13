import type { Todo } from '@/api/todos';

export interface CalendarHeadProps {
  y: number;
  m: number;
  prevYear: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  nextYear: () => void;
  findToday: () => void;
  selectValue: { label: string; value: number }[];
  selectedGoalId: number;
  onGoalChange: (goalId: number) => void;
  totalCount: number;
  oldestDueDate: string | null;
  newestDueDate: string | null;
}

export interface CalendarGridProps {
  cells: Cell[];
  totalCells: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export interface CalendarScheduleListProps {
  date: string;
  todos: CalendarTodo[];
}

export type CalendarTodo = Pick<Todo, 'id' | 'title' | 'dueDate' | 'done'>;
export type CalendarTodoForSchedule = Pick<Todo, 'id' | 'title' | 'dueDate' | 'done'>;

export interface Cell {
  day: number;
  dateStr: string;
  isOther: boolean;
  isToday: boolean;
  dow: number;
  dayTodos: CalendarTodo[];
}
