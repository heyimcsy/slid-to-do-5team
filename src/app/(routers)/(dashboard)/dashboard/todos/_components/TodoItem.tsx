import type { Task } from '../types';

import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';

interface TodoItemProps {
  task: Task;
}

export default function TodoItem({ task }: TodoItemProps) {
  return (
    <li
      className={cn(
        'flex items-center justify-between gap-2 rounded-xl px-3 py-3 transition-colors duration-150',
        task.checked && 'bg-orange-50',
      )}
    >
      {/* 체크박스 */}
      <button className="shrink-0">
        <Icon name="checkBox" />
      </button>

      {/* 할일 텍스트 */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-6">
        <span
          className={cn(
            'font-sm-medium min-w-0 flex-1 truncate',
            task.checked && 'text-orange-500',
          )}
        >
          {task.content}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <Icon name="note" variant="orange" />
          <Icon name="link" variant="orange" />
          <Icon name="outlineStar" />
        </div>
      </div>
    </li>
  );
}
