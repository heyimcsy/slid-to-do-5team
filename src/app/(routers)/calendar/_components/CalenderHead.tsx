import Image from 'next/image';
import largeGoal from '@/../public/images/large-goal.svg';

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

interface CalendarHeaderProps {
  y: number;
  m: number;
  prevYear: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  nextYear: () => void;
  findToday: () => void;
}

const selectValue = [
  { label: '전체 목표', value: 0 },
  { label: '자바스크립트로 웹서비스 만들기', value: 1 },
  { label: '디자인 시스템 정복하기', value: 2 },
];

export default function CalendarHeader({
  y,
  m,
  prevYear,
  prevMonth,
  nextMonth,
  nextYear,
  findToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex h-33 flex-col items-center justify-center space-y-4 px-4 lg:h-22 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:px-8">
      <div className="flex h-fit w-fit items-center justify-center space-x-2">
        <div className="flex gap-2">
          <Button variant="icon" size="none" onClick={prevYear}>
            <Icon name="doubleArrow" direction="left" />
          </Button>
          <Button variant="icon" size="none" onClick={prevMonth}>
            <Icon name="arrow" direction="left" />
          </Button>
        </div>
        <span className="font-lg-semibold text-gray-800">
          {y}년 {m + 1}월
        </span>
        <div className="flex items-center gap-2">
          <Button variant="icon" size="none" onClick={nextMonth}>
            <Icon name="arrow" direction="right" />
          </Button>
          <Button variant="icon" size="none" onClick={nextYear}>
            <Icon name="doubleArrow" direction="right" />
          </Button>
          <Button variant="icon" size="none" onClick={findToday} className="text-gray-500">
            today
          </Button>
        </div>
      </div>
      <Select items={selectValue}>
        <SelectTrigger className="h-12 w-full lg:w-85">
          <div className="font-sm-semibold flex items-center gap-2">
            <Image src={largeGoal} alt="" width={20} height={20} />
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
  );
}
