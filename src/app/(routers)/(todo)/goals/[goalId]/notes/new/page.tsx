'use client';

import { useSearchParams } from 'next/navigation';
import { useGetTodo } from '@/api/todos';

import { NewNoteSkeleton, NoteCommonFormat } from '../_components';

export default function NewNotePage() {
  const searchParams = useSearchParams();
  const todoId: number = Number(searchParams.get('todoId'));
  const {
    data: todoData,
    isLoading: todoIsLoading,
    isSuccess: todoIsSuccess,
  } = useGetTodo({ id: todoId });

  if (todoIsLoading) return <NewNoteSkeleton />;
  if (todoIsSuccess) return <NoteCommonFormat type={'new'} todoData={todoData} />;
}
