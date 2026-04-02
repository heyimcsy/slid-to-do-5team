'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib';

import { Icon } from '@/components/icon/Icon';

type SortOption = '최신순' | '인기순';

const OPTIONS: SortOption[] = ['최신순', '인기순'];

interface SortFilterProps {
  value?: SortOption;
  onChange?: (value: SortOption) => void;
}

export function SortFilter({ value = '최신순', onChange }: SortFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className="flex cursor-pointer items-center gap-1 text-gray-500"
      >
        <span className="font-sm-medium md:font-base-medium whitespace-nowrap">{value}</span>
        <Icon name="filter" size={20} />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
          className="absolute top-full right-0 z-10 mt-2 w-[120px] overflow-hidden rounded-2xl bg-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]"
        >
          {OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => handleSelect(option)}
              className={cn(
                'font-base-medium w-full px-5 py-4 text-left hover:bg-gray-50',
                value === option ? 'text-gray-900' : 'text-gray-500',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
