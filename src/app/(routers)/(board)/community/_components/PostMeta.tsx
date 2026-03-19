import type { Post } from '../types';

import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';

interface PostMetaProps {
  post: Post;
  variant?: 'card' | 'list';
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 1000 / 60);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;

  return new Date(isoString).toLocaleDateString('ko-KR');
}

export function PostMeta({ post, variant = 'list' }: PostMetaProps) {
  const { writer, createdAt, viewCount, commentCount } = post;

  return (
    <div
      className={cn('flex w-full items-center', variant === 'list' ? 'gap-0.5' : 'justify-between')}
    >
      <div className="flex items-center gap-1">
        <div className="size-5 shrink-0 overflow-hidden rounded-full bg-gray-200">
          {writer.image ? (
            <img src={writer.image} alt={writer.name} className="size-full object-cover" />
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
