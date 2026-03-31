import type { Todo } from '@/api/todos';

import { cn } from '@/lib';

type CalendarTodo = Pick<Todo, 'id' | 'title' | 'dueDate' | 'done'>;

interface CalendarScheduleListProps {
  date: string;
  todos: CalendarTodo[];
}

export default function CalendarScheduleList({ date, todos }: CalendarScheduleListProps) {
  return (
    <div className="flex h-fit flex-col gap-4 px-4 py-5 md:h-69 lg:hidden">
      <h2 className="font-sm-semibold shrink-0">{date}</h2>
      <div className="flex min-h-0 flex-1 flex-col space-y-[6px] overflow-y-scroll">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              'font-xs-semibold shrink-0 truncate rounded-[6px] border px-2 py-1',
              todo.done
                ? 'border-gray-300 bg-gray-50 text-gray-400'
                : 'border-orange-300 bg-orange-100 text-orange-600',
            )}
          >
            {todo.done ? '✓ ' : ''}
            {todo.title}
          </div>
        ))}
      </div>
    </div>
  );
}
