'use client';

import { useState } from 'react';

import type { Post } from '../types';

import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';
import { formatRelativeTime } from '../_utils/formatRelativeTime';

interface PostMetaProps {
  post: Post;
  variant?: 'card' | 'list';
}

export function PostMeta({ post, variant = 'list' }: PostMetaProps) {
  const { writer, createdAt, viewCount, commentCount } = post;
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={cn('flex w-full items-center', variant === 'list' ? 'gap-0.5' : 'justify-between')}
    >
      <div className="flex items-center gap-1">
        <div className="size-5 shrink-0 overflow-hidden rounded-full bg-gray-200">
          {writer.image && !imageError ? (
            <img
              src={writer.image}
              alt={writer.name}
              className="size-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="font-xs-regular flex size-full items-center justify-center text-gray-500">
              {writer.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="font-xs-regular flex items-center gap-1 text-gray-500">
          <span>{writer.name}</span>
          {variant === 'list' && <span>· {formatRelativeTime(createdAt)}</span>}
          <span>· 조회 {viewCount}</span>
          {variant === 'list' && <span>·</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 text-gray-600">
        <Icon name="chat" size={16} />
        <span className="font-xs-regular">{commentCount}</span>
      </div>
    </div>
  );
}
