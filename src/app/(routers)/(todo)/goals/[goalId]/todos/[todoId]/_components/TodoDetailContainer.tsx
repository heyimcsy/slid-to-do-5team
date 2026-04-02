'use client';

import { useGetNote } from '@/api/notes';
import { useGetTodo } from '@/api/todos';
import { TodoDetailContent } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/_components/TodoDetailContent';
import { TodoDetailSkeleton } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/_components/TodoDetailSkeleton';

export default function TodoDetailContainer({ todoId }: { todoId: number }) {
  const { data, isLoading, isSuccess } = useGetTodo({ id: todoId });
  const noteId = data?.noteIds?.[0];
  const { data: noteData } = useGetNote({ id: Number(noteId) });

  if (isLoading) return <TodoDetailSkeleton />;
  if (isSuccess)
    return (
      <div className="h-fit w-fit rounded-[28px] bg-white p-6">
        <TodoDetailContent
          title={data.title}
          done={data.done ? 'DONE' : 'TO DO'}
          goalTitle={data.goal.title}
          goalId={data.goalId}
          dueDate={data.dueDate}
          tags={data.tags}
          linkUrl={data.linkUrl}
          noteTitle={noteData?.title}
          noteId={noteData?.id}
          todoId={Number(todoId)}
        />
      </div>
    );
}
