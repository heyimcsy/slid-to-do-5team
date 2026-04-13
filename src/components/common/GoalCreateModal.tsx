'use client';

import React from 'react';
import { usePostGoals } from '@/api/goals';
import { useIsMobile } from '@/hooks/use-mobile';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { Input } from '../ui/input';

interface GoalCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GoalCreateModal({ isOpen, onClose, onSuccess }: GoalCreateModalProps) {
  const isMobile = useIsMobile();
  const [goalInput, setGoalInput] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { mutate: postGoal, isPending } = usePostGoals({
    onSuccess: () => {
      setGoalInput('');
      onClose();
      onSuccess?.();
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      setGoalInput('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (goalInput.trim()) {
      postGoal({ title: goalInput.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') handleSubmit();
  };

  const content = (
    <div className="flex flex-col gap-4 py-2">
      <Input
        ref={inputRef}
        type="text"
        value={goalInput}
        onChange={(e) => setGoalInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="목표 이름을 입력하세요"
      />
      <div className="flex w-full gap-2">
        <Button size="lg" variant="ghost" className="flex-1" onClick={onClose} disabled={isPending}>
          취소
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={handleSubmit}
          disabled={!goalInput.trim() || isPending}
        >
          {isPending ? '생성 중...' : '만들기'}
        </Button>
      </div>
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="p-6 [&>button]:hidden">
        <DrawerHeader className="mb-4 p-0">
          <DrawerTitle className="font-xl-semibold">새 목표 만들기</DrawerTitle>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader className="mb-4">
          <DialogTitle>새 목표 만들기</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
