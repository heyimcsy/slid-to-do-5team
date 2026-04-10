'use client';

import type { User } from '@/lib/auth/schemas/user';



import { useUserInfo } from '@/hooks/auth/useUserInfo';





type DashboardTitleClientProps = {
  /** 서버 `getCurrentUser()` — persist에 없거나 서버만 맞을 때 사용 */
  initialUser: User | null;
};

/**
 * persist(`authUserStore`)가 있으면 우선, 없으면 `initialUser`.
 */
export function DashboardTitleClient({ initialUser }: DashboardTitleClientProps) {
  const storeUser = useUserInfo();
  const user =
    storeUser && initialUser && storeUser.email !== initialUser.email
      ? initialUser
      : (storeUser ?? initialUser);
  return (
    <header className="dashboard-title hidden pt-12 pb-7 md:block md:pt-20 md:pb-10 lg:block">
      <h1 className="font-base-semibold md:font-xl-semibold lg:text-2xl-semibold text-black">{`${user?.name ?? '손'}님의 대시보드`}</h1>
    </header>
  );
}
