'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteFavorite, usePostFavorite } from '@/api/favorites';
import { useDeleteTodos } from '@/api/todos';
import { GOALS_TEXT } from '@/app/(routers)/(todo)/constants';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';
import { useTheme } from 'next-themes';

import { ROUTES } from '@/constants/routes';
import { DIALOG_VALUE, SELECT_VALUE } from '@/constants/ui-label';

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
  variant,
}: {
  id: number;
  goalId: number;
  noteIds: number[];
  linkUrl: string | null;
  favorites: boolean;
  variant: 'recent' | 'completed' | 'pending';
}) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { mutate: deleteTodo } = useDeleteTodos();
  const { mutate: postFavorite } = usePostFavorite();
  const { mutate: deleteFavorite } = useDeleteFavorite();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const selectValue = [
    {
      label: noteIds.length > 0 ? SELECT_VALUE.NOTE_EDIT.LABEL : SELECT_VALUE.NOTE_NEW.LABEL,
      value: noteIds.length > 0 ? SELECT_VALUE.NOTE_EDIT.VALUE : SELECT_VALUE.NOTE_NEW.VALUE,
    },
    { label: SELECT_VALUE.EDIT.LABEL, value: SELECT_VALUE.EDIT.VALUE },
    { label: SELECT_VALUE.DELETE.LABEL, value: SELECT_VALUE.DELETE.VALUE },
  ];
  const handleSelectChange = (value: string | null) => {
    if (value === null) return;
    if (value === SELECT_VALUE.DELETE.VALUE) {
      setDeleteDialogOpen(true);
    } else if (value === SELECT_VALUE.EDIT.VALUE) {
      router.push(ROUTES.TODO_EDIT(goalId, id));
    } else {
      const route: string =
        noteIds.length > 0 ? ROUTES.NOTE_EDIT(goalId, noteIds[0]) : ROUTES.NOTE_NEW(goalId, id);
      router.push(route);
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
            router.push(ROUTES.NOTE_DETAIL(goalId, noteIds[0], id));
          }
        }}
        aria-label={GOALS_TEXT.NOTE_DETAIL_BUTTON}
        variant="icon"
        size="none"
      >
        <Icon name="note" variant="default" />
      </Button>
      {linkUrl && (
        <Button
          variant="icon"
          size="none"
          onClick={(e) => {
            e.stopPropagation();
            if (linkUrl) {
              handleCopyLink(linkUrl);
            }
          }}
        >
          <Icon name="link" variant="orange" />
        </Button>
      )}
      <Select items={selectValue} onValueChange={handleSelectChange}>
        <SelectTrigger size="sm" iconTrigger className="size-[20px]">
          <Icon name="dotscircle" size={20} variant="ghost" className="dark:bg-transparent" />
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
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleFavorite();
        }}
        variant="icon"
        size="none"
      >
        <Icon
          name={favorites ? 'filledStar' : 'outlineStar'}
          variant={resolvedTheme === 'dark' ? 'white' : favorites ? 'white' : 'orange'}
        />
      </Button>
    </div>
  );
}
