'use client';

import type { Post } from '../types';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { KebabMenu } from '@/components/common/KebabMenu';

import { formatDate } from '../_utils/formatDate';

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
  const { id, title, content, image, viewCount, createdAt, writer } = post;
  const [imageError, setImageError] = useState(false);
  const [writerImageError, setWriterImageError] = useState(false);
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit],
    content: parseContent(content),
    editable: false,
    immediatelyRender: false,
  });

  const kebabItems = [
    { label: '수정하기', onClick: () => router.push(`/community/${id}/edit`) },
    { label: '삭제하기', onClick: () => {}, variant: 'danger' as const },
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-100 px-4 py-4 md:px-8 md:py-10 lg:p-14">
      <div className="mx-auto w-full md:max-w-[636px] lg:max-w-[768px]">
        <div className="flex items-start gap-2.5 rounded-3xl bg-white px-5 py-6 md:p-10 lg:flex-col lg:items-start lg:gap-14 lg:p-14">
          <div className="w-full">
            <div className="flex items-start justify-between gap-2">
              <h1 className="font-base-semibold md:font-xl-semibold text-gray-800">{title}</h1>
              <KebabMenu items={kebabItems} />
            </div>

            <div className="mt-6 flex items-center gap-1">
              <div className="size-5 shrink-0 overflow-hidden rounded-full bg-gray-200">
                {writer.image && !writerImageError ? (
                  <img
                    src={writer.image}
                    alt={writer.name}
                    className="size-full object-cover"
                    onError={() => setWriterImageError(true)}
                  />
                ) : (
                  <div className="font-xs-regular flex size-full items-center justify-center text-gray-500">
                    {writer.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="font-xs-regular text-gray-500">{writer.name}</span>
            </div>

            <hr className="mt-4 border-gray-200" />

            <EditorContent
              editor={editor}
              className="prose prose-sm md:prose-base prose-headings:font-base-semibold prose-headings:text-gray-800 prose-headings:mt-6 prose-headings:mb-2 prose-strong:font-semibold prose-strong:text-gray-800 prose-ul:pl-5 prose-li:my-0.5 prose-p:leading-5 md:prose-p:leading-6 prose-p:my-2 mt-6 max-w-none text-gray-700"
            />

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
        </div>
      </div>
    </div>
  );
}
