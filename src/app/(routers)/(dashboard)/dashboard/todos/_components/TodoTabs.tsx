'use client';

import { cn } from '@/lib/shadcn';

export type FilterType = 'ALL' | 'TODO' | 'DONE';

export interface Task {
  id: string;
  title: string;
  isDone: boolean;
  isFavorite: boolean;
  hasMemo: boolean;
  hasLink: boolean;
}
const TABS: { label: string; value: FilterType }[] = [
  { label: 'ALL', value: 'ALL' },
  { label: 'TO DO', value: 'TODO' },
  { label: 'DONE', value: 'DONE' },
];

interface TodoTabsProps {
  active: FilterType;
  onChange: (filter: FilterType) => void;
}

export default function TodoTabs({ active, onChange }: TodoTabsProps) {
  return (
    <div className="flex items-center gap-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-200',
            active === tab.value
              ? 'bg-[rgba(255,165,101,0.2)] text-orange-600'
              : 'text-gray-400 hover:text-gray-600',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
