'use client';

import type { NoteDraft } from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/page';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import speechBubble from '@/../public/images/speech-bubble.svg';
import { cn } from '@/lib';

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

export default function SpeechComponent({
  loadDraft,
  clearDraft,
  className,
}: {
  loadDraft: () => void;
  clearDraft: () => void;
  className?: string;
}) {
  const NOTE_CREATE: string = 'note-create';

  const raw = localStorage.getItem(NOTE_CREATE);

  const [showDraftBubble, setShowDraftBubble] = useState(() => {
    if (!raw) return false;
    const draft = JSON.parse(raw) as NoteDraft;

    const hasTitle = !!draft.title;
    const hasLink = !!draft.linkUrl;
    const hasContent = (() => {
      try {
        const parsed = JSON.parse(draft.content);

        const firstBlock = parsed?.content?.[0];
        return !!(firstBlock?.content?.length > 0);
      } catch {
        return false;
      }
    })();

    return hasTitle || hasLink || hasContent;
  });

  const [title] = useState(() => {
    if (!raw) return '';
    const draft = JSON.parse(raw) as NoteDraft;
    return `'${draft.title}'`;
  });
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLoadClick = () => {
    setIsLoadingDraft(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (!showDraftBubble || isLoadingDraft) return;
    timerRef.current = setTimeout(() => {
      setShowDraftBubble(false);
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showDraftBubble, isLoadingDraft]);

  return (
    <>
      {showDraftBubble && (
        <div className={cn('absolute z-1 h-39 w-83', className)}>
          <div className="relative">
            <Image src={speechBubble} alt="말풍선" height={156} width={332} className="absolute" />
            <div className="font-sm-medium relative top-8 left-8 z-2 px-5 py-6">
              <p>임시 저장된 노트가 있어요.</p>
              <p>저장된 노트를 불러오시겠어요?</p>
              <Dialog>
                <DialogTrigger
                  className="font-sm-semibold mt-2 cursor-pointer text-orange-500"
                  onClick={handleLoadClick}
                >
                  불러오기
                </DialogTrigger>
                <DialogContent className="max-w-[343px] md:max-w-139" showCloseButton={false}>
                  <DialogHeader className="mt-8">
                    <DialogTitle className="text-gray-800">{title}</DialogTitle>
                    <DialogDescription className="font-sm-semibold md:font-xl-semibold text-gray-800">
                      제목의 노트를 불러오시겠어요?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-10">
                    <DialogClose
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-1/2"
                          onClick={() => {
                            clearDraft();
                            setShowDraftBubble(false);
                          }}
                        >
                          취소
                        </Button>
                      }
                    />
                    <DialogClose
                      render={
                        <Button
                          onClick={() => {
                            loadDraft();
                            setShowDraftBubble(false);
                          }}
                          type="button"
                          variant="default"
                          className="w-1/2"
                        >
                          불러오기
                        </Button>
                      }
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
