import type { Tags } from '@/api/todos';

import { META_TAGS } from '@/app/(routers)/(todo)/constants';
import { cn } from '@/lib';

import { formatDate } from '@/utils/date';

import { Chips } from '@/components/common/Chips';
import { Icon } from '@/components/icon/Icon';
import { Badge } from '@/components/ui/badge';

export default function MetaTags({
  goalTitle,
  createdAt,
  todoTitle,
  done,
  tags,
  className,
}: {
  goalTitle: string;
  createdAt: string;
  todoTitle: string;
  tags: Tags[];
  className?: string;
  done: boolean;
}) {
  return (
    <div className={cn(className, 'grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-x-8')}>
      {/* 목표 */}
      <div className="font-sm-regular flex items-center gap-2">
        <Icon name="flag" size={18} className="shrink-0" />
        <span className="text-gray-400">{META_TAGS.GOAL}</span>
        <span className="text-gray-700">{goalTitle}</span>
      </div>
      {/* 작성일 */}
      <div className="font-sm-regular flex items-center gap-2">
        <Icon name="calendar" size={18} className="shrink-0" />
        <span className="text-gray-400">{META_TAGS.CREATED_AT}</span>
        <span className="text-gray-700">{formatDate(createdAt)}</span>
      </div>
      {/* 할일 + 상태 뱃지 */}
      <div className="font-sm-regular flex items-center gap-2">
        <Icon name="checkMini" size={18} className="shrink-0" />
        <span className="shrink-0 text-gray-400">{META_TAGS.TODO}</span>
        <span className="truncate text-gray-700">{todoTitle}</span>
        <Chips variant={done ? 'done' : 'todo'} />
      </div>
      {/* 태그 */}
      <div className="font-sm-regular flex items-center gap-2">
        <span className="flex size-4.5 shrink-0 items-center justify-center text-gray-400">
          {META_TAGS.TAGS.ICON}
        </span>
        <span className="shrink-0 text-gray-400">{META_TAGS.TAGS.TAG}</span>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: Tags) => (
            <Badge key={tag.id} color={tag.color}>
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
