import type { TodoListProps } from '@/app/(routers)/(todo)/goals/types';

import React from 'react';
import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';

function ActionButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <Button
      variant="icon"
      size="none"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {children}
    </Button>
  );
}

export default function TodoList({
  content,
  checked,
  link,
  note,
  favorites,
  clicked,
  onClick,
}: TodoListProps) {
  return (
    <div
      className={cn(
        clicked && 'bg-orange-alpha-20 rounded-[12px]',
        'flex h-9 min-h-9 w-full items-center justify-between space-x-[6px] px-1 md:h-11 md:px-2',
      )}
      onClick={onClick}
    >
      <div className="flex w-full min-w-0 items-center space-x-1 md:space-x-2">
        <Icon name="checkBox" size={18} className="shrink-0" checked={checked} />
        <p
          className={cn(
            'font-sm-regular md:font-base-regular lg:font-lg-regular cursor-pointer truncate',
            checked ? 'text-gray-500' : 'text-gray-800',
            clicked &&
              'font-sm-semibold md:font-base-semibold lg:font-lg-semibold truncate text-orange-500',
          )}
        >
          {content}
        </p>
      </div>
      <div className="flex h-fit shrink-0 space-x-[6px] lg:space-x-2">
        {note && (
          <ActionButton>
            <Icon name="note" variant="orange" />
          </ActionButton>
        )}
        {link && (
          <ActionButton>
            <Icon name="link" variant="orange" />
          </ActionButton>
        )}
        {clicked && (
          <ActionButton>
            <Icon name="edit" />
          </ActionButton>
        )}
        {clicked && (
          <ActionButton>
            <Icon name="dotscircle" />
          </ActionButton>
        )}
        <ActionButton>
          <Icon
            name={favorites ? 'filledStar' : 'outlineStar'}
            variant={favorites ? 'orange' : undefined}
          />
        </ActionButton>
      </div>
    </div>
  );
}
