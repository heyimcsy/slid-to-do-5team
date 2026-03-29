'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePostNote } from '@/api/notes';
import { useGetTodo } from '@/api/todos';
import {
  LinkEmbedOgImage,
  NewNoteSkeleton,
  NoteEditor,
  NoteFormHeader,
  SaveCheckToast,
  SpeechComponent,
} from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/_components';
import { useLinkEmbed } from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/hooks/useLinkEmbed';
import { useNoteDraft } from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/hooks/useNoteDraft';
import { useOgInfo } from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/hooks/useOgInfo';
import { useEditorWithContent } from '@/hooks/editor';
import { cn } from '@/lib';

export interface NoteDraft {
  title: string;
  content: string;
  linkUrl: string;
  savedAt: string;
}

export default function NewNotePage() {
  const NOTE_CREATE: string = 'note-create';

  const router = useRouter();
  const searchParams = useSearchParams();
  const todoId: number = Number(searchParams.get('todoId'));
  const {
    data: todoData,
    isLoading: todoIsLoading,
    isSuccess: todoIsSuccess,
  } = useGetTodo({ id: todoId });
  const { mutate: createNote } = usePostNote({
    onSuccess: () => {
      router.back();
    },
  });

  const [title, setTitle] = useState<string>('');
  const [titleLength, setTitleLength] = useState<number>(0);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);

  const { data: linkData, isSuccess: linkSuccess } = useOgInfo(linkUrl);

  const { editor, json } = useEditorWithContent({
    variant: 'note',
    placeholder: '이 곳을 통해 노트 작성을 시작해주세요.',
  });

  const { saveCheck, saveDraft, loadDraft, clearDraft, elapsedSeconds } = useNoteDraft({
    title,
    linkUrl,
    editor,
    setTitle,
    setTitleLength,
    setLinkUrl,
  });

  const { showEmbed, handleLinkDelete, handleLinkClick } = useLinkEmbed({
    editor,
    linkData,
    setLinkUrl,
  });

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const titleValue = event.target.value;
    if (titleLength >= 30) return;
    setTitle(titleValue);
    setTitleLength(titleValue.length);
  };

  const handleSubmit = () => {
    if (todoIsSuccess) {
      createNote({
        todoId: todoData?.id,
        title: title,
        content: JSON.parse(json),
        linkUrl: linkUrl ?? undefined,
      });
      const raw = localStorage.getItem(NOTE_CREATE);
      if (raw) {
        clearDraft();
      }
    }
  };

  if (todoIsLoading) return <NewNoteSkeleton />;
  if (todoIsSuccess)
    return (
      <div className={cn('h-full w-fit', showEmbed && 'w-full flex-col justify-items-center')}>
        <div className="relative flex h-full w-full flex-col items-center p-4 md:w-159 md:pt-12 md:pb-7.5 lg:w-192 lg:pt-18 lg:pb-15.5">
          <NoteFormHeader
            titleLength={titleLength}
            clearDraft={clearDraft}
            loadDraft={loadDraft}
            saveDraft={saveDraft}
            handleSubmit={handleSubmit}
          />
          <NoteEditor
            editor={editor}
            setLinkUrl={setLinkUrl}
            title={title}
            onHandleChange={onHandleChange}
            titleLength={titleLength}
            todoData={todoData}
            linkUrl={linkUrl}
            linkData={linkData}
            handleLinkDelete={handleLinkDelete}
            handleLinkClick={handleLinkClick}
          />
        </div>
        <SpeechComponent
          loadDraft={loadDraft}
          clearDraft={clearDraft}
          className="bottom-20 md:hidden"
        />
        <SaveCheckToast saveCheck={saveCheck} elapsedSeconds={elapsedSeconds} />
        <LinkEmbedOgImage
          showEmbed={showEmbed}
          linkUrl={linkUrl}
          linkData={linkData}
          linkSuccess={linkSuccess}
          handleLinkClick={handleLinkClick}
        />
      </div>
    );
}
