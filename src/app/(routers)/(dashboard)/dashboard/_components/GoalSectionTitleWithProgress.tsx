'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteGoals, usePatchGoals } from '@/api/goals';
import { GOALS_TEXT } from '@/app/(routers)/(todo)/constants';
import { cn } from '@/lib/shadcn';

import { ROUTES } from '@/constants/routes';
import { DIALOG_VALUE } from '@/constants/ui-label';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import ProgressBar from './ProgressBar';

export function GoalSectionTitleWithProgress({
  goalId,
  title,
  progress,
  className,
}: {
  goalId: number;
  title: string;
  progress: number;
  className?: string;
}) {
  const router = useRouter();
  const { mutate: deleteGoal } = useDeleteGoals({});
  const { mutate: editGoal } = usePatchGoals();
  const [editTitle, setEditTitle] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openEditDialog = () => {
    setEditTitle(title);
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    deleteGoal({ id: goalId });
  };

  const onEditChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length > 100) return;
    setEditTitle(value);
  };

  const onEditConfirm = () => {
    editGoal({ id: goalId, title: editTitle.trim() });
    setEditDialogOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onEditConfirm();
  };

  return (
    <div className={cn('min-w-0', className)}>
      <h2 className="font-base-semibold min-w-0 text-gray-700">
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className={cn(
              'font-base-semibold max-w-full cursor-pointer truncate text-left duration-300 hover:text-orange-500',
              'rounded-sm ring-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
            )}
            aria-label="목표 메뉴 열기"
          >
            {title}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="**:font-base-regular">
            <DropdownMenuItem
              onClick={() => {
                router.push(ROUTES.GOAL_DETAIL(goalId));
              }}
            >
              목표 상세
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openEditDialog}>목표 수정</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>목표 삭제</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </h2>
      <ProgressBar value={progress} max={100} />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="w-86 space-y-8 pt-8 md:w-114 md:space-y-10 md:pt-8"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>{DIALOG_VALUE.TITLE_EDIT(GOALS_TEXT.GOAL)}</DialogTitle>
            <Input
              value={editTitle}
              onChange={onEditChangeHandler}
              onKeyDown={handleKeyDown}
              autoFocus
              aria-label={GOALS_TEXT.EDIT_GOAL_INPUT_PLACEHOLDER}
              placeholder={GOALS_TEXT.EDIT_GOAL_INPUT_PLACEHOLDER}
            />
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="ghost" className="w-1/2">
                  {DIALOG_VALUE.BUTTON.CANCEL}
                </Button>
              }
            />
            <DialogClose
              render={
                <Button
                  onClick={onEditConfirm}
                  type="button"
                  variant="default"
                  className="w-1/2"
                  disabled={!editTitle.trim() || editTitle === title}
                >
                  {DIALOG_VALUE.BUTTON.CONFIRM}
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={DIALOG_VALUE.TITLE_DELETE}
        description={DIALOG_VALUE.DESCRIPTION_DELETE(GOALS_TEXT.GOAL)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
