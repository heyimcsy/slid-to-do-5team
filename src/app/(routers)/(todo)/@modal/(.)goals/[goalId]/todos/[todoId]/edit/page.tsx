// app/@modal/(.)goals/[goalId]/todos/[todoId]/edit/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useGetTodo } from '@/api/todos';

import { EditForm } from '../_components/EditForm';

export default function EditPage() {
  const { todoId } = useParams<{ todoId: string }>();
  const { data: todo, isPending } = useGetTodo({ id: Number(todoId) });

  if (isPending || !todo) return null;
  if (!todo.goal) return null;

  return <EditForm todo={todo} />;
}
