'use client';

import type { Editor } from '@tiptap/react';

import { useEffect, useState } from 'react';
import { useEditorConfig } from '@/hooks/editor';

const isEditorFilled = (editor: Editor) => !editor.isEmpty && editor.getText().trim().length > 0;

interface UsePostEditorOptions {
  initialContent?: string;
  limit?: number;
}

export function usePostEditor({ initialContent, limit }: UsePostEditorOptions = {}) {
  const editor = useEditorConfig({
    content: initialContent,
    variant: 'post',
    placeholder: '이 곳을 통해 내용을 작성해주세요',
    limit,
  });

  const [hasEditorContent, setHasEditorContent] = useState(false);
  const [contentText, setContentText] = useState('');
  const [hasEditorChanged, setHasEditorChanged] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (!editor) return;
    setHasEditorContent(isEditorFilled(editor));
    setContentText(editor.getText());

    const onUpdate = () => {
      setHasEditorContent(isEditorFilled(editor));
      setContentText(editor.getText());
      setCharCount(editor.storage.characterCount?.characters() ?? editor.getText().length);
      setHasEditorChanged(true);
    };
    editor.on('update', onUpdate);
    return () => {
      editor.off('update', onUpdate);
    };
  }, [editor]);

  const charCountWithoutSpaces = contentText.replace(/\s/g, '').length;

  return {
    editor,
    hasEditorContent,
    hasEditorChanged,
    charCountWithoutSpaces,
    charCount,
  };
}
