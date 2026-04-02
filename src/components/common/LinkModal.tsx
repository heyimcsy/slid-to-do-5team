'use client';

import type { Editor } from '@tiptap/react';

import { useState } from 'react';

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

interface LinkModalProps {
  editor: Editor;
  onClose: () => void;
  onLinkConfirm?: (url: string) => void;
}

export function LinkModal({ editor, onClose, onLinkConfirm }: LinkModalProps) {
  const existingUrl = editor.getAttributes('link').href ?? '';
  const [url, setUrl] = useState(existingUrl);

  const handleConfirm = () => {
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      onClose();
      return;
    }
    editor.chain().focus().setLink({ href: url.trim() }).run();
    onLinkConfirm?.(url.trim()); // ← 부모로 URL 전달
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-86 space-y-4 pt-8 md:w-114" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>링크 업로드</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="링크를 입력해주세요"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
        />
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="ghost" className="w-1/2">
                취소
              </Button>
            }
          />
          <Button onClick={handleConfirm} variant="default" className="w-1/2">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
