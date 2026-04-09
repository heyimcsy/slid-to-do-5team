'use client';

import type { Todo } from '@/api/todos';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import imgNote from '@/../public/images/img-note.svg';
import { useDeleteNote } from '@/api/notes';
import { GOALS_TEXT, NOTE_IMAGE } from '@/app/(routers)/(todo)/constants';
import { cn } from '@/lib';

import { ROUTES } from '@/constants/routes';
import { DIALOG_VALUE, SELECT_VALUE } from '@/constants/ui-label';

import { formatDate } from '@/utils/date';

import { Chips } from '@/components/common/Chips';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Icon } from '@/components/icon/Icon';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

export function NoteCard({
  goalId,
  id,
  title,
  todo,
  createdAt,
}: {
  goalId: number;
  id: number;
  title: string;
  todo: Pick<Todo, 'id' | 'title' | 'done'>;
  createdAt: string;
}) {
  const selectValue = [
    { label: SELECT_VALUE.EDIT.LABEL, value: SELECT_VALUE.EDIT.VALUE },
    { label: SELECT_VALUE.DELETE.LABEL, value: SELECT_VALUE.DELETE.VALUE },
  ];
  const router = useRouter();
  const { mutate: deleteNote } = useDeleteNote();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSelectChange = (value: string | null) => {
    if (value === null) return;

    if (value === SELECT_VALUE.DELETE.VALUE) {
      setDeleteDialogOpen(true);
    } else {
      router.push(ROUTES.NOTE_EDIT(goalId, id));
    }
  };

  const handleDelete = () => {
    deleteNote({ id });
  };

  return (
    <Link
      href={ROUTES.NOTE_DETAIL(goalId, id, todo.id)}
      className={cn(
        'group flex cursor-pointer flex-col space-y-3 md:space-y-4',
        'h-24 w-full rounded-[16px] bg-white p-4 md:h-[138px] md:px-[38px] md:pt-7 md:pb-8',
        'transition-color-600 border border-transparent',
        'hover:border-orange-200',
      )}
    >
      {/* 상단: 아이콘 + 더보기 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <Image
            src={imgNote}
            alt={NOTE_IMAGE.ALT}
            width={NOTE_IMAGE.WIDTH}
            height={NOTE_IMAGE.HEIGHT}
            className="size-8 lg:size-10"
          />

          {/* 중단: 노트 제목 */}
          <p className="font-sm-semibold md:font-xl-semibold line-clamp-2 text-gray-800">{title}</p>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation(); // 부모로 전파 중지
          }}
        >
          <Select
            items={selectValue}
            onValueChange={handleSelectChange}
            aria-label={DIALOG_VALUE.DOT_TRIGGER_ALIA_LABEL}
          >
            <SelectTrigger size="sm" iconTrigger className="size-[20px] dark:hidden">
              <Icon name="dotscircle" size={20} />
            </SelectTrigger>
            <SelectTrigger
              size="sm"
              iconTrigger
              className="hidden size-[20px] dark:block"
              aria-label={DIALOG_VALUE.DOT_TRIGGER_ALIA_LABEL}
            >
              <Icon
                name="dotscircle"
                size={20}
                variant="ghost"
                aria-label={DIALOG_VALUE.DOT_TRIGGER_ALIA_LABEL}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectValue.map((item) => (
                  <SelectItem size="sm" key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <DeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title={DIALOG_VALUE.TITLE_DELETE}
            description={DIALOG_VALUE.DESCRIPTION_DELETE(GOALS_TEXT.TODO_KO)}
            onConfirm={handleDelete}
          />
        </div>
      </div>
      {/* 하단: 뱃지 + 할일 제목 + 날짜 */}
      <div className="flex h-5 items-center justify-between md:h-5.5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Chips variant={todo.done ? 'done' : 'todo'} />
          <p className="font-xs-regular md:font-sm-regular truncate text-gray-600">{todo.title}</p>
        </div>
        <p className="font-xs-regular text-right text-gray-400">{formatDate(createdAt)}</p>
      </div>
    </Link>
  );
}
