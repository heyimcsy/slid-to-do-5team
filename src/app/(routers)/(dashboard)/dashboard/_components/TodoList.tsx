'use client';

import type { TodoListProps } from '@/app/(routers)/(todo)/goals/types';
import type { MouseEvent } from 'react';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePatchTodos } from '@/api/todos';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';

import { shouldMarquee } from '../_constants/todos';
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
  const isMdUp = useMediaQuery('(min-width: 768px)');
  const isLgUp = useMediaQuery('(min-width: 1628px)');
  const currentBreakpoint = isLgUp ? 'lg' : isMdUp ? 'md' : 'sm';
  const enableMarquee = shouldMarquee(title, currentBreakpoint);

  /**
   * @description variant 값에 따라 스타일을 다르게 적용합니다
   */
  const variantStyle = {
    recent: {
      container: 'bg-transparent text-white dark:text-black dark:bg-orange-300',
    },
    completed: {
      container:
        'bg-transparent hover:bg-orange-300 text-black dark:bg-transparent dark:hover:bg-orange-300/80 dark:text-black',
    },
    pending: {
      container: 'bg-orange-100 hover:bg-orange-300 text-black dark:bg-orange-300 dark:text-black',
    },
  };
  const { mutate: checkTodo } = usePatchTodos();
  const [localDone, setLocalDone] = useState(done);
  useEffect(() => {
    setLocalDone(done);
  }, [done]);

  const debouncedPatchDone = useDebouncedCallback((nextDone: boolean) => {
    checkTodo({ id, done: nextDone });
  }, 300);

  const handleCheckClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const next = !localDone;
    setLocalDone(next);
    debouncedPatchDone(next);
  };
  return (
    <div
      className={cn(
        'group rounded-[12px] duration-300 hover:bg-orange-600 dark:hover:bg-orange-400',
        'flex h-10 min-h-10 w-full items-center justify-between space-x-[6px] px-1 md:h-10 md:min-h-10 md:px-2 lg:h-12 lg:min-h-12',
        variantStyle[variant].container,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center space-x-1 md:space-x-2">
        <Button variant="icon" size="none" onClick={handleCheckClick}>
          <Icon
            name="checkBox"
            size={18}
            variant="ghost"
            className="shrink-0"
            checked={localDone}
          />
        </Button>

        <Link href={`/goals/${goalId}/todos/${id}`} className="flex min-w-0 flex-1 items-center">
          <div className="min-w-0 flex-1 overflow-hidden">
            <p
              className={cn(
                'font-sm-regular md:font-base-regular lg:font-lg-regular cursor-pointer truncate',
                enableMarquee ? 'group-focus-within:hidden group-hover:hidden' : '',
                localDone && variant === 'recent' ? 'line-through' : '',
                localDone && variant === 'completed'
                  ? 'text-gray-500 line-through dark:text-black'
                  : '',
              )}
            >
              {title}
            </p>

            <div
              className={cn(
                'hidden w-max min-w-full items-center overflow-hidden',
                enableMarquee ? 'group-focus-within:flex group-hover:flex' : '',
              )}
            >
              <div className="animate-todo-marquee flex min-w-max">
                <span
                  className={cn(
                    'font-sm-semibold md:font-base-semibold lg:font-lg-semibold pr-10 whitespace-nowrap',
                    localDone && variant === 'recent' ? 'line-through' : '',
                    localDone && variant === 'completed'
                      ? 'text-gray-500 line-through dark:text-black'
                      : '',
                  )}
                >
                  {title}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'font-sm-semibold md:font-base-semibold lg:font-lg-semibold pr-10 whitespace-nowrap',
                    localDone && variant === 'recent' ? 'line-through' : '',
                    localDone && variant === 'completed'
                      ? 'text-gray-500 line-through dark:text-black'
                      : '',
                  )}
                >
                  {title}
                </span>
              </div>
            </div>
          </div>
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
