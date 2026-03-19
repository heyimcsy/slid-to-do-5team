'use client';

import type { SortOption } from '../types';

import { useState } from 'react';

import { SearchInput } from '@/components/common/SearchInput';
import { SortFilter } from '@/components/common/SortFilter';

interface PostSearchBarProps {
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  onSearchChange: (value: string) => void;
}

export function PostSearchBar({ sort, onSortChange, onSearchChange }: PostSearchBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onSearchChange(inputValue);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="w-[248px] md:w-[432px]">
        <SearchInput
          placeholder="궁금한 내용을 검색해주세요"
          className="ml-0.5 overflow-hidden bg-white"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          // onSearchClick={handleSubmit}
        />
      </div>
      <SortFilter value={sort} onChange={onSortChange} />
    </div>
  );
}
