'use client';

import { cn } from '@/lib';
import { type Editor } from '@tiptap/react';

import { useToolbar } from './useToolbar';

interface ToolbarProps {
  editor: Editor | null;
  variant: 'note' | 'post';
  onImageUpload?: (file: File) => Promise<string>;
  onImageLimitExceeded?: () => void;
  imageLimit?: number;
}

export function Toolbar({
  editor,
  variant,
  onImageUpload,
  onImageLimitExceeded,
  imageLimit = 2,
}: ToolbarProps) {
  const { toolbarItems, fileInputRef, handleFileChange } = useToolbar({
    editor,
    variant,
    onImageUpload,
    onImageLimitExceeded,
    imageLimit,
  });

  if (!editor) return null;

  return (
    <div
      role="toolbar"
      aria-label="텍스트 서식"
      className="relative flex h-[44px] w-full max-w-[700px] flex-row items-center gap-1.5 rounded-[18px] bg-[var(--gray-50)] px-[16px] py-[6px]"
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

      {/* <LinkModal open={showLinkModal} onClose={() => setShowLinkModal(false)} editor={editor} /> */}
    </div>
  );
}
