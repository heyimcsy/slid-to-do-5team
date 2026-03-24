'use client';

import type { Task } from '../types';

import { useState } from 'react';
import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        'flex cursor-pointer items-center justify-between gap-2 rounded-2xl px-2 py-2 transition-colors duration-150 hover:bg-[var(--orange-alpha-20)] md:px-4 md:py-3 lg:px-8',
      )}
    >
      {/* 체크박스 */}
      <button className="shrink-0 cursor-pointer">
        {task.checked ? (
          <Icon name="checkBox" size={18} checked={true} />
        ) : (
          <Icon name="checkBox" size={18} />
        )}
      </button>

      {/* 할일 텍스트 */}
      <div className="flex min-w-0 flex-1 items-center justify-between">
        <span
          className={cn(
            'font-sm-medium md:font-base-medium min-w-0 flex-1 truncate',
            task.checked && 'text-orange-500',
          )}
        >
          {task.content}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <Icon name="note" variant="orange" />
          <Icon name="link" variant="orange" />
          {hovered && (
            <div className="flex items-center gap-2">
              <Icon name="edit" />
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2">
                    <Icon name="dotscircle" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => console.log('수정', task.id)}>
                      수정하기
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log('삭제', task.id)}>
                      삭제하기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
          <Icon name="outlineStar" />
        </div>
      </div>
    </li>
  );
}
