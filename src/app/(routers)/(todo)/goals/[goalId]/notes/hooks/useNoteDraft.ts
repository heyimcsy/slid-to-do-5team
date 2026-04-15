import type {
  NoteDraft,
  UseNoteDraftProps,
} from '@/app/(routers)/(todo)/goals/[goalId]/notes/types';

import { useEffect, useRef, useState } from 'react';

export const NOTE_CREATE: string = 'note-create';
export const NOTE_EDIT: string = 'note-edit';
export const useNoteDraft = ({
  type,
  title,
  linkUrl,
  editor,
  setTitle,
  setTitleLength,
  setLinkUrl,
  noteId,
}: UseNoteDraftProps) => {
  const [saveCheck, setSaveCheck] = useState<boolean>(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // 로컬스토리지에서 값을 불러오는 함수
  const loadDraft = () => {
    let raw;
    if (type === NOTE_CREATE) {
      raw = localStorage.getItem(NOTE_CREATE);
    } else {
      raw = localStorage.getItem(`${NOTE_EDIT}-${noteId}`);
    }
    if (!raw) return;

    const draft = JSON.parse(raw) as NoteDraft;
    setTitle(draft.title);
    setTitleLength(draft.title.length);
    editor?.commands.setContent(JSON.parse(draft.content));
    if (draft.linkUrl) setLinkUrl(draft.linkUrl);
  };

  // 로컬스토리지에서 값을 삭제하는 함수
  const clearDraft = () => {
    if (type === NOTE_CREATE) {
      localStorage.removeItem(NOTE_CREATE);
    } else {
      localStorage.removeItem(`${NOTE_EDIT}-${noteId}`);
    }
  };

  // 로컬스토리지에 값을 저장하는 함수
  const saveDraft = () => {
    const EMPTY_CONTENT =
      '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null}}]}';

    const isEmpty: boolean =
      !title.trim() && !linkUrl?.trim() && JSON.stringify(editor?.getJSON()) === EMPTY_CONTENT;

    if (isEmpty) return; // 저장 안 함
    const now = new Date();
    const draft: NoteDraft = {
      title,
      content: JSON.stringify(editor?.getJSON()),
      linkUrl: linkUrl ?? '',
      savedAt: now.toISOString(),
    };
    if (type === NOTE_CREATE) {
      localStorage.setItem(NOTE_CREATE, JSON.stringify(draft));
    } else {
      localStorage.setItem(`${NOTE_EDIT}-${noteId}`, JSON.stringify(draft));
    }

    setSavedAt(now);
    setSaveCheck(true);
    setElapsedSeconds(0);
  };
  // 임시저장 버튼 누르고 하단에서 올라오는 *초전 표시 토스트
  useEffect(() => {
    if (!savedAt) return;

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - savedAt.getTime()) / 1000);

      if (seconds >= 5) {
        setSaveCheck(false);
        setSavedAt(null);
        clearInterval(interval);
        return;
      }

      setElapsedSeconds(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [savedAt]);

  const saveDraftRef = useRef(saveDraft);
  useEffect(() => {
    saveDraftRef.current = saveDraft;
  }, [saveDraft]);

  useEffect(() => {
    const interval = setInterval(() => saveDraftRef.current(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDraftRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { saveDraft, loadDraft, clearDraft, saveCheck, elapsedSeconds };
};
