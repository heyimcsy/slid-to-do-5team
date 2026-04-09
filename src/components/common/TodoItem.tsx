'use client';

import type { Task } from '../../app/(routers)/(dashboard)/dashboard/todos/types';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteFavorite, usePostFavorite } from '@/api/favorites';
import { useDeleteTodos, usePatchTodos } from '@/api/todos';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';
import { toast } from 'sonner';

import { ROUTES } from '@/constants/routes';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Spinner } from '../ui/spinner';
import { DeleteDialog } from './DeleteDialog';

interface TodoItemProps {
  task: Task;
}

export default function TodoItem({ task }: TodoItemProps) {
  const router = useRouter();

  // 마우스 호버 상태 관리
  const [hovered, setHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 찜하기 아이콘 Ui 상태 관리
  const [isFavorite, setIsFavorite] = useState(task.favorites);
  const isFavoriteRef = useRef(task.favorites);

  const [isNavigating, setIsNavigating] = useState(false); // 추가

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

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // 할 일 삭제 처리
  const handleDelete = () => {
    deleteTodo({ id: task.id });
    setIsDeleteOpen(false);
  };
  // 할 일 수정 페이지로 이동
  const handleEdit = () => {
    router.push(`${ROUTES.TODO_EDIT(task.goalId, task.id)}`);
  };

  const handleFavorite = useDebouncedCallback(() => {
    const next = !isFavoriteRef.current; // ref로 최신값 읽기
    isFavoriteRef.current = next; // ref 즉시 업데이트
    setIsFavorite(next); // UI 즉각 반영
    if (next) {
      postFavorite(task.id, {
        onError: () => {
          isFavoriteRef.current = !next;
          setIsFavorite(!next); // 실패 시 롤백
        },
      });
    } else {
      deleteFavorite(task.id, {
        onError: () => {
          isFavoriteRef.current = !next;
          setIsFavorite(!next); // 실패 시 롤백
        },
      });
    }
  }, 300);

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'flex cursor-pointer items-center justify-between gap-2 rounded-2xl px-2 py-2 transition-colors duration-150 md:px-4 md:py-3 lg:px-8',
        (hovered || isDropdownOpen) && 'bg-orange-alpha-20',
      )}
    >
      {isNavigating && <Spinner text="로딩 중" />}
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
                setIsNavigating(true);
                router.push(`${ROUTES.NOTE_DETAIL(task.goalId, task.noteIds[0], task.id)}`);
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

          <div className="flex items-center gap-2">
            <div>
              <DropdownMenu onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger
                  className="flex cursor-pointer items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(e);
                  }}
                >
                  <Icon name="dotscircle" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* 노트 관련 메뉴 추가 */}
                  {task.noteIds && task.noteIds.length > 0 ? (
                    <DropdownMenuItem
                      onClick={() => {
                        setIsNavigating(true);
                        router.push(ROUTES.NOTE_EDIT(task.goalId, task.noteIds[0]));
                      }}
                    >
                      노트수정
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => {
                        setIsNavigating(true);
                        router.push(ROUTES.NOTE_NEW(task.goalId, task.id));
                      }}
                    >
                      노트작성
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleEdit}>수정하기</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                    삭제하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <button onClick={handleFavorite} className="cursor-pointer">
            {isFavorite ? <Icon name="filledStar" variant="orange" /> : <Icon name="outlineStar" />}
          </button>
        </div>
      </div>
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="할 일을 삭제하시겠어요?"
        description="삭제된 할 일은 복구할 수 없습니다."
        onConfirm={handleDelete}
      />
    </li>
  );
}
