'use client';

import type { Goal } from '@/api/goals';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import goalImage from '@/../public/images/small-goal.svg';
import { useDeleteGoals, usePatchGoals } from '@/api/goals';

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
  data: Omit<Goal, 'completedCount' | 'todoCount'>;
}
export default function GoalsTab({ goalId, data }: GoalsTabProps) {
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
    { label: '수정하기', value: 'edit' },
    { label: '삭제하기', value: 'delete' },
  ];

  const onEditChange = () => {
    setEditDialogOpen(!editDialogOpen);
  };
  const onEditChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTitle(value);
  };
  const handleSelectChange = (value: string | null) => {
    if (value === null) return;
    if (value === 'delete') {
      setDeleteDialogOpen(true);
    } else {
      if (data?.title) {
        setTitle(data?.title);
      }
      setEditDialogOpen(true);
    }
  };

  const handleDelete = () => {
    deleteGoal({ id: goalId });
  };

  const onEditConfirm = () => {
    editGoal({ id: goalId, title: title });
  };

  return (
    <>
      <div className="flex h-16 w-full items-center justify-between rounded-[16px] bg-white p-4 lg:h-40 lg:w-1/2">
        <div className="flex items-center space-x-3">
          <Image
            src={goalImage}
            alt="describe goal icon"
            width={32}
            height={32}
            className="object-contain"
          />
          <h2 className="font-base-semibold text-gray-700">{data?.title}</h2>
        </div>
        <Select items={selectValue} onValueChange={handleSelectChange}>
          <SelectTrigger size="sm" iconTrigger>
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
            <DialogTitle>목표를 수정하시겠습니까 ?</DialogTitle>
            <Input value={title} onChange={onEditChangeHandler} />
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="ghost" className="w-1/2">
                  취소
                </Button>
              }
            />
            <DialogClose
              render={
                <Button onClick={onEditConfirm} type="button" variant="default" className="w-1/2">
                  확인
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="정말 삭제하시겠어요?"
        description="삭제된 목표는 복구할 수 없습니다."
        onConfirm={handleDelete}
      />
    </>
  );
}
