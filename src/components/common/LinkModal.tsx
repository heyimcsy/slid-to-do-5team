'use client';

import type { Editor } from '@tiptap/react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

const linkSchema = z.object({
  url: z.string().url({ message: '올바른 링크 형식을 입력해주세요' }),
});

type LinkFormValues = z.infer<typeof linkSchema>;

interface LinkModalProps {
  editor: Editor;
  onClose: () => void;
  onLinkConfirm?: (url: string) => void;
}

export function LinkModal({ editor, onClose, onLinkConfirm }: LinkModalProps) {
  const existingUrl = editor.getAttributes('link').href ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { url: existingUrl },
    mode: 'onSubmit',
  });

  const onSubmit = ({ url }: LinkFormValues) => {
    editor.chain().focus().setLink({ href: url.trim() }).run();
    onLinkConfirm?.(url.trim());
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-86 space-y-4 pt-8 md:w-114" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>링크 업로드</DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          <Input
            autoFocus
            placeholder="링크를 입력해주세요"
            {...register('url')}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          />
          {errors.url && <p className="text-xs text-red-500">{errors.url.message}</p>}
        </div>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="ghost" className="w-1/2">
                취소
              </Button>
            }
          />
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="default"
            className="w-1/2"
            disabled={!isValid}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
