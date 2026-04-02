'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGetTodos } from '@/api/todos';





export function RecentTaskList() {
  /**
   * ////TODO: 최근 등록한 할 일에 필요한 기능
   * - 최근 등록한 할 일: 생성일 순으로 가장 최근에 생성한 4개의 할 일을 조회할 수 있습니다.
   * - 할일에 대한 완료 여부, 할일명, 속한 목표(없을 경우 제외)를 조회할 수 있습니다.
   * - `모두 보기` 버튼을 클릭하면 모든 할 일 페이지로 이동합니다.
   * - 만약, 등록한 할 일이 없으면 할 일 없음 UI 처리가 됩니다.
   * @endpoint GET /api/todos/recent
   */
  const { data: todos, isLoading, error } = useGetTodos({ limit: 4 });
  if (isLoading) return <div>로딩중...</div>;
  if (error || !todos) return <div>에러</div>;

  const recentTodos = todos.todos.slice(0, 4);

  return (
    <div className="recent-task-list flex flex-col gap-4">
      <div className="recent-task-list-header flex justify-between">
        <section className="flex items-center justify-between">
          <h2 className="flex items-center gap-2">
            <Image
              src="/images/img-task.svg"
              alt="할 일 아이콘"
              aria-hidden
              width={40}
              height={40}
              className="size-8 md:size-8 lg:size-10"
            />
            <span className="font-base-medium md:font-base-medium lg:font-lg-medium">
              최근 등록한 할 일
            </span>
          </h2>
        </section>
        <section className="recent-task-list-header-link flex items-center">
          <Link href="/dashboard/todos" className="flex items-center">
            <span className="font-sm-semibold md:font-sm-semibold lg:font-base-semibold text-orange-500">
              모두 보기
            </span>
            <Image
              src="/images/img-chevron-right.svg"
              alt="arrow"
              width={20}
              height={20}
              className="h-auto text-orange-500"
            />
          </Link>
        </section>
      </div>
      <div className="flex min-h-46.5 w-full flex-col justify-center rounded-[1.75rem] bg-orange-500 px-4 py-4.5 text-white md:min-h-46.5 md:rounded-[1.75rem] md:px-4 md:py-4.5 lg:min-h-64 lg:rounded-[2.5rem] lg:px-8 lg:py-7.5 dark:bg-orange-300 dark:text-black">
        {recentTodos.length === 0 ? (
          <div className="flex items-center justify-center">최근에 등록한 할 일이 없어요</div>
        ) : (
          recentTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between px-1 py-1.5 md:px-1 md:py-1.5 lg:px-2 lg:py-2.5"
            >
              <p className="lg:font-base-semibold md:font-sm-semibold font-sm-semibold">
                {todo.title}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
