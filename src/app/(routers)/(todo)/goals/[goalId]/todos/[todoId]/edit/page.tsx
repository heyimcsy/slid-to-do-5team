'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useGetTodo } from '@/api/todos';
import { EditForm } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/_components/EditForm';
import CancelConfirmModal from '@/app/(routers)/(todo)/@modal/(.)goals/todos/new/_components/CancelConfirm';

export default function EditPage() {
  const router = useRouter();
  const [showCancel, setShowCancel] = useState(false);
  const { todoId } = useParams<{ todoId: string }>();
  const { data: todo, isPending } = useGetTodo({ id: Number(todoId) });

  if (isPending || !todo) return null;
  if (!todo.goal) return null;

  if (showCancel) {
    return (
      <CancelConfirmModal
        onConfirm={() => router.back()} // 나가기
        onCancel={() => setShowCancel(false)} // 돌아가기
      />
    );
  }
  return (
    <div>
      <EditForm todo={todo} onCancel={() => setShowCancel(true)} />
    </div>
  );
}
