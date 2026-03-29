import DividedModal from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/_components/DividedModal';

export default async function TodoDetailModal({ params }: { params: Promise<{ todoId: string }> }) {
  const { todoId } = await params;
  return <DividedModal todoId={todoId} />;
}
