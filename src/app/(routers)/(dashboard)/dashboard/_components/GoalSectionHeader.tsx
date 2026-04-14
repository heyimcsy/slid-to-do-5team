'use client';

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';

import { SearchInput } from '@/components/common/SearchInput';
import { PlusIcon } from '@/components/icon/icons/Plus';
import { IconButton } from '@/components/ui/button';

import { GoalSectionTitleWithProgress } from './GoalSectionTitleWithProgress';

export function GoalSectionHeader({
  title,
  progress,
  searchQuery,
  onSearchChange,
}: {
  title: string;
  progress: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}) {
  const router = useRouter();

  /** `/goals/todos/new` → `(todo)/@modal/(.)goals/todos/new`가 인터셉트되면 NewForm 모달, 아니면 동일 URL 전체 페이지 */
  const handleNewGoal = () => {
    router.push(ROUTES.TODO_NEW);
  };
  return (
    <div className="goal-section-header grid w-full grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-4 px-2 pb-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-4">
      {/* 1. ProgressBar 영역 */}
      <GoalSectionTitleWithProgress
        className="col-start-1 row-start-1 md:col-start-1 md:row-start-1"
        title={title}
        progress={progress}
      />
      {/* 2. SearchInput 영역 */}
      <SearchInput
        className="font-sm-medium md:font-sm-medium lg:font-sm-medium col-span-2 row-start-2 flex h-5 min-h-5 w-full items-center py-5 md:col-span-1 md:col-start-2 md:row-start-1 md:h-5 md:min-h-5 md:w-52.5 lg:h-5 lg:min-h-5"
        placeholder="할 일을 검색해주세요"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {/* 3. IconButton 영역 */}
      <IconButton
        variant="ghost"
        size="md"
        aria-label="새 할 일 추가"
        className="col-start-2 row-start-1 shrink-0 self-start rounded-full border-orange-500 py-3 text-orange-500 hover:border-orange-700 hover:bg-orange-500 hover:text-white md:col-start-3 md:row-start-1 md:self-center md:py-2.5 lg:py-2.5"
        type="button"
        onClick={handleNewGoal}
      >
        <PlusIcon variant="orange" className="size-3.5 group-hover/button:text-(--color-white)" />
        <span className="font-sm-semibold hidden hover:font-bold md:flex lg:flex">할 일 추가</span>
      </IconButton>
    </div>
  );
}
