'use client';

import Image from 'next/image';
import Link from 'next/link';
import imgNote from '@/../public/images/img-note.svg';
import { cn } from '@/lib';

import { Chips } from '@/components/common/Chips';
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
  DialogTrigger,
} from '@/components/ui/dialog';

interface NoteCardProps {
  id: number;
  title: string;
  todoTitle: string;
  isDone: boolean;
  updatedAt: string; // 'YYYY.MM.DD'
}

export default function NoteCard({ id, title, todoTitle, isDone, updatedAt }: NoteCardProps) {
  return (
    <Link
      // href={`/goals/${goalId}/notes/${id}`}
      href={`/goals/1/notes/${id}`}
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
            alt="노트 이미지"
            width={40}
            height={40}
            className="size-8 lg:size-10"
          />

          {/* 중단: 노트 제목 */}
          <p className="font-sm-semibold md:font-xl-semibold line-clamp-2 text-gray-800">{title}</p>
        </div>
        {/*컴포넌트로 빼기*/}
        <div
          onClick={(e) => {
            e.stopPropagation(); // 부모로 전파 중지
            e.preventDefault(); // 링크 이동 중지
          }}
        >
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="icon"
                  size="none"
                  className="hover:bg-orange-800"
                  aria-label="더보기"
                >
                  <Icon name="dotscircle" size={24} />
                </Button>
              }
            />
            <DialogContent
              showCloseButton={false}
              className="w-86 space-y-8 pt-8 md:w-114 md:space-y-10 md:pt-8"
            >
              <DialogHeader>
                <DialogTitle>정말 삭제하시겠어요?</DialogTitle>
                <DialogDescription className="font-xs-regular md:font-base-regular flex items-center text-orange-600">
                  <Icon name={'warning'} variant={'orange'} size={18} />
                  삭제된 노트는 복구할 수 없습니다.
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
                    <Button type="button" variant="default" className="w-1/2">
                      확인
                    </Button>
                  }
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* 하단: 뱃지 + 할일 제목 + 날짜 */}
      <div className="flex h-5 items-center justify-between md:h-5.5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Chips variant={isDone ? 'done' : 'todo'} />
          <p className="font-xs-regular md:font-sm-regular truncate text-gray-600">{todoTitle}</p>
        </div>
        <p className="font-xs-regular text-right text-gray-400">{updatedAt}</p>
      </div>
    </Link>
  );
}
