import type { CalendarGridProps } from '@/app/(routers)/calendar/types';

import { CALENDAR_TEXT, DAY_LABELS } from '@/app/(routers)/calendar/constants';
import { cn } from '@/lib';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export default function CalendarGrid({
  cells,
  totalCells,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  return (
    <div className="flex h-[530px] flex-col lg:h-202">
      <div className="grid h-8 shrink-0 grid-cols-7">
        {DAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={cn(
              'font-xs-medium border border-gray-100 py-2 text-center text-xs',
              i === 0 ? 'text-orange-500' : 'text-gray-500',
            )}
          >
            {label}
          </div>
        ))}
      </div>
      <div
        className="grid flex-1 grid-cols-7"
        style={{ gridTemplateRows: `repeat(${totalCells / 7}, 1fr)` }}
      >
        {cells.map(({ day, dateStr, isOther, isToday, dow, dayTodos }, i) => (
          <div
            key={dateStr + i}
            className={cn(
              'overflow-hidden border-t border-r border-gray-100',
              '[&:nth-child(7n)]:border-r-0',
              isOther && 'bg-gray-50/50',
            )}
          >
            <button
              type="button"
              className="flex h-full w-full flex-col overflow-hidden p-1.5"
              onClick={() => onSelectDate(dateStr)}
            >
              <span
                className={cn(
                  'font-xs-semibold mb-1 inline-flex h-6 w-6 items-center justify-center',
                  !isToday && !isOther && dow === 0 && 'text-orange-500',
                  !isToday && !isOther && dow === 6 && 'text-gray-500',
                  !isToday && !isOther && dow !== 0 && dow !== 6 && 'text-gray-600',
                  isToday && selectedDate !== dateStr && 'rounded-full bg-gray-200 text-gray-700',
                  selectedDate === dateStr && 'rounded-full bg-orange-500 text-white',
                )}
              >
                {day}
              </span>
              {/* mobile - dot */}
              <div className="flex flex-col items-start space-y-1 lg:hidden">
                <div className="flex space-x-1">
                  {dayTodos.slice(0, 3).map((todo) => (
                    <div
                      key={todo.id}
                      className={cn(
                        'size-2 rounded-[4px]',
                        todo.done ? 'bg-gray-400' : 'bg-orange-500',
                      )}
                    />
                  ))}
                </div>
                {dayTodos.length > 3 && (
                  <span className="font-xs-semibold text-gray-400">
                    +{dayTodos.length - 3}
                    {CALENDAR_TEXT.COUNT}
                  </span>
                )}
              </div>
              {/* desktop - 할일 목록 */}
              <div className="hidden flex-col space-y-1 text-left lg:flex">
                {dayTodos.slice(0, 3).map((todo) => (
                  <div
                    key={todo.id}
                    className={cn(
                      'font-xs-semibold truncate rounded-[6px] border px-2 py-1 text-left',
                      todo.done
                        ? 'border-gray-300 bg-gray-50 text-gray-400'
                        : 'border-orange-300 bg-orange-100 text-orange-600',
                    )}
                  >
                    {todo.done ? CALENDAR_TEXT.CHECK : ''}
                    {todo.title}
                  </div>
                ))}
                {dayTodos.length > 3 && (
                  <HoverCard>
                    <HoverCardTrigger>
                      <span className="font-xs-semibold cursor-pointer px-1 text-left text-gray-400 hover:text-gray-600">
                        {CALENDAR_TEXT.PLUS}
                        {dayTodos.length - 3}
                        {CALENDAR_TEXT.COUNT}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-60 p-2">
                      <div className="flex flex-col space-y-1">
                        {dayTodos.slice(3).map((todo) => (
                          <div
                            key={todo.id}
                            className={cn(
                              'font-xs-semibold truncate rounded-[6px] border px-2 py-1',
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
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
