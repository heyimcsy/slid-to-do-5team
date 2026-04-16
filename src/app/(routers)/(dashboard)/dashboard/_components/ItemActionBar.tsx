'use client';

import type { VariantProps } from 'class-variance-authority';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteFavorite, usePostFavorite } from '@/api/favorites';
import { useDeleteTodos } from '@/api/todos';
import { GOALS_TEXT } from '@/app/(routers)/(todo)/constants';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

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
  const [localFavorite, setLocalFavorite] = useState(favorites);
  useEffect(() => {
    setLocalFavorite(favorites);
  }, [favorites]);

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
    try {
      await navigator.clipboard.writeText(linkUrl);
      toast.success('링크가 복사되었습니다');
    } catch (error) {
      toast.error('링크 복사에 실패했습니다', { id: 'link-copy-error' });
      console.error(error);
    }
  };

  const debouncedFavoriteApi = useDebouncedCallback((nextFavorite: boolean) => {
    if (nextFavorite) {
      postFavorite(id);
    } else {
      deleteFavorite(id);
    }
  }, 500);

  const handleFavorite = () => {
    const next = !localFavorite;
    setLocalFavorite(next);
    debouncedFavoriteApi(next);
  };

  const variantStyle = {
    recent: {
      favorite: 'white',
    },
    completed: {
      favorite: 'strong',
    },
    pending: {
      favorite: 'strong',
    },
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
        <Icon name="note" variant="default" />
      </Button>
      {linkUrl && (
        <Button
          variant="icon"
          size="none"
          aria-label="링크 복사"
          onClick={(e) => {
            e.stopPropagation();
            if (linkUrl) {
              handleCopyLink(linkUrl);
            }
          }}
        >
          <Icon
            name="link"
            variant={
              resolvedTheme === 'dark' ? 'white' : variant === 'recent' ? 'default' : 'orange'
            }
          />
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
        aria-label={localFavorite ? '찜하기 취소' : '찜하기'}
        aria-pressed={localFavorite}
      >
        <Icon
          name={localFavorite ? 'filledStar' : 'outlineStar'}
          variant={
            resolvedTheme === 'dark'
              ? 'white'
              : (variantStyle[variant].favorite as VariantProps<typeof Icon>['variant'])
          }
        />
      </Button>
    </div>
  );
}
