import Link from 'next/link';

import type { Post } from '../types';

import { PostMeta } from './PostMeta';

interface FeaturedPostCardProps {
  post: Post;
}

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  const { id, title, image } = post;

  return (
    <Link href={`/community/${id}`} className="flex h-[204px] w-[260px] shrink-0 flex-col justify-between gap-4 rounded-[24px] bg-white px-6 py-4 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.05)] md:h-[250px] md:w-[384px] md:gap-6 md:rounded-[32px] md:p-8">
      <div className="flex flex-col gap-3">
        <p className="font-base-semibold md:font-xl-semibold truncate text-gray-900">{title}</p>
        {image && (
          <div className="size-[100px] shrink-0 overflow-hidden rounded-[16px] border border-gray-200">
            <img src={image} alt={title} className="size-full object-cover" />
          </div>
        )}
      </div>
      <PostMeta post={post} variant="card" />
    </Link>
  );
}
