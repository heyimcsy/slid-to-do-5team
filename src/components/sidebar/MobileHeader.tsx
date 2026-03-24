'use client';

import { usePathname } from 'next/navigation';

import { Icon } from '../icon/Icon';
import { SidebarTrigger } from '../ui/sidebar';

const navItems = [
  { label: '캘린더', href: '/calendar' },
  { label: '모든 할 일', href: '/dashboard/todos' },
];

export default function MobileHeader() {
  const pathname = usePathname();
  const currentPage = navItems.find((item) => item.href === pathname);
  return (
    <header className="flex items-center justify-between gap-3 px-5 py-3 md:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="font-lg-semibold">{`${currentPage?.label ?? ''}`}</span>
      </div>
      <Icon name="bell" />
    </header>
  );
}
