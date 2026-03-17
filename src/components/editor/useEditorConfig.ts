import { useEffect, useRef, useState } from 'react';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface UseEditorConfigProps {
  content?: string;
  onUpdate?: (html: string) => void;
  variant?: 'note' | 'post';
}

export function useEditorConfig({ content = '', onUpdate, variant }: UseEditorConfigProps = {}) {
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  });

  const editor = useEditor({
    immediatelyRender: false,
    content,
    editorProps: {
      attributes: {
        class:
          'focus:outline-none max-w-none [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:my-2 [&_li]:my-1',
      },
    },
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ...(variant === 'note' ? [] : [Image]),
      Link.configure({
        openOnClick: false,
        autolink: variant !== 'post',
        linkOnPaste: variant !== 'post',
      }),
    ],
    onUpdate: ({ editor }) => {
      onUpdateRef.current?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === content) return;
    editor.commands.setContent(content);
  }, [editor, content]);

  return editor;
}

export function useEditorWithContent({
  initialContent = '',
  variant,
}: {
  initialContent?: string;
  variant: 'note' | 'post';
}) {
  const [inputContent] = useState(initialContent);
  const [html, setHtml] = useState(initialContent);
  const editor = useEditorConfig({
    content: inputContent,
    onUpdate: setHtml,
    variant,
  });
  return { editor, html };
}
