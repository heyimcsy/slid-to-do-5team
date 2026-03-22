'use client';

import { useState } from 'react';
import Image from 'next/image';
import goalImage from '@/../public/images/small-goal.svg';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

export default function GoalsTab() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const selectValue = [
    { label: '수정하기', value: 'edit' },
    { label: '삭제하기', value: 'delete' },
  ];

  const handleSelectChange = (value: string | null) => {
    if (value === null) return;
    if (value === 'delete') {
      // '삭제하기'의 value
      setDeleteDialogOpen(true);
    }
    // '수정하기'는 여기서 추가 처리
  };

  const handleDelete = () => {
    // 실제 삭제 로직
    setDeleteDialogOpen(false);
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
          <h2 className="font-base-semibold text-gray-700">자바스크립트로 웹 서비스 만들기</h2>
        </div>
        <Select items={selectValue} onValueChange={handleSelectChange}>
          <SelectTrigger size="sm" iconTrigger>
            <Icon name="more" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {selectValue.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-86 space-y-8 pt-8 md:w-114 md:space-y-10 md:pt-8"
        >
          <DialogHeader>
            <DialogTitle>정말 삭제하시겠어요?</DialogTitle>
            <DialogDescription className="font-xs-regular md:font-base-regular flex items-center text-orange-600">
              <Icon name={'warning'} variant={'orange'} size={18} />
              삭제된 목표는 복구할 수 없습니다.
            </DialogDescription>
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
                <Button onClick={handleDelete} type="button" variant="default" className="w-1/2">
                  확인
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
