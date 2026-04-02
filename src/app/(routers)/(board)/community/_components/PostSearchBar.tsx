'use client';

import type { SortOption } from '../types';

import { SearchInput } from '@/components/common/SearchInput';
import { SortFilter } from '@/components/common/SortFilter';

interface PostSearchBarProps {
  sort: SortOption;
  initialSearch?: string;
  onSortChange: (value: SortOption) => void;
  onSearchChange: (value: string) => void;
}

export function PostSearchBar({
  sort,
  initialSearch = '',
  onSortChange,
  onSearchChange,
}: PostSearchBarProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="w-[248px] md:w-[432px]">
        <SearchInput
          placeholder="궁금한 내용을 검색해주세요"
          className="ml-0.5 overflow-hidden bg-white"
          defaultValue={initialSearch}
          key={initialSearch}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearchChange(e.currentTarget.value);
          }}
        />
      </div>
      <SortFilter value={sort} onChange={onSortChange} />
    </div>
  );
}
