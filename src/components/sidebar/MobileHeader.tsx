'use client';

import { usePathname } from 'next/navigation';
import { useGetTodos } from '@/api/todos';

import AlertPopover from '../AlertPopover';
import { SidebarTrigger } from '../ui/sidebar';

const navItems = [
  { label: '캘린더', href: '/calendar' },
  { label: '모든 할 일', href: '/dashboard/todos' },
];

export default function MobileHeader() {
  const pathname = usePathname();
  const { data } = useGetTodos({ limit: 40 });
  const currentPage = navItems.find((item) => item.href === pathname);
  const todoCount = data?.totalCount ?? 0;
  console.log(data?.totalCount);
  return (
    <header className="flex items-center justify-between gap-3 px-5 py-3 md:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="font-lg-semibold">{`${currentPage?.label ?? ''}`}</span>
        <span className="font-base-semibold mt-0.5 items-center text-orange-600">{todoCount}</span>
      </div>
      <AlertPopover />
    </header>
  );
}
