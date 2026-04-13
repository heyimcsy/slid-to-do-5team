import type {
  CalendarScheduleListProps,
  CalendarTodoForSchedule,
} from '@/app/(routers)/calendar/types';

import { CALENDAR_TEXT } from '@/app/(routers)/calendar/constants';
import { cn } from '@/lib';

export default function CalendarScheduleList({ date, todos }: CalendarScheduleListProps) {
  return (
    <div className="flex h-fit flex-col gap-4 px-4 py-5 md:h-fit md:max-h-69 lg:hidden">
      <h2 className="font-sm-semibold shrink-0">{date}</h2>
      <div className="flex min-h-0 flex-1 flex-col space-y-[6px] overflow-y-scroll pb-6">
        {todos.length === 0 && (
          <p className="font-xs-medium text-gray-400">{CALENDAR_TEXT.EMPTY_TODO}</p>
        )}
        {todos.map((todo: CalendarTodoForSchedule) => (
          <div
            key={todo.id}
            className={cn(
              'font-xs-semibold shrink-0 truncate rounded-[6px] border px-2 py-1',
              todo.done
                ? 'border-gray-300 bg-gray-50 text-gray-400'
                : 'border-orange-300 bg-orange-100 text-orange-600',
            )}
          >
            {todo.done ? CALENDAR_TEXT.CHECK : ''}
            {todo.title}
          </div>
        ))}
      </div>
    </div>
  );
}
