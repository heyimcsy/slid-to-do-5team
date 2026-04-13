import Link from 'next/link';
import { CALENDAR_TEXT } from '@/app/(routers)/calendar/constants';
import { cn } from '@/lib';

import { ROUTES } from '@/constants/routes';

import { Icon } from '@/components/icon/Icon';
import { IconButton } from '@/components/ui/button';

export default function NewTodoButton({ width = 'w-full' }: { width?: string }) {
  return (
    <Link href={ROUTES.TODO_NEW} className={cn('flex h-fit', width)}>
      <IconButton variant="outline" className="w-full">
        <Icon name="plus" variant="orange" />
        {CALENDAR_TEXT.ADD_TODO}
      </IconButton>
    </Link>
  );
}
