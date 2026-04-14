'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGetTodos } from '@/api/todos';

import { Skeleton } from '@/components/ui/skeleton';

import RecentTodoList from './RecentTodoList';

export function RecentTaskList() {
  /**
   * ////TODO: 최근 등록한 할 일에 필요한 기능
   * - 최근 등록한 할 일: 생성일 순으로 가장 최근에 생성한 4개의 할 일을 조회할 수 있습니다.
   * - 할일에 대한 완료 여부, 할일명, 속한 목표(없을 경우 제외)를 조회할 수 있습니다.
   * - `모두 보기` 버튼을 클릭하면 모든 할 일 페이지로 이동합니다.
   * - 만약, 등록한 할 일이 없으면 할 일 없음 UI 처리가 됩니다.
   * @endpoint GET /api/todos/recent
   */
  const { data: todos, isLoading, error, refetch } = useGetTodos({ limit: 4 });

  if (isLoading) return <RecentTaskListSkeleton />;
  if (error || !todos) return <RecentTaskListError onRetry={refetch} />;

  const recentTodos = todos?.todos.slice(0, 4) ?? [];

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
      <div className="flex h-47 w-full flex-col justify-center rounded-[1.75rem] bg-orange-500 px-4 py-4.5 text-white transition-shadow duration-300 hover:shadow-[0_10px_40px_0_oklch(0.7654_0.134_48.24/0.4)] md:max-h-47 md:min-h-46.5 md:rounded-[1.75rem] md:px-4 md:py-4.5 lg:min-h-64 lg:rounded-[2.5rem] lg:px-8 lg:py-7.5 dark:bg-orange-300 dark:text-black">
        {recentTodos.length === 0 ? (
          <div className="flex items-center justify-center">최근에 등록한 할 일이 없어요</div>
        ) : (
          recentTodos.map((todo) => (
            <RecentTodoList
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
  );
}

function RecentTaskListSkeleton() {
  return (
    <div className="recent-task-list flex flex-col gap-4">
      <div className="recent-task-list-header flex justify-between">
        <Skeleton variant="gray" className="h-8 w-40 rounded-xl" />
        <Skeleton variant="gray" className="h-6 w-16 rounded-xl" />
      </div>
      <div className="flex min-h-46.5 w-full flex-col justify-center rounded-[1.75rem] bg-orange-500 px-4 py-4.5 md:min-h-46.5 md:rounded-[1.75rem] md:px-4 md:py-4.5 lg:min-h-64 lg:rounded-[2.5rem] lg:px-8 lg:py-7.5 dark:bg-orange-300">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant="gray" className="size-5 shrink-0 rounded-md" />
              <Skeleton variant="gray" className="h-4 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface RecentTaskListErrorProps {
  onRetry: () => void;
}

function RecentTaskListError({ onRetry }: RecentTaskListErrorProps) {
  return (
    <div className="recent-task-list flex flex-col gap-4">
      <div className="recent-task-list-header flex justify-between">
        <p className="font-3xl-regular mb-4 text-gray-600">데이터를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={onRetry}
          className="font-sm-medium rounded-xl bg-orange-500 px-5 py-2.5 text-white"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
