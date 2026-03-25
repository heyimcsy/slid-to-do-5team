import type { TodoListProps } from '@/app/(routers)/(todo)/goals/types';

import Link from 'next/link';
import ItemActionBar from '@/app/(routers)/(todo)/goals/[goalId]/_components/ItemActionBar';
import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';

export default function TodoList({ id, content, done, link, noteIds, favorites }: TodoListProps) {
  const goalId = 1;
  return (
    <div
      className={cn(
        'group hover:bg-orange-alpha-20 hover:rounded-[12px]',
        'flex h-9 min-h-9 w-full items-center justify-between space-x-[6px] px-1 md:h-11 md:px-2',
      )}
    >
      <div className="flex w-full min-w-0 items-center space-x-1 md:space-x-2">
        <Icon name="checkBox" size={18} className="shrink-0" checked={done} />
        <Link
          href={`/goals/${goalId}/todos/${id}`}
          className="flex min-w-0 flex-1 items-center space-x-1 md:space-x-2"
        >
          <p
            className={cn(
              'font-sm-regular md:font-base-regular lg:font-lg-regular cursor-pointer truncate',
              done ? 'text-gray-500' : 'text-gray-800',
              'hover:font-sm-semibold hover:md:font-base-semibold hover:lg:font-lg-semibold hover:truncate hover:text-orange-500',
            )}
          >
            {content}
          </p>
        </Link>
      </div>
      <ItemActionBar noteIds={noteIds} link={link} favorites={favorites} />
    </div>
  );
}
