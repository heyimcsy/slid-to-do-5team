import type { Post } from '../types';

import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';

import { formatRelativeTime } from '../_utils/formatRelativeTime';
import { WriterAvatar } from './WriterAvatar';

interface PostMetaProps {
  post: Post;
  variant?: 'card' | 'list';
}

export function PostMeta({ post, variant = 'list' }: PostMetaProps) {
  const { writer, createdAt, viewCount, commentCount } = post;

  return (
    <div
      className={cn('flex w-full items-center', variant === 'list' ? 'gap-0.5' : 'justify-between')}
    >
      <div className="flex items-center gap-1">
        <WriterAvatar name={writer.name} image={writer.image} />
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
