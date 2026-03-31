'use client';

import type { Editor } from '@tiptap/react';

import { useEffect, useState } from 'react';
import { useEditorConfig } from '@/hooks/editor';

const isEditorFilled = (editor: Editor) => !editor.isEmpty && editor.getText().trim().length > 0;

interface UsePostEditorOptions {
  initialContent?: string;
}

export function usePostEditor({ initialContent }: UsePostEditorOptions = {}) {
  const editor = useEditorConfig({
    content: initialContent,
    variant: 'post',
    placeholder: '이 곳을 통해 내용을 작성해주세요',
  });

  const [hasEditorContent, setHasEditorContent] = useState(false);
  const [contentText, setContentText] = useState('');

  useEffect(() => {
    if (!editor) return;
    setHasEditorContent(isEditorFilled(editor));
    setContentText(editor.getText());

    const onUpdate = () => {
      setHasEditorContent(isEditorFilled(editor));
      setContentText(editor.getText());
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
    contentText,
    charCountWithoutSpaces,
  };
}
