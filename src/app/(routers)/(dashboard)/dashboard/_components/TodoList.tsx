'use client';

import type { TodoListProps } from '@/app/(routers)/(todo)/goals/types';

import Link from 'next/link';
import { usePatchTodos } from '@/api/todos';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';

import ItemActionBar from './ItemActionBar';

/**
 * @description variant 값에 따라 스타일을 적용합니다.
 * - recent: 최근 등록한 할 일 리스트
 * - completed: 완료된 할 일 리스트
 * - pending: 할 일 리스트
 */
interface TodoListPropsWithVairant extends TodoListProps {
  variant: 'recent' | 'completed' | 'pending';
}

export default function TodoList({
  id,
  goalId,
  done,
  title,
  noteIds,
  linkUrl,
  isFavorite,
  variant,
}: TodoListPropsWithVairant) {
  /**
   * @description variant 값에 따라 스타일을 다르게 적용합니다
   */
  const variantStyle = {
    recent: {
      container: 'bg-transparent text-white dark:text-black dark:bg-orange-300',
    },
    completed: {
      container: 'bg-gray-100 text-black dark:bg-gray-300 dark:text-black',
    },
    pending: {
      container: 'bg-orange-100 hover:bg-orange-300 text-black dark:bg-orange-300 dark:text-black',
    },
  };
  const { mutate: checkTodo } = usePatchTodos();
  const checkButton = useDebouncedCallback(() => {
    checkTodo({ id: id, done: !done });
  }, 1000);
  return (
    <div
      className={cn(
        'group rounded-[12px] duration-300 hover:bg-orange-600 dark:hover:bg-orange-400',
        'flex h-10 min-h-10 w-full items-center justify-between space-x-[6px] px-1 md:h-10 md:min-h-10 md:px-2 lg:h-12 lg:min-h-12',
        variantStyle[variant].container,
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
              'hover:font-sm-semibold hover:md:font-base-semibold hover:lg:font-lg-semibold hover:truncate',
              done && variant === 'recent' ? 'line-through' : '',
              done && variant === 'completed' ? 'text-gray-500 line-through dark:text-black' : '',
            )}
          >
            {title}
          </p>
        </Link>
      </div>
      <ItemActionBar
        id={id}
        goalId={goalId}
        noteIds={noteIds}
        linkUrl={linkUrl}
        favorites={isFavorite}
        variant={variant}
      />
    </div>
  );
}
