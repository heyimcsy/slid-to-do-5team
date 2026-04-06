import { getCurrentUser } from '@/lib/auth/getCurrentUser.server';

import { DashboardTitleClient } from './DashboardTitleClient';

/**
 * @ //TODO:  추후 이 타이틀이 모바일일 경우 사이드바 제목으로 이동해야 한다.
 * @note 표시 우선순위는 {@link DashboardTitleClient} — persist → 서버 `getCurrentUser`.
 */
export async function DashboardTitle() {
  const initialUser = await getCurrentUser();
  return <DashboardTitleClient initialUser={initialUser} />;
}
