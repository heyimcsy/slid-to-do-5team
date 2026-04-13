import type { CalendarHeadProps } from '@/app/(routers)/calendar/types';

import Image from 'next/image';
import largeGoal from '@/../public/images/large-goal.svg';
import { CALENDAR_TEXT, GOAL_IMAGE } from '@/app/(routers)/calendar/constants';

import { formatDate } from '@/utils/date';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CalendarHead({
  y,
  m,
  prevYear,
  prevMonth,
  nextMonth,
  nextYear,
  findToday,
  selectValue,
  selectedGoalId,
  onGoalChange,
  totalCount,
  oldestDueDate,
  newestDueDate,
}: CalendarHeadProps) {
  return (
    <div className="flex h-40 flex-col py-4 lg:h-26">
      <div className="flex h-fit flex-col items-center justify-center space-y-4 px-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:px-8">
        <div className="flex h-fit w-fit items-center justify-center space-x-2">
          <div className="flex gap-2">
            <Button
              variant="icon"
              size="none"
              onClick={prevYear}
              aria-label={CALENDAR_TEXT.PREVIOUS_YEAR}
            >
              <Icon name="doubleArrow" direction="left" />
            </Button>
            <Button
              variant="icon"
              size="none"
              onClick={prevMonth}
              aria-label={CALENDAR_TEXT.PREVIOUS_MONTH}
            >
              <Icon name="arrow" direction="left" />
            </Button>
          </div>
          <span className="font-lg-semibold text-gray-800">
            {CALENDAR_TEXT.YEAR_MONTH(y, m + 1)}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              size="none"
              onClick={nextMonth}
              aria-label={CALENDAR_TEXT.NEXT_MONTH}
            >
              <Icon name="arrow" direction="right" />
            </Button>
            <Button
              variant="icon"
              size="none"
              onClick={nextYear}
              aria-label={CALENDAR_TEXT.NEXT_YEAR}
            >
              <Icon name="doubleArrow" direction="right" />
            </Button>
            <Button
              variant="icon"
              size="none"
              onClick={findToday}
              className="text-gray-500"
              aria-label={CALENDAR_TEXT.THE_TODAY}
            >
              {CALENDAR_TEXT.TODAY}
            </Button>
          </div>
        </div>
        <Select
          items={selectValue}
          value={selectedGoalId}
          onValueChange={(val) => onGoalChange(Number(val))}
        >
          <SelectTrigger className="h-12 w-full lg:w-85">
            <div className="font-sm-semibold flex min-w-0 items-center gap-2">
              <Image
                src={largeGoal}
                alt={GOAL_IMAGE.ALT}
                width={GOAL_IMAGE.WIDTH}
                height={GOAL_IMAGE.HEIGHT}
              />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {selectValue.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-full items-center justify-around space-x-4 px-4 md:justify-center md:px-10 lg:justify-start">
        <p className="font-sm-semibold md:font-base-semibold min-w-0 truncate text-gray-800">
          {CALENDAR_TEXT.TODO}
          <span className="font-sm-bold md:font-base-bold shrink-0 text-orange-600">
            {totalCount}
          </span>{' '}
          {CALENDAR_TEXT.COUNT}
        </p>
        {oldestDueDate && newestDueDate && (
          <p className="font-sm-regular md:font-base-regular min-w-0 truncate text-gray-500">
            {CALENDAR_TEXT.DUEDATE_RANGE} {formatDate(oldestDueDate)} ~ {formatDate(newestDueDate)}
          </p>
        )}
      </div>
    </div>
  );
}
