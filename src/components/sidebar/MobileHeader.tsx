'use client';

import { usePathname } from 'next/navigation';
import { useGetTodos } from '@/api/todos';
import { useGetFavorites } from '@/app/(routers)/favorites/_api/favoritesQueries';
import { authUserStore } from '@/stores/authUserStore';

import { getPageTitle } from '@/utils/getPageTitle';

import AlertPopover from '../AlertPopover';
import { SidebarTrigger } from '../ui/sidebar';

export default function MobileHeader() {
  const pathname = usePathname();
  const { data } = useGetTodos({ limit: 40 });
  const { data: favoritesData } = useGetFavorites();
  const user = authUserStore((state) => state.user); // 추가
  const todoCount = data?.totalCount ?? 0;
  const favoriteCount = favoritesData?.pages[0]?.totalCount ?? 0;
  const name = user?.name ?? '';

  const title = getPageTitle(pathname, name);

  return (
    <header className="flex items-center justify-between gap-3 px-5 py-1 md:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <span className="font-lg-semibold">{title}</span>
        <span className="font-base-semibold mt-0.5 items-center text-orange-600">
          {' '}
          {pathname.startsWith('/dashboard/todos') && todoCount > 0 ? todoCount : ''}
          {pathname.startsWith('/favorites') && favoriteCount > 0 ? favoriteCount : ''}
        </span>
      </div>
      <AlertPopover />
    </header>
  );
}
