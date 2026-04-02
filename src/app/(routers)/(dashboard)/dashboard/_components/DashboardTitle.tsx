import type { User } from '@/lib/auth/schemas/user';

import { getCurrentUser } from '@/lib/auth/getCurrentUser.server';

/**
 * @ //TODO:  추후 이 타이틀이 모바일일 경우 사이드바 제목으로 이동해야 한다.
 */
export const DashboardTitle = async () => {
  const user: User | null = await getCurrentUser();
  const name = user?.name ?? '손';
  return (
    <header className="dashboard-title pt-12 pb-7 md:pt-20 md:pb-10">
      <h1 className="font-base-semibold md:font-xl-semibold lg:text-2xl-semibold text-black">{`${name}님의 대시보드`}</h1>
    </header>
  );
};
