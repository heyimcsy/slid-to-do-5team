import {
  BottomButton,
  CalendarPageHead,
  ScheduleCalendar,
} from '@/app/(routers)/calendar/_components/index';

export default function CalendarPage() {
  return (
    <div className="relative flex h-full w-full min-w-86 flex-col items-center bg-white pt-8 pb-14 md:w-159 md:space-y-6 md:bg-transparent lg:w-320 lg:space-y-4">
      <CalendarPageHead />
      <ScheduleCalendar />
      <div className="fixed bottom-0 flex h-16 w-full items-center justify-center border-t-1 bg-white px-4 md:hidden">
        <BottomButton />
      </div>
    </div>
  );
}
