'use client';

import type { Tags } from './_components/TodoDetailContent';

import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';

import { TodoDetailContent } from './_components/TodoDetailContent';

const tags: Tags[] = [
  { name: '코딩', color: 'green' },
  { name: '자기계발', color: 'yellow' },
  { name: '공부', color: 'red' },
];

// 임시 mock — 나중에 params.goalId로 API 호출
const mockData = {
  id: 1,
  title: '자바스크립트 기초 챕터3 듣기',
  status: 'TO DO' as const,
  goalTitle: '자바스크립트로 웹 서비스 만들기',
  deadline: '2024. 04. 29',
  tags: tags,
  attachmentUrl: 'https://www.codeit.kr',
  noteTitle: '프로그래밍과 데이터 in JavaScript',
  image: '/images/url-image.png',
};

export default function GoalDetailModal() {
  const router = useRouter();
  const isMd = useMediaQuery('(min-width: 768px)');
  const onClose = () => router.back();

  if (isMd === undefined) return null;
  if (isMd) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="w-[456px] rounded-[40px] p-10 shadow-[0_0_60px_0_rgba(0,0,0,0.05)]">
          <DialogTitle className="sr-only">할 일 상세 보기</DialogTitle>
          <TodoDetailContent {...mockData} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open onOpenChange={onClose}>
      <DrawerContent className="min-w-[311px] rounded-t-[32px] p-8 shadow-[0_0_60px_0_rgba(0,0,0,0.05)]">
        <div>
          <DrawerTitle className="sr-only">할 일 상세 보기</DrawerTitle>
          <Button variant="icon" size="none" className="absolute right-8" onClick={onClose}>
            <Icon name="close" color="gray" size={24} />
          </Button>
          <TodoDetailContent {...mockData} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
