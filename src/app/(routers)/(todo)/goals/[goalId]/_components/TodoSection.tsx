import type { TodoWithFavorites } from '@/api/todos';
import type { TodoSectionProps } from '@/app/(routers)/(todo)/goals/types';

import Image from 'next/image';
import Link from 'next/link';
import TodoList from '@/app/(routers)/(todo)/goals/[goalId]/_components/TodoList';
import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';
import { IconButton } from '@/components/ui/button';

export function TodoSection({
  goalId,
  title,
  todos,
  bgColor,
  emptyImage,
  emptyText,
  showActions,
}: TodoSectionProps) {
  return (
    <div className="flex h-fit w-full min-w-0 flex-col space-y-[10px]">
      <div className="flex h-fit w-full items-center justify-between px-2 lg:h-10">
        <h3 className="font-base-semibold text-gray-800">{title}</h3>
        {showActions && (
          <div className="flex space-x-2">
            <Link className="h-fit w-fit" href={`/calendar?goalId=${goalId}`}>
              <IconButton variant="ghost" className="h-10">
                <Icon name="schedule" size={20} />
                <span>캘린더 보기</span>
              </IconButton>
            </Link>
            <Link className="h-fit w-fit" href="/goals/todos/new">
              <IconButton variant="default" className="h-10">
                <Icon name="plus" />
                <span>할 일 추가</span>
              </IconButton>
            </Link>
          </div>
        )}
      </div>
      <div className={cn('h-49 w-full rounded-[28px] px-4 py-5 md:h-80 lg:h-144', bgColor)}>
        <div
          className={cn(
            'flex h-full w-full flex-col overflow-scroll',
            todos.length === 0 && 'justify-center',
          )}
        >
          {todos.length > 0 ? (
            todos.map((todo: TodoWithFavorites) => (
              <TodoList
                key={todo.id}
                goalId={goalId}
                id={todo.id}
                done={todo.done}
                title={todo.title}
                noteIds={todo.noteIds}
                linkUrl={todo.linkUrl}
                favorites={todo.favorites}
              />
            ))
          ) : (
            <div className="flex flex-col items-center space-y-2.5">
              <Image
                width={131}
                height={140}
                src={emptyImage}
                alt="describe empty situation"
                className="h-22.5 w-20 object-contain md:h-35 md:w-32.5"
              />
              <p className="font-sm-regular md:font-base-regular text-gray-500">{emptyText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
