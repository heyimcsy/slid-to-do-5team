import type { Tags } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/_components/TodoDetailContent';

import { cn } from '@/lib';

import { Chips } from '@/components/common/Chips';
import { Icon } from '@/components/icon/Icon';
import { Badge } from '@/components/ui/badge';

export default function MetaTags({
  goalTitle,
  updatedAt,
  todoTitle,
  isDone,
  tags,
  className,
}: {
  goalTitle: string;
  updatedAt: string;
  todoTitle: string;
  tags: Tags[];
  className?: string;
  isDone: boolean;
}) {
  return (
    <div className={cn(className, 'grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-x-8')}>
      {/* 목표 */}
      <div className="font-sm-regular flex items-center gap-2">
        <Icon name="flag" size={18} className="shrink-0" />
        <span className="text-gray-400">목표</span>
        <span className="text-gray-700">{goalTitle}</span>
      </div>
      {/* 작성일 */}
      <div className="font-sm-regular flex items-center gap-2">
        <Icon name="calendar" size={18} className="shrink-0" />
        <span className="text-gray-400">작성일</span>
        <span className="text-gray-700">{updatedAt}</span>
      </div>
      {/* 할일 + 상태 뱃지 */}
      <div className="font-sm-regular flex items-center gap-2">
        <Icon name="checkMini" size={18} className="shrink-0" />
        <span className="shrink-0 text-gray-400">할 일</span>
        <span className="truncate text-gray-700">{todoTitle}</span>
        <Chips variant={isDone ? 'done' : 'todo'} />
      </div>
      {/* 태그 */}
      <div className="font-sm-regular flex items-center gap-2">
        <span className="flex size-4.5 shrink-0 items-center justify-center text-gray-400">#</span>
        <span className="shrink-0 text-gray-400">태그</span>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: Tags, index: number) => (
            <Badge key={index} color={tag.color}>
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
