'use client';

import { useState } from 'react';
import Image from 'next/image';
import goalImage from '@/../public/images/small-goal.svg';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Icon } from '@/components/icon/Icon';
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
