'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NewTodoPage() {
  const router = useRouter();
  const params = useParams();
  return (
    <div>
      <Button onClick={() => router.push(`/goals/${params.goalId}/todos/new`)}>+ 할 일 추가</Button>
    </div>
  );
}
