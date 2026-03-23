'use client';

import type { FilterType } from './_components/TodoTabs';
import type { Task } from './types';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import TodoHeader from './_components/TodoHeader';
import TodoList from './_components/TodoList';
import TodoTabs from './_components/TodoTabs';

const todolists: Task[] = [
  {
    id: 1,
    content: '사용자 데이터 렌더링 구현',
    checked: false,
    link: true,
    note: true,
    favorites: true,
  },
  {
    id: 2,
    content: '개발 폴더 구조 세팅 (src, public, components)',
    checked: false,
    link: true,
    note: true,
    favorites: false,
  },
  {
    id: 3,
    content: '자바스크립트 기초 챕터4 듣기',
    checked: false,
    link: true,
    note: true,
    favorites: false,
  },
  {
    id: 4,
    content: 'JSON 서버 또는 mock API 연동',
    checked: true,
    link: true,
    note: true,
    favorites: true,
  },
  {
    id: 5,
    content: '반응형 레이아웃을 설계하고 미디어쿼리를 적용',
    checked: false,
    link: true,
    note: true,
    favorites: true,
  },
  {
    id: 6,
    content: '자바스크립 기초 챕터3기 듣기',
    checked: false,
    link: true,
    note: true,
    favorites: true,
  },
];
export default function TodosPage() {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const filteredTasks = todolists.filter((todo) => {
    if (filter === 'TODO') return !todo.checked;
    if (filter === 'DONE') return todo.checked;
    return true;
  });

  return (
    <div className="flex h-full w-full flex-col px-4 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <div className="mb-4 hidden px-2 md:block">
          <TodoHeader count={todolists.length} />
        </div>

        <div className="mb-2 flex items-center justify-between">
          <TodoTabs active={filter} onChange={setFilter} />
          <Button variant="ghost" size="sm" className="min-w-0 md:hidden">
            + 할 일 추가
          </Button>
          <Button variant="ghost" size="md" className="hidden min-w-0 md:block">
            + 할 일 추가
          </Button>
        </div>

        <TodoList todolists={filteredTasks} />
      </div>
    </div>
  );
}
