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
  onImageUpload?: (file: File) => Promise<string>;
  onImageLimitExceeded?: () => void;
  imageLimit?: number;
}

// 툴바 버튼 목록 및 이미지 업로드 동작을 관리하는 훅
export function useToolbar({
  editor,
  variant,
  onImageUpload,
  onImageLimitExceeded,
  imageLimit = 2,
}: UseToolbarProps) {
  // Tiptap은 자체 상태 관리라 React가 변경을 감지 못함 → forceUpdate로 버튼 활성 상태 동기화
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlsRef = useRef<string[]>([]);
  const isUploadingRef = useRef(false);

  useEffect(() => {
    if (!editor) return;

    const onUpdate = () => {
      forceUpdate();

      // 사용자가 이미지 삭제 시 문서에서 제거된 blob URL 정리
      if (blobUrlsRef.current.length > 0) {
        const docUrls = new Set<string>();

        editor.state.doc.descendants((node) => {
          if (node.type.name === 'image' && node.attrs.src) docUrls.add(node.attrs.src);
        });

        blobUrlsRef.current = blobUrlsRef.current.filter((url) => {
          if (!docUrls.has(url)) {
            URL.revokeObjectURL(url);
            return false;
          }
          return true;
        });
      }
    };

    // 커서 이동 시에도 버튼 활성 상태 동기화
    const onSelectionUpdate = () => forceUpdate();

    editor.on('update', onUpdate);
    editor.on('selectionUpdate', onSelectionUpdate);

    return () => {
      editor.off('update', onUpdate);
      editor.off('selectionUpdate', onSelectionUpdate);
    };
  }, [editor]);

  // 언마운트 시 남아있는 blob URL 일괄 해제
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor || isUploadingRef.current) return;
    isUploadingRef.current = true;

    let url: string | null = null;

    // onImageUpload가 있으면 서버 URL이라 정리 불필요, blob URL일 때만 정리
    const revokeBlob = () => {
      if (onImageUpload || !url) return;
      blobUrlsRef.current = blobUrlsRef.current.filter((u) => u !== url);
      URL.revokeObjectURL(url);
    };

    try {
      let imageCount = 0;
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'image') imageCount++;
      });

      if (imageCount >= imageLimit) {
        onImageLimitExceeded?.();
        return;
      }

      // await 전에 커서 위치 캡처 (비동기 완료 후 selection.to는 stale할 수 있음)
      const insertPos = editor.state.selection.to;

      if (onImageUpload) {
        url = await onImageUpload(file);
        if (!url) return;
      } else {
        url = URL.createObjectURL(file);
        blobUrlsRef.current.push(url);
      }

      const inserted = editor
        .chain()
        .focus()
        .insertContentAt(insertPos, { type: 'image', attrs: { src: url } })
        .run();

      // 삽입 실패 시 blob URL 정리
      if (!inserted) revokeBlob();
    } catch {
      revokeBlob();
    } finally {
      // 성공/실패 무관하게 항상 실행
      e.target.value = '';
      isUploadingRef.current = false;
    }
  };

  const toolbarItems: ToolbarItem[] = !editor
    ? []
    : [
        makeItem('bold', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run()),
        makeItem('italic', editor.isActive('italic'), () =>
          editor.chain().focus().toggleItalic().run(),
        ),
        makeItem('underline', editor.isActive('underlein'), () =>
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
