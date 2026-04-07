'use client';

import Image from 'next/image';
import { useGetTodos } from '@/api/todos';
import TodoList from '@/app/(routers)/(todo)/goals/[goalId]/_components/TodoList';

export function TodosByGoalSection() {
  const { data: todos, isLoading, error } = useGetTodos({ limit: 4 });
  if (isLoading) return <div>로딩중...</div>;
  if (error || !todos) return <div>에러</div>;

  const todosByGoal = todos.todos.slice(0, 4);

  return (
    <section className="todos-by-goal-section mt-8 flex w-full md:mt-10 lg:mt-10">
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
        </div>
        <div className="w-full rounded-[1.75rem] bg-white px-4 py-4.5 text-black md:min-h-46.5 md:rounded-[1.75rem] md:px-4 md:py-4.5 lg:rounded-[2.5rem] lg:px-8 lg:py-7.5">
          {todosByGoal.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-y-4.5 py-4.25">
              <Image
                src="/images/big-zero-done.svg"
                alt="최근에 등록한 목표 없음"
                width={130}
                height={140}
                className="h-21.25 w-20 object-contain md:h-35 md:w-32.5 lg:h-35 lg:w-32.5"
              />
              <span className="font-sm-medium md:font-base-medium lg:font-base-medium text-gray-500">
                최근에 등록한 목표가 없어요
              </span>
            </div>
          ) : (
            /**
             * 목표별로 화면 구분하기
             */
            todosByGoal.map((todo) => (
              <TodoList
                key={todo.id}
                goalId={todo.goalId}
                id={todo.id}
                done={todo.done}
                title={todo.title}
                noteIds={todo.noteIds}
                linkUrl={todo.linkUrl}
                favorites={todo.favorites}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
