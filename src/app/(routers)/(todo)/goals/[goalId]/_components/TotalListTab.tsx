import type { TodoListProps } from '@/app/(routers)/(todo)/goals/types';

import { TodoSection } from '@/app/(routers)/(todo)/goals/[goalId]/_components/TodoSection';

export default function TotalListTab() {
  const todoLists: TodoListProps[] = [
    {
      id: 1,
      content: '사용자 데이터 렌더링 구현',
      done: false,
      link: 'https://www.codeit.kr',
      noteIds: [1],
      favorites: true,
    },
    {
      id: 2,
      content: '개발 폴더 구조 세팅 (src, public, components)',
      done: false,
      link: 'https://www.codeit.kr',
      noteIds: [],
      favorites: false,
    },
    {
      id: 3,
      content: '자바스크립트 기초 챕터4 듣기',
      done: false,
      link: 'https://www.codeit.kr',
      noteIds: [1],
      favorites: false,
    },
    {
      id: 4,
      content: 'JSON 서버 또는 mock API 연동',
      done: false,
      link: 'https://www.codeit.kr',
      noteIds: [1],
      favorites: true,
    },
    {
      id: 5,
      content: '반응형 레이아웃을 설계하고 미디어쿼리를 적용',
      done: false,
      link: 'https://www.codeit.kr',
      noteIds: [],
      favorites: true,
    },
    {
      id: 6,
      content: '자바스크립 기초 챕터3기 듣기',
      done: false,
      link: null,
      noteIds: [1],
      favorites: true,
    },
  ];

  const todoListsDone: TodoListProps[] = [
    {
      id: 7,
      content: '사용자 데이터 렌더링 구현',
      done: true,
      link: 'https://www.codeit.kr',
      noteIds: [],
      favorites: true,
    },
    {
      id: 8,
      content: '개발 폴더 구조 세팅 (src, public, components)',
      done: true,
      link: 'https://www.codeit.kr',
      noteIds: [],
      favorites: false,
    },
    {
      id: 9,
      content: '자바스크립트 기초 챕터4 듣기',
      done: true,
      link: null,
      noteIds: [1],
      favorites: false,
    },
    {
      id: 10,
      content: 'JSON 서버 또는 mock API 연동',
      done: true,
      link: null,
      noteIds: [],
      favorites: true,
    },
    {
      id: 11,
      content: '반응형 레이아웃을 설계하고 미디어쿼리를 적용',
      done: true,
      link: 'https://www.codeit.kr',
      noteIds: [1],
      favorites: true,
    },
    {
      id: 12,
      content: '개발 폴더 구조 세팅 (src, public, components)',
      done: true,
      link: 'https://www.codeit.kr',
      noteIds: [],
      favorites: false,
    },
    {
      id: 13,
      content: '자바스크립트 기초 챕터4 듣기',
      done: true,
      link: 'https://www.codeit.kr',
      noteIds: [],
      favorites: false,
    },
    {
      id: 14,
      content: 'JSON 서버 또는 mock API 연동',
      done: true,
      link: 'https://www.codeit.kr',
      noteIds: [1],
      favorites: true,
    },
    {
      id: 15,
      content: '반응형 레이아웃을 설계하고 미디어쿼리를 적용',
      done: true,
      link: null,
      noteIds: [],
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
