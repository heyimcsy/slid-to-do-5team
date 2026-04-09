'use client';

import type { Goal } from '@/api/goals';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import goalImage from '@/../public/images/small-goal.svg';
import { useDeleteGoals, usePatchGoals } from '@/api/goals';
import { GOAL_IMAGE, GOALS_TEXT } from '@/app/(routers)/(todo)/constants';

import { DIALOG_VALUE, SELECT_VALUE } from '@/constants/ui-label';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

interface GoalsTabProps {
  goalId: number;
  goalData: Omit<Goal, 'completedCount' | 'todoCount'> | undefined;
}
export default function GoalsTab({ goalId, goalData }: GoalsTabProps) {
  const router = useRouter();

  const { mutate: deleteGoal } = useDeleteGoals({
    onSuccess: () => {
      router.push('/dashboard');
    },
  });
  const { mutate: editGoal } = usePatchGoals();
  const [title, setTitle] = useState<string>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const selectValue = [
    { label: SELECT_VALUE.EDIT.LABEL, value: SELECT_VALUE.EDIT.VALUE },
    { label: SELECT_VALUE.DELETE.LABEL, value: SELECT_VALUE.DELETE.VALUE },
  ];

  const handleSelectChange = (value: string | null) => {
    if (value === null) return;
    if (value === SELECT_VALUE.DELETE.VALUE) {
      setDeleteDialogOpen(true);
    } else {
      if (goalData?.title) {
        setTitle(goalData?.title);
      }
      setEditDialogOpen(true);
    }
  };

  const handleDelete = () => {
    deleteGoal({ id: goalId });
  };

  const onEditChange = () => {
    setEditDialogOpen(!editDialogOpen);
  };

  const onEditChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    if (value.length > 100) return;
    setTitle(value);
  };

  const onEditConfirm = () => {
    editGoal({ id: goalId, title: title });
    setEditDialogOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onEditConfirm();
  };

  return (
    <>
      <div className="flex h-16 w-full min-w-0 items-center justify-between rounded-[16px] bg-white p-4 lg:h-40 lg:w-1/2">
        <div className="flex min-w-0 items-center space-x-3">
          <Image
            src={goalImage}
            alt={GOAL_IMAGE.ALT}
            width={GOAL_IMAGE.WIDTH}
            height={GOAL_IMAGE.HEIGHT}
            className="object-contain"
          />
          <h2 className="font-base-semibold w-full truncate text-gray-700">{goalData?.title}</h2>
        </div>
        <Select items={selectValue} onValueChange={handleSelectChange}>
          <SelectTrigger size="sm" iconTrigger className="shrink-0">
            <Icon name="more" />
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
      </div>
      <Dialog open={editDialogOpen} onOpenChange={onEditChange}>
        <DialogContent
          className="w-86 space-y-8 pt-8 md:w-114 md:space-y-10 md:pt-8"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>{DIALOG_VALUE.TITLE_EDIT(GOALS_TEXT.GOAL)}</DialogTitle>
            <Input
              value={title}
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
                  disabled={!title.trim() || title === goalData?.title}
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
    </>
  );
}
