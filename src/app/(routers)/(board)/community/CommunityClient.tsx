'use client';

import type { Post, SortOption } from './types';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Icon } from '@/components/icon/Icon';

import { useGetPosts } from './_api/communityQueries';
import { FeaturedPostCard } from './_components/FeaturedPostCard';
import { Pagination } from './_components/Pagination';
import { PostEmptyState } from './_components/PostEmptyState';
import { PostErrorFallback } from './_components/PostErrorFallback';
import { PostListItem } from './_components/PostListItem';
import { PostListSkeleton } from './_components/PostListSkeleton';
import { PostSearchBar } from './_components/PostSearchBar';
import { extractPlainText } from './_utils/extractPlainText';

const POSTS_PER_PAGE = 5;

export default function CommunityClient() {
  const [currentPage, setCurrentPage] = useState(1);
  // const [search, setSearch] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sort = (searchParams.get('sort') ?? '최신순') as SortOption;
  const search = searchParams.get('search') ?? '';

  const { data, isLoading, isError, refetch } = useGetPosts(sort);

  const posts: Post[] = useMemo(
    () => (data?.posts ?? []).map((post) => ({ ...post, content: extractPlainText(post.content) })),
    [data],
  );

  const featuredPosts = useMemo(
    () => [...posts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 3),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerSearch) ||
        post.content.toLowerCase().includes(lowerSearch),
    );
  }, [posts, search]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('sort', value);

    router.replace(`${pathname}?${params.toString()}`);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('search', value);

    router.replace(`${pathname}?${params.toString()}`);
    setCurrentPage(1);
  };

  if (isLoading) return <PostListSkeleton />;
  if (isError && !data) return <PostErrorFallback onRetry={refetch} />;

  return (
    <div className="relative h-full w-full">
      <div className="h-full overflow-y-auto bg-gray-100 px-4 py-6 pb-24 md:px-8 md:py-12 md:pb-20 lg:pb-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <h1 className="font-xl-semibold md:font-2xl-semibold mb-6 px-2 text-black md:mb-8">
            <Link href="/community" className="cursor-pointer">
              소통 게시판
            </Link>
          </h1>

          {posts.length > 0 && (
            <div className="mb-6 flex gap-4 overflow-x-auto pb-2 md:mb-8">
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <div className="flex w-full flex-col items-center gap-8">
            <div className="flex flex-col items-start gap-2 self-stretch">
              <PostSearchBar
                sort={sort}
                onSortChange={handleSortChange}
                onSearchChange={handleSearchChange}
              />
              <div className="flex flex-col items-start self-stretch">
                {posts.length === 0 ? (
                  <PostEmptyState />
                ) : filteredPosts.length === 0 ? (
                  <PostEmptyState message="검색 결과가 없어요." />
                ) : (
                  paginatedPosts.map((post) => <PostListItem key={post.id} post={post} />)
                )}
              </div>
            </div>

            {totalPages > 0 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Link
        href="/community/new"
        aria-label="게시물 작성하기"
        className="fixed right-4 bottom-8 flex size-[52px] items-center justify-center rounded-full bg-orange-500 shadow-lg md:right-8 md:size-auto md:gap-1 md:px-[18px] md:py-3.5"
      >
        <Icon name="plus" size={24} variant="white" />
        <span className="hidden text-lg font-semibold text-white md:block">게시물 작성하기</span>
      </Link>
    </div>
  );
}
