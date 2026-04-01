'use client';

import { useIsMobile } from '@/hooks/use-mobile';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface CancelConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CancelConfirmModal({ onConfirm, onCancel }: CancelConfirmModalProps) {
  const isMobile = useIsMobile();

  const content = (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-center text-sm text-gray-600">
        작성 중인 내용이 사라져요.
        <br />
        정말 나가시겠어요?
      </p>
      <div className="flex w-full gap-2">
        <Button size="lg" variant="ghost" className="flex-1" onClick={onCancel}>
          돌아가기
        </Button>
        <Button size="lg" className="flex-1" onClick={onConfirm}>
          나가기
        </Button>
      </div>
    </div>
  );

  return isMobile ? (
    <Drawer
      open
      onOpenChange={(v) => {
        if (!v) onCancel();
      }}
    >
      <DrawerContent className="mb-4 p-6">
        <DrawerHeader className="mb-4 p-0">
          <DrawerTitle className="font-xl-semibold">정말 나가시겠어요?</DrawerTitle>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>정말 나가시겠어요?</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
