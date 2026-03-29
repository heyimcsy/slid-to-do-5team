'use client';

import type { Task } from '../types';

import { useState } from 'react';
import { useDeleteTodos, usePatchTodos } from '@/api/todos';
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
  const { mutate: patchTodo } = usePatchTodos();
  const { mutate: deleteTodo } = useDeleteTodos();

  const handleToggle = () => {
    patchTodo({
      id: task.id,
      done: !task.done,
    });
  };

  const handleDelete = () => {
    deleteTodo({ id: task.id });
  };

  return (
    <ul>
      <li
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'flex cursor-pointer items-center justify-between gap-2 rounded-2xl px-2 py-2 transition-colors duration-150 hover:bg-[var(--orange-alpha-20)] md:px-4 md:py-3 lg:px-8',
        )}
      >
        {/* 체크박스 */}
        <button onClick={handleToggle} className="shrink-0 cursor-pointer">
          {task.done ? (
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
              task.done && 'text-orange-500',
            )}
          >
            {task.title}
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
                      <DropdownMenuItem onClick={handleDelete}>삭제하기</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            <Icon name="outlineStar" />
          </div>
        </div>
      </li>
    </ul>
  );
}
