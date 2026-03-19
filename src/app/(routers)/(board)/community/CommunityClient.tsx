'use client';

import type { SortOption } from './types';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { Icon } from '@/components/icon/Icon';

import { FeaturedPostCard } from './_components/FeaturedPostCard';
import { Pagination } from './_components/Pagination';
import { PostListItem } from './_components/PostListItem';
import { PostSearchBar } from './_components/PostSearchBar';
import { getPosts } from './_api/communityApi';

const POSTS_PER_PAGE = 5;

export default function CommunityClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<SortOption>('최신순');
  const [search, setSearch] = useState('');

  const { data, isError, refetch } = useQuery({
    queryKey: ['community', 'posts'],
    queryFn: getPosts,
    staleTime: 1000 * 60 * 5,
  });

  const posts = data?.posts ?? [];

  const featuredPosts = useMemo(
    () => [...posts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 3),
    [posts],
  );

  const filteredPosts = useMemo(
    () =>
      posts
        .filter((post) => post.title.includes(search) || post.content.includes(search))
        .sort((a, b) => {
          if (sort === '최신순')
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          if (sort === '인기순') return b.viewCount - a.viewCount;
          return 0;
        }),
    [posts, search, sort],
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  if (isError)
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-gray-500">데이터를 불러오지 못했어요.</p>
        <button onClick={() => refetch()} className="text-orange-500">
          다시 시도하기
        </button>
      </div>
    );

  return (
    <div className="relative h-full w-full">
      <div className="h-full overflow-y-auto bg-gray-100 px-4 py-6 pb-24 md:px-8 md:py-12 md:pb-20 lg:pb-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <h1 className="font-xl-semibold md:font-2xl-semibold mb-6 px-2 text-black md:mb-8">
            소통 게시판
          </h1>

          <div className="mb-6 flex gap-4 overflow-x-auto pb-2 md:mb-8">
            {featuredPosts.map((post) => (
              <FeaturedPostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="flex w-full flex-col items-center gap-8">
            <div className="flex flex-col items-start gap-2 self-stretch">
              <PostSearchBar
                sort={sort}
                onSortChange={handleSortChange}
                onSearchChange={handleSearchChange}
              />
              <div className="flex flex-col items-start self-stretch">
                {paginatedPosts.map((post) => (
                  <PostListItem key={post.id} post={post} />
                ))}
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
