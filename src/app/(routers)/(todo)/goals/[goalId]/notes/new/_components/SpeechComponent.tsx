'use client';

import type { NoteDraft } from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/page';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import speechBubble from '@/../public/images/speech-bubble.svg';
import { NOTE_CREATE, NOTES_TEXT, SPEECH_BUBBLE_IMAGE } from '@/app/(routers)/(todo)/constants';
import { cn } from '@/lib';

import { BUTTON_LABEL, DIALOG_VALUE } from '@/constants/ui-label';

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
            <Image
              src={speechBubble}
              alt={SPEECH_BUBBLE_IMAGE.ALT}
              height={SPEECH_BUBBLE_IMAGE.HEIGHT}
              width={SPEECH_BUBBLE_IMAGE.WIDTH}
              className="absolute"
            />
            <div className="font-sm-medium relative top-8 left-8 z-2 px-5 py-6 text-gray-600">
              <p>{NOTES_TEXT.SAVED_DATA}</p>
              <p>{NOTES_TEXT.SAVED_DATA_LOAD}</p>
              <div className="flex h-fit w-full space-x-4">
                <Dialog>
                  <DialogTrigger
                    className="font-sm-semibold mt-2 cursor-pointer text-blue-200"
                    onClick={handleLoadClick}
                  >
                    {NOTES_TEXT.LOAD}
                  </DialogTrigger>
                  <DialogContent className="max-w-[343px] md:max-w-139" showCloseButton={false}>
                    <DialogHeader className="mt-8">
                      <DialogTitle className="text-gray-800">{title}</DialogTitle>
                      <DialogDescription className="font-sm-semibold md:font-xl-semibold text-gray-800">
                        {NOTES_TEXT.LOAD_DIALOG}
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
                            {DIALOG_VALUE.BUTTON.CANCEL}
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
                            {NOTES_TEXT.LOAD}
                          </Button>
                        }
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="icon"
                  size="none"
                  className="font-sm-semibold mt-2 cursor-pointer text-orange-500"
                  onClick={() => {
                    clearDraft();
                    setShowDraftBubble(false);
                  }}
                >
                  {BUTTON_LABEL.DELETE}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
