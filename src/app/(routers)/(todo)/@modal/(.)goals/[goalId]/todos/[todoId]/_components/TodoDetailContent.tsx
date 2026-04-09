import type { Tags } from '@/api/todos';

import Image from 'next/image';
import Link from 'next/link';
import noteImage from '@/../public/images/img-note.svg';
import { GOALS_TEXT, META_TAGS, NOTE_IMAGE_SMALL } from '@/app/(routers)/(todo)/constants';

import { ROUTES } from '@/constants/routes';

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
  fileUrl: string | null;
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
  fileUrl,
}: TodoDetailProps) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* 제목 + 상태 뱃지 */}
      <div className="flex min-w-0 items-center justify-start gap-2 pr-6">
        <span className="font-base-semibold md:font-xl-semibold w-fit truncate text-gray-800">
          {title}
        </span>

        <Chips variant={done === GOALS_TEXT.TODO ? 'todo' : 'done'} />
      </div>

      {/* 목표 */}
      <div className="font-sm-regular flex min-w-0 items-center gap-2 text-gray-600">
        <Icon name="flag" size={18} className="shrink-0" />
        <span className="shrink-0 text-gray-400">{META_TAGS.GOAL}</span>
        <span className="truncate text-gray-700">{goalTitle}</span>
      </div>

      {/* 마감기한 */}
      <div className="font-sm-regular flex items-center gap-2 text-gray-600">
        <Icon name="calendar" size={18} className="shrink-0" />
        <span className="text-gray-400">{META_TAGS.DUEDATE}</span>
        <span className="text-gray-700">{formatDate(dueDate)}</span>
      </div>

      {/* 태그 */}
      <div className="font-sm-regular flex items-center gap-2">
        <span className="text-gray-400">
          {META_TAGS.TAGS.ICON} {META_TAGS.TAGS.TAG}
        </span>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: Tags, index: number) => (
            <Badge key={index} color={tag.color}>
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* 첨부자료 */}
      {(linkUrl || fileUrl) && (
        <div className="flex flex-col gap-2">
          <span className="font-sm-semibold md:font-base-semibold text-gray-700">
            {META_TAGS.ATTACHMENT}
          </span>
          <AttachmentPreview linkUrl={linkUrl} fileUrl={fileUrl} />
        </div>
      )}

      {/* 작성된 노트 */}
      {noteTitle && noteId && (
        <div className="flex flex-col gap-2">
          <span className="font-sm-semibold md:font-base-semibold text-gray-700">
            {META_TAGS.WRITE_NOTE}
          </span>

          <IconButton variant="ghost" className="rounded-xl border border-gray-100 p-4">
            <Link
              href={ROUTES.NOTE_DETAIL(goalId, noteId, todoId)}
              className="flex h-full w-full items-center justify-start gap-2"
            >
              <Image
                src={noteImage}
                alt={NOTE_IMAGE_SMALL.ALT}
                width={NOTE_IMAGE_SMALL.WIDTH}
                height={NOTE_IMAGE_SMALL.HEIGHT}
              />
              <span className="font-base-regular text-gray-700">{noteTitle}</span>
            </Link>
          </IconButton>
        </div>
      )}
    </div>
  );
}
