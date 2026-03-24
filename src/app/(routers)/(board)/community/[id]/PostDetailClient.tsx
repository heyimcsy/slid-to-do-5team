'use client';

import type { Post } from '../types';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { KebabMenu } from '@/components/common/KebabMenu';

import { formatDate } from '../_utils/formatDate';
import { WriterAvatar } from '../_components/WriterAvatar';
import { CommentSection } from './_components/CommentSection';

interface PostDetailClientProps {
  post: Post;
}

const parseContent = (content: string) => {
  try {
    return JSON.parse(content);
  } catch {
    return { type: 'doc', content: [] };
  }
};

export function PostDetailClient({ post }: PostDetailClientProps) {
  const { id, title, content, image, viewCount, createdAt, writer, commentCount } = post;
  const [imageError, setImageError] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit],
    content: parseContent(content),
    editable: false,
    immediatelyRender: false,
  });

  const kebabItems = [
    { label: '수정하기', onClick: () => router.push(`/community/${id}/edit`) },
    { label: '삭제하기', onClick: () => setDeleteDialogOpen(true), variant: 'danger' as const },
  ];

  return (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="정말 삭제하시겠어요?"
        description="삭제된 게시물은 복구할 수 없습니다."
        onConfirm={() => {
          // TODO: 게시물 삭제 API 연동
        }}
      />
      <div className="h-full w-full overflow-y-auto bg-gray-100 px-4 py-4 md:px-8 md:py-10 lg:p-14">
        <div className="mx-auto w-full md:max-w-[636px] lg:max-w-[768px]">
          <div className="flex flex-col gap-10 rounded-3xl bg-white px-5 py-6 md:gap-14 md:p-10 lg:p-14">
            <div className="w-full">
              <div className="flex items-start justify-between gap-2">
                <h1 className="font-base-semibold md:font-xl-semibold text-gray-800">{title}</h1>
                <KebabMenu items={kebabItems} />
              </div>

              <div className="mt-6 flex items-center gap-1">
                <WriterAvatar name={writer.name} image={writer.image} />
                <span className="font-xs-regular text-gray-500">{writer.name}</span>
              </div>

              <hr className="mt-4 border-gray-200" />

              <EditorContent editor={editor} className="mt-6" />

              {image && !imageError && (
                <div className="mt-6 flex gap-4">
                  <div className="size-[232px] shrink-0 overflow-hidden rounded-[20px] border border-gray-200">
                    <img
                      src={image}
                      alt="게시물 이미지"
                      className="size-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  </div>
                </div>
              )}

              <div className="font-xs-regular mt-4 flex gap-1 text-gray-400">
                <span>{formatDate(createdAt)}</span>
                <span>·</span>
                <span>조회 {viewCount}</span>
              </div>
            </div>

            <CommentSection commentCount={commentCount} />
          </div>
        </div>
      </div>
    </>
  );
}
