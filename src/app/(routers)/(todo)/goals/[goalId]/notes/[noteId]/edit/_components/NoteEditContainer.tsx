'use client';

import type { NoteEditContainerProps } from '@/app/(routers)/(todo)/goals/[goalId]/notes/types';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetNote, usePatchNote } from '@/api/notes';
import { NOTES_TEXT } from '@/app/(routers)/(todo)/constants';
import {
  LinkEmbedOgImage,
  NoteEditor,
  NoteFormHeader,
  SaveCheckToast,
} from '@/app/(routers)/(todo)/goals/[goalId]/notes/_components';
import SpeechComponent from '@/app/(routers)/(todo)/goals/[goalId]/notes/_components/SpeechComponent';
import { useLinkEmbed } from '@/app/(routers)/(todo)/goals/[goalId]/notes/hooks/useLinkEmbed';
import {
  NOTE_EDIT,
  useNoteDraft,
} from '@/app/(routers)/(todo)/goals/[goalId]/notes/hooks/useNoteDraft';
import { useOgInfo } from '@/app/(routers)/(todo)/goals/[goalId]/notes/hooks/useOgInfo';
import { useEditorWithContent } from '@/hooks/editor';
import { cn } from '@/lib';

export default function NoteEditContainer({ noteId }: NoteEditContainerProps) {
  const router = useRouter();
  const { data, isSuccess } = useGetNote({ id: noteId });
  const { mutate } = usePatchNote({
    onSuccess: () => {
      router.back();
    },
  });

  const [title, setTitle] = useState<string>(data?.title ?? '');
  const [titleLength, setTitleLength] = useState<number>(0);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const { editor, json } = useEditorWithContent({
    variant: 'note',
    placeholder: NOTES_TEXT.NOTE_EDITOR_PLACEHOLDER,
    initialContent: data ? JSON.stringify(data.content) : '',
  });
  const { data: linkData, isSuccess: linkSuccess } = useOgInfo(linkUrl);
  const { showEmbed, handleLinkDelete, handleLinkClick } = useLinkEmbed({
    editor,
    linkData,
    setLinkUrl,
  });
  const { saveCheck, saveDraft, loadDraft, clearDraft, elapsedSeconds } = useNoteDraft({
    type: 'note-edit',
    title,
    linkUrl,
    editor,
    setTitle,
    setTitleLength,
    setLinkUrl,
    noteId,
  });

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const titleValue = event.target.value;
    setTitle(titleValue);
    setTitleLength(titleValue.length);
  };
  const handleSubmit = () => {
    mutate({
      id: noteId,
      content: JSON.parse(json),
      title: title,
      linkUrl: linkUrl ?? undefined,
    });
    const raw = localStorage.getItem(`${NOTE_EDIT}-${noteId}`);
    if (raw) {
      clearDraft();
    }
  };

  if (isSuccess)
    return (
      <div className={cn('h-full w-fit', showEmbed && 'w-full flex-col justify-items-center')}>
        <div className="relative flex h-full w-full flex-col items-center p-4 md:w-159 md:pt-12 md:pb-7.5 lg:w-192 lg:pt-18 lg:pb-15.5">
          <NoteFormHeader
            titleLength={titleLength}
            clearDraft={clearDraft}
            loadDraft={loadDraft}
            saveDraft={saveDraft}
            handleSubmit={handleSubmit}
            edit
            noteId={noteId}
          />
          <NoteEditor
            editor={editor}
            setLinkUrl={setLinkUrl}
            title={title}
            onHandleChange={onHandleChange}
            titleLength={titleLength}
            todoData={data.todo}
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
          edit
          noteId={noteId}
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
