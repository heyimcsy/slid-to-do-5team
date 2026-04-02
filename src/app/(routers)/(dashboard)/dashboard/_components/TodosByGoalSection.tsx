'use client';

import { useGetTodos } from '@/api/todos';
import Image from 'next/image';

export function TodosByGoalSection() {
  const { data: todos, isLoading, error } = useGetTodos({ limit: 4 });
  if (isLoading) return <div>로딩중...</div>;
  if (error || !todos) return <div>에러</div>;

  const todosByGoal = todos.todos.slice(0, 4);
  console.log(todosByGoal);

  return (
    <section className="todos-by-goal-section mt-10 flex w-full">
      <div className="todos-by-goal-section flex w-full flex-col gap-4">
        <div className="todos-by-goal-section-header flex justify-between">
          <section className="flex items-center justify-between">
            <h2 className="flex items-center gap-2">
              <Image
                src="/images/img-goal.svg"
                alt="할 일 아이콘"
                aria-hidden
                width={40}
                height={40}
                className="size-8 md:size-8 lg:size-10"
              />
              <span className="font-base-medium md:font-base-medium lg:font-lg-medium">
                목표 별 할 일
              </span>
            </h2>
          </section>
          <section className="todos-by-goal-section-header-link flex items-center">
            {/* <Link href="/dashboard/todos" className="flex items-center">
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
            </Link> */}
          </section>
        </div>
        <div className="w-full rounded-[1.75rem] bg-white px-4 py-4.5 text-black md:min-h-46.5 md:rounded-[1.75rem] md:px-4 md:py-4.5 lg:rounded-[2.5rem] lg:px-8 lg:py-7.5 dark:bg-black dark:text-white">
          {todosByGoal.length === 0 ? (
            <div className="flex items-center justify-center">최근에 등록한 목표가 없어요</div>
          ) : (
            todosByGoal.map((todo) => (
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
    </section>
  );
}
