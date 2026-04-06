// app/@modal/(.)goals/[goalId]/todos/[todoId]/edit/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetTodo } from '@/api/todos';

import { EditForm } from '../_components/EditForm';
import CancelConfirmModal from '../../../../todos/new/_components/CancelConfirm';

export default function EditPage() {
  const { todoId } = useParams<{ todoId: string }>();
  const { data: todo, isPending } = useGetTodo({ id: Number(todoId) });
  const router = useRouter();
  const [showCancel, setShowCancel] = useState(false);

  if (isPending || !todo) return null;
  if (!todo.goal) return null;

  return (
    <>
      {showCancel && (
        <CancelConfirmModal
          onConfirm={() => router.back()} // 나가기
          onCancel={() => setShowCancel(false)} // 돌아가기
        />
      )}
      <EditForm todo={todo} onCancel={() => setShowCancel(true)} />;
    </>
  );
}
