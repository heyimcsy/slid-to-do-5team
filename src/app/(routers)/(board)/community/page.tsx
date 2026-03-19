'use client';

import type { Post, SortOption } from './types';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Icon } from '@/components/icon/Icon';

import { FeaturedPostCard } from './_components/FeaturedPostCard';
import { Pagination } from './_components/Pagination';
import { PostListItem } from './_components/PostListItem';
import { PostSearchBar } from './_components/PostSearchBar';

const POSTS_PER_PAGE = 5;

// 임시 - API 연동 후 삭제예정
const FEATURED_POSTS: Post[] = [];
const POSTS: Post[] = [];

export default function CommunityPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<SortOption>('최신순');
  const [search, setSearch] = useState('');

  const filteredPosts = useMemo(
    () =>
      POSTS.filter((post) => post.title.includes(search) || post.content.includes(search)).sort(
        (a, b) => {
          if (sort === '최신순')
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          if (sort === '인기순') return b.viewCount - a.viewCount;
          return 0;
        },
      ),
    [search, sort],
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

  return (
    <div className="relative h-full w-full">
      <div className="h-full overflow-y-auto bg-gray-100 px-4 py-6 pb-24 md:px-8 md:py-12 md:pb-20 lg:pb-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <h1 className="font-xl-semibold md:font-2xl-semibold mb-6 px-2 text-black md:mb-8">
            소통 게시판
          </h1>

          <div className="mb-6 flex gap-4 overflow-x-auto pb-2 md:mb-8">
            {FEATURED_POSTS.map((post) => (
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
        className="fixed right-4 bottom-8 flex size-[52px] items-center justify-center rounded-full bg-orange-500 shadow-lg md:right-8 md:size-auto md:gap-1 md:px-[18px] md:py-3.5"
      >
        <Icon name="plus" size={24} variant="white" />
        <span className="hidden text-lg font-semibold text-white md:block">게시물 작성하기</span>
      </Link>
    </div>
  );
}
