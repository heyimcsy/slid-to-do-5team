'use client';

import type { Favorite } from '../_api/favoritesQueries';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { cn } from '@/lib';

import TodoItem from '@/components/common/TodoItem';
import { EmptyState } from '@/components/EmptyState';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { toTask, useGetFavorites } from '../_api/favoritesQueries';

type Tab = 'ALL' | 'TODO' | 'DONE';

const TABS: { label: string; value: Tab }[] = [
  { label: 'ALL', value: 'ALL' },
  { label: 'TO DO', value: 'TODO' },
  { label: 'DONE', value: 'DONE' },
];

export default function FavoritesTab() {
  const [tab, setTab] = useState<Tab>('ALL');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('전체 목표');
  const [goalSelectOpen, setGoalSelectOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetFavorites();
  const favorites: Favorite[] = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page.favorites),
    [data],
  );

  const { observerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const goals = [
    { id: 'all', title: '전체 목표' },
    ...Array.from(
      new Map(
        favorites.filter((fav) => fav.todo.goal).map((fav) => [fav.todo.goal!.id, fav.todo.goal!]),
      ).values(),
    ).map((goal) => ({ id: String(goal.id), title: goal.title })),
  ];

  const goalFiltered =
    selectedGoalId === '전체 목표'
      ? favorites
      : favorites.filter((fav) => fav.todo.goal?.title === selectedGoalId);

  const filtered = goalFiltered.filter((fav: Favorite) => {
    if (tab === 'TODO') return !fav.todo.done;
    if (tab === 'DONE') return fav.todo.done;
    return true;
  });

  return (
    <div className="flex h-full flex-col">
      <h1 className="font-xl-bold mb-6 text-gray-800">
        찜한 할 일 <span className="text-orange-500">{favorites.length}</span>
      </h1>

      <div className="mb-3 flex gap-1">
        {TABS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              'font-sm-semibold rounded-full px-3 py-1 transition-colors',
              tab === value ? 'bg-orange-100 text-orange-500' : 'text-gray-400 hover:text-gray-600',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col rounded-[28px] bg-white p-4 shadow-sm md:p-6">
        <Select
          value={selectedGoalId}
          onValueChange={(val: string | null) => val && setSelectedGoalId(val)}
          open={goalSelectOpen}
          onOpenChange={setGoalSelectOpen}
        >
          <SelectTrigger className="mb-4">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/img_goal.svg"
                alt="goal"
                width={24}
                height={24}
                className="shrink-0"
              />
              <SelectValue placeholder="전체 목표" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {goals.map((goal) => (
                <SelectItem key={goal.id} value={goal.title}>
                  {goal.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div ref={observerRef} className="flex flex-col">
          {filtered.length > 0 ? (
            filtered.map((fav) => <TodoItem key={fav.todo.id} task={toTask(fav)} />)
          ) : (
            <div>
              {tab === 'ALL' ? (
                <EmptyState message="아직 찜한 할일이 없어요" />
              ) : tab === 'TODO' ? (
                <EmptyState message="남은 할 일이 없어요" />
              ) : (
                <EmptyState message="완료한 할 일이 없어요" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
