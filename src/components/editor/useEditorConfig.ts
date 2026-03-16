import { useEffect, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

interface UseEditorConfigProps {
  content?: string;
  onUpdate?: (html: string) => void;
}

export function useEditorConfig({ content = '', onUpdate }: UseEditorConfigProps = {}) {
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
      Image,
      Link.configure({ openOnClick: false }),
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
