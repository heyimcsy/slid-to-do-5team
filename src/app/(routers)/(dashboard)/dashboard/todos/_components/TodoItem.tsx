'use client';

import type { Task } from '../types';

import { useState } from 'react';
import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';

interface TodoItemProps {
  task: Task;
}

export default function TodoItem({ task }: TodoItemProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'flex cursor-pointer items-center justify-between gap-2 rounded-3xl px-3 py-3 transition-colors duration-150 hover:bg-[var(--orange-alpha-20)]',
      )}
    >
      {/* 체크박스 */}
      <button className="shrink-0 cursor-pointer">
        {task.checked ? <Icon name="checkBox" checked={true} /> : <Icon name="checkBox" />}
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
          {hovered && (
            <>
              <Icon name="edit" />
              <Icon name="dotscircle" />
            </>
          )}
          <Icon name="outlineStar" />
        </div>
      </div>
    </li>
  );
}
