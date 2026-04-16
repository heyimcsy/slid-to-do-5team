'use client';

import type { NoteCommonFormatProps } from '@/app/(routers)/(todo)/goals/[goalId]/notes/types';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePatchNote, usePostNote } from '@/api/notes';
import { NOTES_TEXT } from '@/app/(routers)/(todo)/constants';
import {
  LinkEmbedOgImage,
  NoteEditor,
  NoteFormHeader,
  SaveCheckToast,
} from '@/app/(routers)/(todo)/goals/[goalId]/notes/_components/index';
import SpeechComponent from '@/app/(routers)/(todo)/goals/[goalId]/notes/_components/SpeechComponent';
import { useLinkEmbed } from '@/app/(routers)/(todo)/goals/[goalId]/notes/hooks/useLinkEmbed';
import {
  NOTE_CREATE,
  NOTE_EDIT,
  useNoteDraft,
} from '@/app/(routers)/(todo)/goals/[goalId]/notes/hooks/useNoteDraft';
import { useOgInfo } from '@/app/(routers)/(todo)/goals/[goalId]/notes/hooks/useOgInfo';
import { useEditorWithContent } from '@/hooks/editor';
import { cn } from '@/lib';

import { MobileFormHeader } from '@/components/formHeader/MobileFormHeader';
import { Toolbar } from '@/components/Toolbar';

export default function NoteCommonFormat({
  type,
  noteTitle,
  noteLinkUrl,
  noteContent,
  noteId,
  todoData,
}: NoteCommonFormatProps) {
  const router = useRouter();

  const { mutate: createNote } = usePostNote({
    onSuccess: () => {
      router.back();
    },
  });

  const { mutate: patchNote } = usePatchNote({
    onSuccess: () => {
      router.back();
    },
  });

  const newType = type === 'new';
  const [title, setTitle] = useState<string>(!newType && noteTitle ? noteTitle : '');
  const [titleLength, setTitleLength] = useState<number>(title.length);
  const [linkUrl, setLinkUrl] = useState<string | null>(
    !newType && noteLinkUrl ? noteLinkUrl : null,
  );

  const { data: linkData, isSuccess: linkSuccess } = useOgInfo(linkUrl);

  const { editor, json } = useEditorWithContent({
    variant: 'note',
    placeholder: NOTES_TEXT.NOTE_EDITOR_PLACEHOLDER,
    initialContent: !newType && noteContent ? JSON.stringify(noteContent) : undefined,
  });

  const { showEmbed, handleLinkDelete, handleLinkClick } = useLinkEmbed({
    editor,
    linkData,
    setLinkUrl,
  });

  const { saveCheck, saveDraft, loadDraft, clearDraft, elapsedSeconds } = useNoteDraft({
    type: newType ? 'note-create' : 'note-edit',
    title,
    linkUrl,
    editor,
    setTitle,
    setTitleLength,
    setLinkUrl,
    noteId: newType ? undefined : noteId,
  });

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const titleValue = event.target.value;
    setTitle(titleValue);
    setTitleLength(titleValue.length);
  };

  const handleSubmit = () => {
    if (newType) {
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
    } else {
      if (!noteId) return;
      patchNote({
        id: noteId,
        content: JSON.parse(json),
        title: title,
        linkUrl: linkUrl ?? undefined,
      });
      const raw = localStorage.getItem(`${NOTE_EDIT}-${noteId}`);
      if (raw) {
        clearDraft();
      }
    }
  };

  const toolbar = useMemo(
    () => <Toolbar editor={editor} variant="note" onLinkConfirm={(url) => setLinkUrl(url)} />,
    [editor, linkUrl],
  );

  return (
    <div
      className={cn(
        'h-[calc(100dvh-68px)] min-h-0 w-fit',
        showEmbed && 'w-full flex-col justify-items-center',
      )}
    >
      <MobileFormHeader
        isSubmitDisabled={titleLength === 0}
        onCancel={saveDraft}
        onSubmitClick={handleSubmit}
        headerTitle={NOTES_TEXT.NOTE_CREATE}
        secondaryLabel="임시저장"
        submitLabel="등록"
        toolbar={toolbar}
      />
      <div className="relative flex h-full w-full flex-col items-center p-4 md:w-159 md:pt-12 lg:w-192 lg:pt-18 lg:pb-15.5">
        <NoteFormHeader
          titleLength={titleLength}
          clearDraft={clearDraft}
          loadDraft={loadDraft}
          saveDraft={saveDraft}
          handleSubmit={handleSubmit}
        />
        <NoteEditor
          toolbar={toolbar}
          editor={editor}
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
