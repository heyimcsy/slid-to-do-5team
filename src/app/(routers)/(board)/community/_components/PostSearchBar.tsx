'use client';

import type { SortOption } from '../types';

import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

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
  const [search, setSearch] = useState(initialSearch ?? '');
  const debouncedValue = useDebouncedValue(search, 500);
  const isPendingRef = useRef(false);

  useEffect(() => {
    if (isPendingRef.current) {
      isPendingRef.current = false;
      if (initialSearch === debouncedValue) return;
    }
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const trimmed = debouncedValue.trim();
    if (trimmed === initialSearch) return;

    isPendingRef.current = true;
    onSearchChange(trimmed);
  }, [debouncedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="w-[248px] md:w-[432px]">
        <SearchInput
          placeholder="궁금한 내용을 검색해주세요"
          className="ml-0.5 overflow-hidden bg-white"
          value={search}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const trimmed = e.currentTarget.value.trim();
              if (trimmed === initialSearch) return;
              onSearchChange(trimmed);
            }
          }}
        />
      </div>
      <SortFilter value={sort} onChange={onSortChange} />
    </div>
  );
}
