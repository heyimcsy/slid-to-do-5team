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

// 수정 페이지에서 사용하는 에디터
export function useEditorConfig({ content = '', onUpdate, variant }: UseEditorConfigProps = {}) {
  // stale closure 방지를 위해 onUpdate를 ref로 관리
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

  // 외부에서 content가 변경되면 에디터에 반영
  useEffect(() => {
    if (!editor || editor.getHTML() === content) return;
    editor.commands.setContent(content);
  }, [editor, content]);

  return editor;
}

// 작성페이지에서 사용하는 에디터
// initialContent: 특정 내용으로 시작할 때 사용
export function useEditorWithContent({
  initialContent = '',
  variant,
}: {
  initialContent?: string;
  variant: 'note' | 'post';
}) {
  const [inputContent] = useState(initialContent);
  const [html, setHtml] = useState(initialContent);

  const editor = useEditorConfig({ content: inputContent, onUpdate: setHtml, variant });

  return { editor, html };
}
