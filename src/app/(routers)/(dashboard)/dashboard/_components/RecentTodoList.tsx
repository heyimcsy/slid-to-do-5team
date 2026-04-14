'use client';

import type { TodoListProps } from '@/app/(routers)/(todo)/goals/types';

import Link from 'next/link';
import { usePatchTodos } from '@/api/todos';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';

import RecentItemActionBar from './RecentItemActionBar';

export default function RecentTodoList({
  id,
  goalId,
  done,
  title,
  noteIds,
  linkUrl,
  favorites,
}: TodoListProps) {
  const { mutate: checkTodo } = usePatchTodos();
  const checkButton = useDebouncedCallback(() => {
    checkTodo({ id: id, done: !done });
  }, 1000);
  return (
    <div
      className={cn(
        'group rounded-[12px] duration-300 hover:bg-orange-600 dark:hover:bg-orange-400',
        'flex h-10 min-h-10 w-full items-center justify-between space-x-[6px] px-1 md:h-10 md:min-h-10 md:px-2 lg:h-12 lg:min-h-12',
      )}
    >
      <div className="flex w-full min-w-0 items-center space-x-1 md:space-x-2">
        <Button variant="icon" size="none" onClick={checkButton}>
          <Icon name="checkBox" size={18} variant="ghost" className="shrink-0" checked={done} />
        </Button>

        <Link
          href={`/goals/${goalId}/todos/${id}`}
          className="flex min-w-0 flex-1 items-center space-x-1 md:space-x-2"
        >
          <p
            className={cn(
              'font-sm-regular md:font-base-regular lg:font-lg-regular cursor-pointer truncate',
              done ? 'text-gray-100 line-through dark:text-black' : 'text-white dark:text-black',
              'hover:font-sm-semibold hover:md:font-base-semibold hover:lg:font-lg-semibold hover:truncate',
            )}
          >
            {title}
          </p>
        </Link>
      </div>
      <RecentItemActionBar
        id={id}
        goalId={goalId}
        noteIds={noteIds}
        linkUrl={linkUrl}
        favorites={favorites}
      />
    </div>
  );
}
