import Image from 'next/image';

import { Chips } from '@/components/common/Chips';
import { Icon } from '@/components/icon/Icon';
import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/button';

import { AttachmentPreview } from './AttachmentPreview';

export interface Tags {
  name: string;
  color: 'green' | 'gray' | 'yellow' | 'red' | 'purple';
}
// 나중에 API 연결할 때 받을 타입
interface TodoDetailProps {
  title: string;
  status: 'TO DO' | 'DONE';
  goalTitle: string;
  deadline: string;
  tags: Tags[];
  attachmentUrl?: string;
  noteTitle?: string;
  image?: string;
}

export function TodoDetailContent({
  title,
  status,
  goalTitle,
  deadline,
  tags,
  attachmentUrl,
  image,
  noteTitle,
}: TodoDetailProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 제목 + 상태 뱃지 */}
      <div className="flex items-center gap-2">
        <span className="font-base-semibold md:font-xl-semibold text-gray-800">{title}</span>

        <Chips variant={status === 'TO DO' ? 'todo' : 'done'} />
      </div>

      {/* 목표 */}
      <div className="font-sm-regular flex items-center gap-2 text-gray-600">
        <Icon name="flag" size={18} className="shrink-0" />
        <span className="text-gray-400">목표</span>
        <span className="text-gray-700">{goalTitle}</span>
      </div>

      {/* 마감기한 */}
      <div className="font-sm-regular flex items-center gap-2 text-gray-600">
        <Icon name="calendar" size={18} className="shrink-0" />
        <span className="text-gray-400">마감기한</span>
        <span className="text-gray-700">{deadline}</span>
      </div>

      {/* 태그 */}
      <div className="font-sm-regular flex items-center gap-2">
        <span className="text-gray-400"># 태그</span>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} color={tag.color}>
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* 첨부자료 */}
      {(attachmentUrl || image) && (
        <div className="flex flex-col gap-2">
          <span className="font-sm-semibold md:font-base-semibold text-gray-700">첨부 자료</span>
          <AttachmentPreview url={attachmentUrl} image={image} />
        </div>
      )}

      {/* 작성된 노트 */}
      {noteTitle && (
        <div className="flex flex-col gap-2">
          <span className="font-sm-semibold md:font-base-semibold text-gray-700">작성된 노트</span>
          <IconButton
            variant="ghost"
            className="flex items-center gap-2 rounded-xl border border-gray-100 p-4"
          >
            <Image src="/images/img-note.svg" alt="노트 첨부란 아이콘" width={32} height={32} />
            <span className="font-base-regular text-gray-700">{noteTitle}</span>
          </IconButton>
        </div>
      )}
    </div>
  );
}
