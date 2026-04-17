'use client';

import type { TodoListProps } from '@/app/(routers)/(todo)/goals/types';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePatchTodos } from '@/api/todos';
import { ItemActionBar } from '@/app/(routers)/(todo)/goals/[goalId]/_components/index';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';

import { ROUTES } from '@/constants/routes';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';

export default function TodoList({
  goalId,
  id,
  done,
  title,
  noteIds,
  linkUrl,
  isFavorite,
}: TodoListProps) {
  const { mutate: checkTodo } = usePatchTodos();
  const [localCheckTodo, setLocalCheckTodo] = useState<boolean>(done);

  const debouncedCheckButton = useDebouncedCallback((next: boolean) => {
    checkTodo(
      { id: id, done: next },
      {
        onError: () => setLocalCheckTodo(done),
      },
    );
  }, 300);

  const handleCheckButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !done;
    setLocalCheckTodo(next);
    debouncedCheckButton(next);
  };

  return (
    <div
      className={cn(
        'group hover:bg-orange-alpha-20 hover:rounded-[12px]',
        'flex h-9 min-h-9 w-full items-center justify-between space-x-[6px] px-1 md:h-11 md:min-h-11 md:px-2',
      )}
    >
      <div className="flex w-full min-w-0 items-center space-x-1 md:space-x-2">
        <Button variant="icon" size="none" onClick={handleCheckButton}>
          <Icon name="checkBox" size={18} className="shrink-0" checked={localCheckTodo} />
        </Button>

        <Link
          href={ROUTES.TODO_DETAIL(goalId, id)}
          className="flex min-w-0 flex-1 items-center space-x-1 md:space-x-2"
        >
          <p
            className={cn(
              'font-sm-regular md:font-base-regular lg:font-lg-regular cursor-pointer truncate',
              done ? 'text-gray-500' : 'text-gray-800',
              'hover:font-sm-semibold hover:md:font-base-semibold hover:lg:font-lg-semibold hover:truncate hover:text-orange-500',
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
        isFavorite={isFavorite}
      />
    </div>
  );
}
