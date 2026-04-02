import type { Tags } from '@/api/todos';

import Image from 'next/image';
import Link from 'next/link';
import noteImage from '@/../public/images/img-note.svg';

import { formatDate } from '@/utils/date';

import { Chips } from '@/components/common/Chips';
import { Icon } from '@/components/icon/Icon';
import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/button';

import { AttachmentPreview } from './AttachmentPreview';

interface TodoDetailProps {
  title: string;
  done: 'TO DO' | 'DONE';
  goalTitle: string;
  goalId: number;
  dueDate: string;
  tags: Tags[];
  linkUrl: string | null;
  noteTitle?: string;
  noteId?: number;
  todoId: number;
}

export function TodoDetailContent({
  title,
  done,
  goalTitle,
  goalId,
  dueDate,
  tags,
  linkUrl,
  noteTitle,
  noteId,
  todoId,
}: TodoDetailProps) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* 제목 + 상태 뱃지 */}
      <div className="flex min-w-0 items-center justify-start gap-2 pr-6">
        <span className="font-base-semibold md:font-xl-semibold w-fit truncate text-gray-800">
          {title}
        </span>

        <Chips variant={done === 'TO DO' ? 'todo' : 'done'} />
      </div>

      {/* 목표 */}
      <div className="font-sm-regular flex min-w-0 items-center gap-2 text-gray-600">
        <Icon name="flag" size={18} className="shrink-0" />
        <span className="shrink-0 text-gray-400">목표</span>
        <span className="truncate text-gray-700">{goalTitle}</span>
      </div>

      {/* 마감기한 */}
      <div className="font-sm-regular flex items-center gap-2 text-gray-600">
        <Icon name="calendar" size={18} className="shrink-0" />
        <span className="text-gray-400">마감기한</span>
        <span className="text-gray-700">{formatDate(dueDate)}</span>
      </div>

      {/* 태그 */}
      <div className="font-sm-regular flex items-center gap-2">
        <span className="text-gray-400"># 태그</span>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: Tags, index: number) => (
            <Badge key={index} color={tag.color}>
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* 첨부자료 */}
      {linkUrl && (
        <div className="flex flex-col gap-2">
          <span className="font-sm-semibold md:font-base-semibold text-gray-700">첨부 자료</span>
          <AttachmentPreview url={linkUrl} />
        </div>
      )}

      {/* 작성된 노트 */}
      {noteTitle && (
        <div className="flex flex-col gap-2">
          <span className="font-sm-semibold md:font-base-semibold text-gray-700">작성된 노트</span>

          <IconButton variant="ghost" className="rounded-xl border border-gray-100 p-4">
            <Link
              href={`/goals/${goalId}/notes/${noteId}?todoId=${todoId}`}
              className="flex h-full w-full items-center justify-start gap-2"
            >
              <Image src={noteImage} alt="describe note icon" width={32} height={32} />
              <span className="font-base-regular text-gray-700">{noteTitle}</span>
            </Link>
          </IconButton>
        </div>
      )}
    </div>
  );
}
