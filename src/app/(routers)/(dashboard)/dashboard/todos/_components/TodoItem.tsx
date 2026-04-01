'use client';

import type { Task } from '../types';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteFavorite, usePostFavorite } from '@/api/favorites';
import { useDeleteTodos, usePatchTodos } from '@/api/todos';
import { cn } from '@/lib';
import { toast } from 'sonner';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TodoItemProps {
  task: Task;
}

export default function TodoItem({ task }: TodoItemProps) {
  const router = useRouter();

  // 마우스 호버 상태 관리 (호버 시 수정/삭제 버튼 노출)
  const [hovered, setHovered] = useState(false);

  const { mutate: patchTodo } = usePatchTodos();
  const { mutate: deleteTodo } = useDeleteTodos();
  const { mutate: postFavorite } = usePostFavorite();
  const { mutate: deleteFavorite } = useDeleteFavorite();

  // 체크박스 클릭 시 완료 여부 토글
  const handleToggle = () => {
    patchTodo({
      id: task.id,
      done: !task.done,
    });
  };
  // 할 일 삭제 처리
  const handleDelete = () => {
    deleteTodo({ id: task.id });
  };
  // 할 일 수정 페이지로 이동
  const handleEdit = () => {
    router.push(`/goals/${task.goalId}/todos/${task.id}/edit`);
  };
  // 찜하기 토글 (찜 상태면 취소, 아니면 추가)
  const handleFavorite = () => {
    if (task.favorites) {
      deleteFavorite(task.id);
    } else {
      postFavorite(task.id);
    }
  };

  return (
    <ul>
      <li
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'flex cursor-pointer items-center justify-between gap-2 rounded-2xl px-2 py-2 transition-colors duration-150 hover:bg-[var(--orange-alpha-20)] md:px-4 md:py-3 lg:px-8',
        )}
      >
        {/* 체크박스 */}
        <button onClick={handleToggle} className="shrink-0 cursor-pointer">
          {task.done ? (
            <Icon name="checkBox" size={18} checked={true} />
          ) : (
            <Icon name="checkBox" size={18} />
          )}
        </button>

        {/* 할일 텍스트 */}
        <div className="flex min-w-0 flex-1 items-center justify-between">
          <span
            className={cn(
              'font-sm-medium md:font-base-medium min-w-0 flex-1 truncate',
              task.done && 'text-orange-500',
            )}
          >
            {task.title}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            {task.noteIds && task.noteIds.length > 0 ? (
              <Button
                variant="icon"
                size="none"
                onClick={() => {
                  router.push(`/goals/${task.goalId}/notes/${task.noteIds}`);
                }}
              >
                <Icon name="note" variant="orange" />
              </Button>
            ) : null}

            {task.linkUrl ? (
              <Button
                variant="icon"
                size="none"
                onClick={() => {
                  if (task.linkUrl) navigator.clipboard.writeText(task.linkUrl);
                  toast.success('링크가 복사되었습니다');
                }}
              >
                <Icon name="link" variant="orange" />
              </Button>
            ) : null}

            {hovered && (
              <div className="flex items-center gap-2">
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    if (task.noteIds && task.noteIds.length > 0) {
                      router.push(`/goals/${task.goalId}/notes/${task.noteIds[0]}/edit`);
                    } else {
                      router.push(`/goals/${task.goalId}/notes/new?todoId=${task.id}`);
                    }
                  }}
                >
                  <Icon name="edit" />
                </button>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2">
                      <Icon name="dotscircle" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleEdit}>수정하기</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete}>삭제하기</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            <button onClick={handleFavorite} className="cursor-pointer">
              {task.favorites ? (
                <Icon name="filledStar" variant="orange" />
              ) : (
                <Icon name="outlineStar" />
              )}
            </button>
          </div>
        </div>
      </li>
    </ul>
  );
}
