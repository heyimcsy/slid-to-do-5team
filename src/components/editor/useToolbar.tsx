'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { type Editor } from '@tiptap/react';

import { Icon } from '../icon/Icon';

type IconName = Parameters<typeof Icon>[0]['name'];

const TOOLBAR_CONFIG = {
  note: { showLink: true, showImage: false },
  post: { showLink: false, showImage: true },
};

const ALIGN_ICON = {
  left: 'alignLeft',
  center: 'alignCenter',
  right: 'alignRight',
} as const;

export type ToolbarItem =
  | { type: 'gap' }
  | { type?: never; name: string; label: React.ReactNode; onClick: () => void; isActive: boolean };

interface UseToolbarProps {
  editor: Editor | null;
  variant: 'note' | 'post';
  onImageUpload?: (file: File) => Promise<string>;
  onImageLimitExceeded?: () => void;
}

export function useToolbar({
  editor,
  variant,
  onImageUpload,
  onImageLimitExceeded,
}: UseToolbarProps) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!editor) return;

    const handler = () => forceUpdate();
    editor.on('update', handler);
    editor.on('selectionUpdate', handler);

    return () => {
      editor.off('update', handler);
      editor.off('selectionUpdate', handler);
    };
  }, [editor]);

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const { showLink, showImage } = editor
    ? TOOLBAR_CONFIG[variant]
    : { showLink: false, showImage: false };

  const makeItem = (name: IconName, isActive: boolean, onClick: () => void): ToolbarItem => ({
    name,
    label: <Icon name={name} size={20} variant={isActive ? 'filled' : 'default'} />,
    onClick,
    isActive,
  });

  const makeAlignItem = (dir: 'left' | 'center' | 'right'): ToolbarItem =>
    makeItem(ALIGN_ICON[dir], editor?.isActive({ textAlign: dir }) ?? false, () =>
      editor?.isActive({ textAlign: dir })
        ? editor.chain().focus().unsetTextAlign().run()
        : editor?.chain().focus().setTextAlign(dir).run(),
    );

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    let imageCount = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image') imageCount++;
    });

    if (imageCount >= 2) {
      onImageLimitExceeded?.();
      e.target.value = '';
      return;
    }

    let url: string | null = null;

    try {
      if (onImageUpload) {
        url = await onImageUpload(file);
      } else {
        url = URL.createObjectURL(file);
        blobUrlsRef.current.push(url);
      }
      editor
        .chain()
        .focus()
        .insertContentAt(editor.state.selection.to, { type: 'image', attrs: { src: url } })
        .run();
    } catch {
      if (!onImageUpload && url) {
        blobUrlsRef.current = blobUrlsRef.current.filter((u) => u !== url);
        URL.revokeObjectURL(url);
      }
    } finally {
      e.target.value = '';
    }
  };

  const toolbarItems: ToolbarItem[] = !editor
    ? []
    : [
        makeItem('bold', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run()),
        makeItem('italic', editor.isActive('italic'), () =>
          editor.chain().focus().toggleItalic().run(),
        ),
        makeItem('underline', editor.isActive('underline'), () =>
          editor.chain().focus().toggleUnderline().run(),
        ),
        { type: 'gap' },
        makeAlignItem('left'),
        makeAlignItem('center'),
        makeAlignItem('right'),
        makeItem('list', editor.isActive('bulletList'), () =>
          editor.chain().focus().toggleBulletList().run(),
        ),
        { type: 'gap' },
        ...(showImage ? [makeItem('image', false, handleImageClick)] : []),
        ...(showLink
          ? [makeItem('linkEditor', editor.isActive('link'), () => setShowLinkModal(true))]
          : []),
      ];

  return { toolbarItems, showLinkModal, setShowLinkModal, fileInputRef, handleFileChange };
}
