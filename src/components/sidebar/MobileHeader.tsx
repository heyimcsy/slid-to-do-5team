'use client';

import { usePathname } from 'next/navigation';
import { useGetTodos } from '@/api/todos';
import { useGetFavorites } from '@/app/(routers)/favorites/_api/favoritesQueries';

import AlertPopover from '../AlertPopover';
import { SidebarTrigger } from '../ui/sidebar';

export default function MobileHeader() {
  const pathname = usePathname();
  const { data } = useGetTodos({ limit: 40 });
  const { data: favoritesData } = useGetFavorites();
  const todoCount = data?.totalCount ?? 0;
  const favoriteCount = favoritesData?.pages[0]?.totalCount ?? 0;

  const getTitle = (pathname: string) => {
    if (pathname.startsWith('/calendar')) return '캘린더';
    if (pathname.startsWith('/dashboard/todos')) return '모든 할 일';
    if (pathname.startsWith('/dashboard')) return '대시보드';
    if (pathname.includes('/notes')) return '노트 모아보기';
    if (pathname.startsWith('/goals')) return '목표';
    if (pathname.startsWith('/community')) return '소통 게시판';
    if (pathname.startsWith('/favorites')) return '찜한 할 일';
    if (pathname.startsWith('/profile')) return '내 정보 관리';
    return '';
  };

  const title = getTitle(pathname);

  return (
    <header className="flex items-center justify-between gap-3 px-5 py-1 md:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
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
