'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { type Editor } from '@tiptap/react';

import { Icon } from '@/components/icon/Icon';

type IconName = Parameters<typeof Icon>[0]['name'];

// variant별 툴바 버튼 표시 여부
const TOOLBAR_CONFIG = {
  note: { showLink: true, showImage: false },
  post: { showLink: false, showImage: true },
};

// 정렬 방향 → 아이콘 이름 매핑
const ALIGN_ICON = {
  left: 'alignLeft',
  center: 'alignCenter',
  right: 'alignRight',
} as const;

export type ToolbarItem =
  | { type: 'gap' }
  | {
      type: 'button';
      name: string;
      label: React.ReactNode;
      onClick: () => void;
      isActive: boolean;
    };

interface UseToolbarProps {
  editor: Editor | null;
  variant: 'note' | 'post';
  onImageSelected?: (file: File) => void;
  onImageLimitExceeded?: () => void;
  imageLimit?: number;
  externalImageCount?: number;
}

// 툴바 버튼 목록 및 이미지 업로드 동작을 관리하는 훅
export function useToolbar({
  editor,
  variant,
  onImageSelected,
  onImageLimitExceeded,
  imageLimit = 2,
  externalImageCount = 0,
}: UseToolbarProps) {
  // Tiptap은 자체 상태 관리라 React가 변경을 감지 못함 → forceUpdate로 버튼 활성 상태 동기화
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editor) return;

    const onUpdate = () => forceUpdate();
    const onSelectionUpdate = () => forceUpdate();

    editor.on('update', onUpdate);
    editor.on('selectionUpdate', onSelectionUpdate);

    return () => {
      editor.off('update', onUpdate);
      editor.off('selectionUpdate', onSelectionUpdate);
    };
  }, [editor]);

  // editor가 null이면 버튼 숨김
  const { showLink, showImage } = editor
    ? TOOLBAR_CONFIG[variant]
    : { showLink: false, showImage: false };

  // 버튼 아이템 생성 헬퍼 (활성 상태에 따라 아이콘 variant 변경)
  const makeItem = (name: IconName, isActive: boolean, onClick: () => void): ToolbarItem => ({
    type: 'button',
    name,
    label: <Icon name={name} size={20} variant={isActive ? 'filled' : 'default'} />,
    onClick,
    isActive,
  });

  // 정렬 버튼 생성 (이미 활성화된 정렬이면 토글 해제)
  const makeAlignItem = (dir: 'left' | 'center' | 'right'): ToolbarItem =>
    makeItem(ALIGN_ICON[dir], editor?.isActive({ textAlign: dir }) ?? false, () =>
      editor?.isActive({ textAlign: dir })
        ? editor.chain().focus().unsetTextAlign().run()
        : editor?.chain().focus().setTextAlign(dir).run(),
    );

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (externalImageCount >= imageLimit) {
      onImageLimitExceeded?.();
    } else {
      onImageSelected?.(file);
    }

    e.target.value = '';
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
