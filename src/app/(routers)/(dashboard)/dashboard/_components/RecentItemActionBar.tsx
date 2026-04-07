'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeleteFavorite, usePostFavorite } from '@/api/favorites';
import { useDeleteTodos } from '@/api/todos';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

export default function ItemActionBar({
  id,
  goalId,
  noteIds,
  linkUrl,
  favorites,
}: {
  id: number;
  goalId: number;
  noteIds: number[];
  linkUrl: string | null;
  favorites: boolean;
}) {
  const router = useRouter();
  const { mutate: deleteTodo } = useDeleteTodos();
  const { mutate: postFavorite } = usePostFavorite();
  const { mutate: deleteFavorite } = useDeleteFavorite();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const selectValue = [
    { label: '수정하기', value: 'edit' },
    { label: '삭제하기', value: 'delete' },
  ];
  const handleSelectChange = (value: string | null) => {
    if (value === null) return;
    if (value === 'delete') {
      setDeleteDialogOpen(true);
    } else {
      router.push(`/goals/${goalId}/todos/${id}/edit`);
    }
  };

  const handleDelete = () => {
    deleteTodo({ id: id });
  };

  const handleCopyLink = async (linkUrl: string) => {
    await navigator.clipboard.writeText(linkUrl);
  };

  const handleFavorite = useDebouncedCallback(() => {
    if (favorites) {
      deleteFavorite(id);
    } else {
      postFavorite(id);
    }
  }, 500);

  return (
    <div className="flex h-fit shrink-0 space-x-[6px] lg:space-x-2">
      <Button
        className={cn(noteIds.length > 0 ? 'block' : 'hidden')}
        onClick={(e) => {
          e.stopPropagation();
          if (noteIds.length > 0) {
            router.push(`/goals/${goalId}/notes/${noteIds[0]}?todoId=${id}`);
          }
        }}
        aria-label="노트 열기"
        variant="icon"
        size="none"
      >
        <Icon name="note" variant="default" />
      </Button>
      {linkUrl && (
        <Button
          variant="icon"
          size="none"
          onClick={() => {
            linkUrl && handleCopyLink(linkUrl);
          }}
        >
          <Icon name="link" variant="orange" />
        </Button>
      )}
      <div
        className={cn(
          'hidden h-fit shrink-1 items-center space-x-[6px] lg:space-x-2',
          'group-hover:flex',
          selectOpen && 'flex',
        )}
      >
        <Button
          className={cn(noteIds.length > 0 ? 'hidden' : 'block')}
          onClick={(e) => {
            e.stopPropagation();
          }}
          variant="icon"
          size="none"
        >
          <Link href={`/goals/${goalId}/notes/new?todoId=${id}`}>
            <Icon name="edit" variant="ghost" />
          </Link>
        </Button>
        <Select
          items={selectValue}
          onValueChange={handleSelectChange}
          open={selectOpen}
          onOpenChange={setSelectOpen}
        >
          <SelectTrigger size="sm" iconTrigger className="size-[20px]">
            <Icon name="dotscircle" size={20} variant="ghost" />
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
          title="정말 삭제하시겠어요?"
          description="삭제된 할일은 복구할 수 없습니다."
          onConfirm={handleDelete}
        />
      </div>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleFavorite();
        }}
        variant="icon"
        size="none"
      >
        <Icon name={favorites ? 'filledStar' : 'outlineStar'} variant="white" />
      </Button>
    </div>
  );
}
