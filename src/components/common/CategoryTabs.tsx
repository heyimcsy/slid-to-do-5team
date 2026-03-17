'use client';

import { cn } from '@/lib';

interface CategoryTabsProps {
  tabs: string[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CategoryTabs({ tabs, active, onChange, className }: Readonly<CategoryTabsProps>) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              'hover:bg-orange-alpha-20 h-10 rounded-[16px] px-4 py-2 transition-all',
              isActive
                ? 'font-base-bold bg-orange-alpha-20 text-orange-600'
                : 'font-base-regular text-gray-400',
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
