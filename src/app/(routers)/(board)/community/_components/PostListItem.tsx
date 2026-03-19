'use client';

import { useState } from 'react';
import Link from 'next/link';

import type { Post } from '../types';

import { PostMeta } from './PostMeta';

interface PostListItemProps {
  post: Post;
}

export function PostListItem({ post }: PostListItemProps) {
  const { id, title, content, image } = post;
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/community/${id}`}
      className="flex w-full items-center gap-6 px-4 py-6 md:gap-8 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-gray-300"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 md:gap-[26px]">
        <div className="flex flex-col gap-1 md:gap-4">
          <p className="font-sm-semibold md:font-xl-semibold truncate text-gray-900">{title}</p>
          <p className="font-sm-regular md:font-base-regular line-clamp-2 text-gray-700">
            {content}
          </p>
        </div>
        <PostMeta post={post} variant="list" />
      </div>

      {image && !imageError && (
        <div className="size-[72px] shrink-0 overflow-hidden rounded-[12px] border border-gray-200 md:size-[120px] md:rounded-[16px]">
          <img
            src={image}
            alt={title}
            className="size-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}
    </Link>
  );
}
