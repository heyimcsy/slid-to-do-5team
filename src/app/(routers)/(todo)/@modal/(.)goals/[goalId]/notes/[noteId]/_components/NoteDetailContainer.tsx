'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import NoteDetailContent from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/notes/[noteId]/_components/NoteDetailContent';
import NoteDetailSkeleton from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/notes/[noteId]/_components/NoteDetailSkeleton';
import { useOgInfo } from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/hooks/useOgInfo';
import { useNoteDetail } from '@/hooks/useNoteDetail';

import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function NoteDetailContainer({ noteId }: { noteId: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const todoId: number = Number(searchParams.get('todoId'));

  const { noteData, todoData, isLoading, isSuccess } = useNoteDetail({ noteId, todoId });
  const onClose = () => router.back();
  const { data: linkData } = useOgInfo(todoData?.linkUrl);

  if (isLoading) return <NoteDetailSkeleton />;
  if (!isSuccess || !noteData || !todoData) return null;
  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="right">
        <NoteDetailContent
          content={noteData?.content}
          noteTitle={noteData?.title}
          linkUrl={noteData?.linkUrl}
          done={todoData?.done}
          createdAt={todoData?.createdAt}
          goal={todoData?.goal}
          tags={todoData?.tags}
          todoTitle={todoData?.title}
          linkData={linkData}
        />
      </SheetContent>
    </Sheet>
  );
}
