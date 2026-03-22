'use client';

import type { Post } from '../types';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { KebabMenu } from '@/components/common/KebabMenu';

import { formatDate } from '../_utils/formatDate';

interface PostDetailClientProps {
  post: Post;
}

export function PostDetailClient({ post }: PostDetailClientProps) {
  const { id, title, content, image, viewCount, createdAt, writer } = post;
  const [imageError, setImageError] = useState(false);
  const [writerImageError, setWriterImageError] = useState(false);
  const router = useRouter();

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
              <h1 className="font-base-semibold md:font-xl-semibold text-gray-700">{title}</h1>
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

            <p className="font-sm-regular mt-6 whitespace-pre-wrap text-gray-700">{content}</p>

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
