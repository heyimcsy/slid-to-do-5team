import type { TodoListProps } from '@/app/(routers)/(todo)/goals/types';

import Link from 'next/link';
import ActionButton from '@/app/(routers)/(todo)/goals/_components/ActionButton';
import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';

export default function TodoList({ content, checked, link, note, favorites }: TodoListProps) {
  return (
    <div
      className={cn(
        'group hover:bg-orange-alpha-20 hover:rounded-[12px]',
        'flex h-9 min-h-9 w-full items-center justify-between space-x-[6px] px-1 md:h-11 md:px-2',
      )}
      role="button"
      tabIndex={0}
    >
      <div className="flex w-full min-w-0 items-center space-x-1 md:space-x-2">
        <Icon name="checkBox" size={18} className="shrink-0" checked={checked} />
        <Link href={'/goals/1'} className="flex min-w-0 flex-1 items-center space-x-1 md:space-x-2">
          <p
            className={cn(
              'font-sm-regular md:font-base-regular lg:font-lg-regular cursor-pointer truncate',
              checked ? 'text-gray-500' : 'text-gray-800',
              'hover:font-sm-semibold hover:md:font-base-semibold hover:lg:font-lg-semibold hover:truncate hover:text-orange-500',
            )}
          >
            {content}
          </p>
        </Link>
      </div>
      <ActionButton note={note} link={link} favorites={favorites} />
    </div>
  );
}
