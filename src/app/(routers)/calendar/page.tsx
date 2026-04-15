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
    <div className="my-auto h-full w-full pb-16 md:flex md:h-fit md:items-center md:justify-center">
      <div className="relative flex h-fit w-full min-w-86 flex-col items-center bg-white md:w-159 md:space-y-6 md:bg-transparent lg:w-320 lg:space-y-4">
        <CalendarPageHead userInfo={userInfo} />
        <ScheduleCalendar />
        <div className="fixed bottom-0 left-0 flex h-16 w-full items-center justify-start border-t-1 bg-white px-4 md:hidden">
          <NewTodoButton />
        </div>
      </div>
    </div>
  );
}
