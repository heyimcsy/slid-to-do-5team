import { useEffect, useRef, useState } from 'react';
import { CharacterCount } from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface UseEditorConfigProps {
  content?: string;
  onUpdate?: (json: string) => void;
  variant?: 'note' | 'post';
  placeholder?: string;
  limit?: number;
}

// 수정 페이지에서 사용하는 에디터
export function useEditorConfig({
  content = '',
  onUpdate,
  variant,
  placeholder,
  limit,
}: UseEditorConfigProps = {}) {
  // stale closure 방지를 위해 onUpdate를 ref로 관리
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  });

  const editor = useEditor({
    immediatelyRender: false,
    content: content ? JSON.parse(content) : '', // ✅ JSON 문자열이면 파싱해서 넣기
    editorProps: {
      attributes: {
        class:
          'focus:outline-none max-w-none [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:my-2 [&_li]:my-1',
      },
    },
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ...(variant === 'note' ? [] : [Image]),
      Link.configure({
        openOnClick: false,
        autolink: variant !== 'post',
        linkOnPaste: variant !== 'post',
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      ...(limit ? [CharacterCount.configure({ limit })] : []),
    ],
    onUpdate: ({ editor }) => {
      onUpdateRef.current?.(JSON.stringify(editor.getJSON())); // ✅ 문자열로 직렬화
    },
  });

  // 외부에서 content가 변경되면 에디터에 반영
  useEffect(() => {
    if (!editor || !content) return;
    const current = JSON.stringify(editor.getJSON());
    if (current === content) return;
    editor.commands.setContent(JSON.parse(content));
  }, [editor, content]);

  return editor;
}
// 작성페이지에서 사용하는 에디터

export function useEditorWithContent({
  initialContent = '',
  variant,
  placeholder,
}: {
  initialContent?: string;
  variant: 'note' | 'post';
  placeholder?: string;
}) {
  const [inputContent] = useState(initialContent);
  const [json, setJson] = useState(initialContent); // html → json으로 이름 변경

  const editor = useEditorConfig({
    content: inputContent,
    onUpdate: setJson, // JSON 문자열이 들어옴
    variant,
    placeholder,
  });

  return { editor, json };
}
