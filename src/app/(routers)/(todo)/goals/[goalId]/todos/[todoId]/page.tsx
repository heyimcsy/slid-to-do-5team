import TodoDetailContainer from '@/app/(routers)/(todo)/goals/[goalId]/todos/[todoId]/_components/TodoDetailContainer';

export default async function TodoIdPage({ params }: { params: Promise<{ todoId: string }> }) {
  const { todoId } = await params;
  return (
    <div>
      <TodoDetailContainer todoId={Number(todoId)} />
    </div>
  );
}
