import type { User } from '@/lib/auth/schemas/user';

import {
  CalendarPageHead,
  NewTodoButton,
  ScheduleCalendar,
} from '@/app/(routers)/calendar/_components/index';
import { getCurrentUser } from '@/lib/auth/getCurrentUser.server';

export default async function CalendarPage() {
  const userInfo: User | null = await getCurrentUser();
  return (
    <div className="relative flex h-full w-full min-w-86 flex-col items-center bg-white pb-14 md:w-159 md:space-y-6 md:bg-transparent md:pt-20 lg:w-320 lg:space-y-4">
      <CalendarPageHead userInfo={userInfo} />
      <ScheduleCalendar />
      <div className="fixed bottom-0 flex h-16 w-full items-center justify-center border-t-1 bg-white px-4 md:hidden">
        <NewTodoButton />
      </div>
    </div>
  );
}
