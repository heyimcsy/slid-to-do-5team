'use client';

import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];
  const delta = 2;

  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);

  if (rangeStart > 2) pages.push('...');

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < totalPages - 1) pages.push('...');

  pages.push(totalPages);

  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const btnBase =
    'flex items-center justify-center bg-gray-50 size-8 rounded-lg md:size-12 md:rounded-2xl';
  const btnActive = 'bg-orange-500 text-white shadow-[0px_10px_40px_0px_rgba(255,158,89,0.3)]';
  const btnInactive = 'text-gray-500';
  const btnText = 'font-xs-semibold md:font-sm-medium';

  return (
    <div className="flex items-center gap-[10px]">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(btnBase, 'disabled:opacity-40')}
        aria-label="이전 페이지"
      >
        <Icon name="arrow" size={20} direction="left" />
      </button>

      <div className="flex gap-1">
        {pageNumbers.map((page, i) =>
          page === '...' ? (
            <div key={`dots-${i}`} className={cn(btnBase, btnInactive, btnText)}>
              ···
            </div>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(btnBase, btnText, currentPage === page ? btnActive : btnInactive)}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(btnBase, 'disabled:opacity-40')}
        aria-label="다음 페이지"
      >
        <Icon name="arrow" size={20} direction="right" />
      </button>
    </div>
  );
}
