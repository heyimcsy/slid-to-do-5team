import type { TodoListProps } from '@/app/(routers)/(todo)/goals/types';

import { TodoSection } from '@/app/(routers)/(todo)/goals/_components/TodoSection';

export default function TotalListTab() {
  const todoLists = [
    {
      content: '사용자 데이터 렌더링 구현',
      checked: false,
      link: true,
      note: true,
      favorites: true,
    },
    {
      content: '개발 폴더 구조 세팅 (src, public, components)',
      checked: false,
      link: true,
      note: true,
      favorites: false,
    },
    {
      content: '자바스크립트 기초 챕터4 듣기',
      checked: false,
      link: true,
      note: true,
      favorites: false,
    },
    {
      content: 'JSON 서버 또는 mock API 연동',
      checked: false,
      link: true,
      note: true,
      favorites: true,
    },
    {
      content: '반응형 레이아웃을 설계하고 미디어쿼리를 적용',
      checked: false,
      link: true,
      note: true,
      favorites: true,
    },
    {
      content: '자바스크립 기초 챕터3기 듣기',
      checked: false,
      link: true,
      note: true,
      favorites: true,
    },
  ];

  const todoListsDone: TodoListProps[] = [
    {
      content: '사용자 데이터 렌더링 구현',
      checked: true,
      link: true,
      note: true,
      favorites: true,
    },
    {
      content: '개발 폴더 구조 세팅 (src, public, components)',
      checked: true,
      link: true,
      note: false,
      favorites: false,
    },
    {
      content: '자바스크립트 기초 챕터4 듣기',
      checked: true,
      link: true,
      note: true,
      favorites: false,
    },
    {
      content: 'JSON 서버 또는 mock API 연동',
      checked: true,
      link: true,
      note: true,
      favorites: true,
    },
    {
      content: '반응형 레이아웃을 설계하고 미디어쿼리를 적용',
      checked: true,
      link: true,
      note: true,
      favorites: true,
    },
    {
      content: '개발 폴더 구조 세팅 (src, public, components)',
      checked: true,
      link: true,
      note: false,
      favorites: false,
    },
    {
      content: '자바스크립트 기초 챕터4 듣기',
      checked: true,
      link: true,
      note: true,
      favorites: false,
    },
    {
      content: 'JSON 서버 또는 mock API 연동',
      checked: true,
      link: true,
      note: true,
      favorites: true,
    },
    {
      content: '반응형 레이아웃을 설계하고 미디어쿼리를 적용',
      checked: true,
      link: true,
      note: true,
      favorites: true,
    },
  ];

  // const todoLists: TodoListProps[] = [];
  // const todoListsDone: TodoListProps[] = [];

  return (
    <div className="flex flex-col space-y-4 md:space-y-4 lg:flex-row lg:space-x-8">
      <TodoSection
        title="TO DO"
        todos={todoLists}
        bgColor="bg-orange-100"
        emptyImage="/images/big-zero-todo.svg"
        emptyText="해야할 일이 아직 없어요"
        showActions
      />
      <TodoSection
        title="DONE"
        todos={todoListsDone}
        bgColor="bg-white"
        emptyImage="/images/big-zero-done.svg"
        emptyText="완료한 일이 아직 없어요"
      />
    </div>
  );
}
