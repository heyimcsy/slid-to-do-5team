'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetTodo } from '@/api/todos';
import { EditForm } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/_components/EditForm';
import CancelConfirmModal from '@/app/(routers)/(todo)/@modal/(.)goals/todos/new/_components/CancelConfirm';

import { Spinner } from '@/components/ui/spinner';

export default function EditPage() {
  const router = useRouter();
  const [showCancel, setShowCancel] = useState(false);
  const { todoId } = useParams<{ todoId: string }>();
  const { data: todo, isPending } = useGetTodo({ id: Number(todoId) });

  if (isPending || !todo) return <Spinner text="로딩 중" />;
  if (!todo.goal) return null;

  return (
    <>
      {showCancel && (
        <CancelConfirmModal
          onConfirm={() => router.back()} // 나가기
          onCancel={() => setShowCancel(false)} // 돌아가기
        />
      )}

      <EditForm todo={todo} onCancel={() => setShowCancel(true)} />
    </>
  );
}
