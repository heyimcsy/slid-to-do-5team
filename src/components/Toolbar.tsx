'use client';

import { useToolbar } from '@/hooks/editor';
import { cn } from '@/lib';
import { type Editor } from '@tiptap/react';

import { LinkModal } from '@/components/common/LinkModal';

interface ToolbarProps {
  editor: Editor | null;
  variant: 'note' | 'post';
  onImageSelected?: (file: File) => void;
  onImageLimitExceeded?: () => void;
  imageLimit?: number;
  onLinkConfirm?: (url: string) => void;
  externalImageCount?: number;
}

export function Toolbar({
  editor,
  variant,
  onImageSelected,
  onImageLimitExceeded,
  imageLimit = 2,
  onLinkConfirm,
  externalImageCount = 0,
}: ToolbarProps) {
  const { toolbarItems, fileInputRef, handleFileChange, showLinkModal, setShowLinkModal } =
    useToolbar({
      editor,
      variant,
      onImageSelected,
      onImageLimitExceeded,
      imageLimit,
      externalImageCount,
    });

  if (!editor) return null;

  return (
    <div
      role="toolbar"
      aria-label="텍스트 서식"
      className="relative flex h-[44px] w-full max-w-[700px] flex-row items-center gap-1 rounded-[18px] bg-[var(--gray-50)] px-[16px] py-[6px] md:gap-1.5"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {toolbarItems.map((item, i) =>
        item.type === 'gap' ? (
          <div key={`gap-${i}`} className="w-3" />
        ) : (
          <button
            key={item.name}
            type="button"
            aria-label={item.name}
            onClick={item.onClick}
            className={cn(
              'size-8 cursor-pointer rounded-lg p-[6px]',
              item.isActive ? 'bg-gray-200' : 'hover:bg-gray-100',
            )}
          >
            {item.label}
          </button>
        ),
      )}
      {showLinkModal && (
        <LinkModal
          editor={editor}
          onClose={() => setShowLinkModal(false)}
          onLinkConfirm={onLinkConfirm}
        />
      )}
    </div>
  );
}
