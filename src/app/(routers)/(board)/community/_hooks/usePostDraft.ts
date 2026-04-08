'use client';

import type { Editor } from '@tiptap/react';
import type { UseFormSetValue } from 'react-hook-form';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const POST_CREATE = 'post-create';

interface PostDraft {
  title: string;
  content: string;
  savedAt: string;
}

type PostDraftFormValues = {
  title: string;
  charCount: number;
};

interface UsePostDraftProps {
  mode: 'create' | 'edit';
  titleValue: string;
  editor: Editor | null;
  setValue: UseFormSetValue<PostDraftFormValues>;
}

export function usePostDraft({ mode, titleValue, editor, setValue }: UsePostDraftProps) {
  const isCreateMode = mode === 'create';

  const hasDraft = () => !!localStorage.getItem(POST_CREATE);

  const loadDraft = () => {
    const raw = localStorage.getItem(POST_CREATE);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as PostDraft;
      setValue('title', draft.title);
      editor?.commands.setContent(JSON.parse(draft.content));
    } catch {
      clearDraft();
      toast.error('임시저장 데이터가 손상되어 불러올 수 없습니다.');
    }
  };

  const clearDraft = () => localStorage.removeItem(POST_CREATE);

  const saveDraft = () => {
    if (!isCreateMode || !editor) return;

    const content = JSON.stringify(editor.getJSON());
    const isEmpty = !titleValue.trim() && editor.isEmpty;
    if (isEmpty) return;

    const draft: PostDraft = {
      title: titleValue,
      content,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(POST_CREATE, JSON.stringify(draft));
    toast.success('게시글이 임시저장되었습니다.', { id: 'post-create' });
  };

  const saveDraftRef = useRef(saveDraft);
  useEffect(() => {
    saveDraftRef.current = saveDraft;
  }, [saveDraft]);

  useEffect(() => {
    if (!isCreateMode) return;
    const interval = setInterval(() => saveDraftRef.current(), 180 * 1000);
    return () => clearInterval(interval);
  }, [isCreateMode]);

  useEffect(() => {
    if (!isCreateMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDraftRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateMode]);

  return { saveDraft, loadDraft, clearDraft, hasDraft };
}
