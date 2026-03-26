import Link from 'next/link';
import { mockTodo } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/edit/page';

export default function EditPage() {
  const goalId = mockTodo.goalId;
  const todoId = mockTodo.id;

  return (
    <div>
      <Link href={`/goals/${goalId}/todos/${todoId}/edit`}>수정</Link>
    </div>
  );
}
