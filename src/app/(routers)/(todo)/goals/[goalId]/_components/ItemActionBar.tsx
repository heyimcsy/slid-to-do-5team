'use client';

import type { ItemActionBarProps } from '@/app/(routers)/(todo)/goals/types';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteFavorite, usePostFavorite } from '@/api/favorites';
import { useDeleteTodos } from '@/api/todos';
import { GOALS_TEXT } from '@/app/(routers)/(todo)/constants';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';

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
  isFavorite,
}: ItemActionBarProps) {
  const router = useRouter();
  const { mutate: deleteTodo } = useDeleteTodos();
  const { mutate: postFavorite } = usePostFavorite();
  const { mutate: deleteFavorite } = useDeleteFavorite();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);

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

  const debouncedFavoriteApi = useDebouncedCallback((next: boolean) => {
    if (next) {
      postFavorite(id, {
        onError: () => setLocalIsFavorite(isFavorite),
      });
    } else {
      deleteFavorite(id, {
        onError: () => setLocalIsFavorite(isFavorite),
      });
    }
  }, 300);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isFavorite;
    setLocalIsFavorite(next);
    debouncedFavoriteApi(next);
  };

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
        <Icon name="note" variant="orange" />
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
      <Select items={selectValue} onValueChange={handleSelectChange}>
        <SelectTrigger size="sm" iconTrigger className="size-[20px]">
          <Icon
            name="dotscircle"
            size={20}
            className="dark:hidden"
            aria-label={DIALOG_VALUE.DOT_TRIGGER_ALIA_LABEL}
          />
          <Icon
            name="dotscircle"
            size={20}
            variant="ghost"
            className="hidden dark:block"
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
      <Button onClick={handleFavorite} variant="icon" size="none">
        <Icon
          name={localIsFavorite ? 'filledStar' : 'outlineStar'}
          variant={localIsFavorite ? 'orange' : undefined}
        />
      </Button>
    </div>
  );
}
