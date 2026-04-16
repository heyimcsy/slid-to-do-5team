'use client';

import { useGetNote } from '@/api/notes';
import {
  NewNoteSkeleton,
  NoteCommonFormat,
} from '@/app/(routers)/(todo)/goals/[goalId]/notes/_components';

import { ErrorFallback } from '@/components/ErrorFallback';

export default function NoteEditContainer({ noteId }: { noteId: number }) {
  const { data, isSuccess, isLoading, isError, refetch } = useGetNote({ id: noteId });

  if (isLoading) return <NewNoteSkeleton />;
  if (isError) return <ErrorFallback onRetry={refetch} title={'노트 수정하기'} />;
  if (isSuccess)
    return (
      <NoteCommonFormat
        type={'edit'}
        noteTitle={data?.title}
        noteId={noteId}
        todoData={data?.todo}
        noteLinkUrl={data?.linkUrl}
        noteContent={data?.content}
      />
    );
}
