import type { User } from '@/lib/auth/schemas/user';

import { CALENDAR_TEXT } from '@/app/(routers)/calendar/constants';

import NewTodoButton from './NewTodoButton';

export default function CalendarPageHead({ userInfo }: { userInfo: User | null }) {
  const userName: string = userInfo?.name ? userInfo?.name : '';
  return (
    <div className="hidden w-full items-center justify-between md:flex">
      <h1 className="font-xl-semibold lg:font-2xl-semibold">{CALENDAR_TEXT.USER(userName)}</h1>
      <NewTodoButton width="w-fit" />
    </div>
  );
}
