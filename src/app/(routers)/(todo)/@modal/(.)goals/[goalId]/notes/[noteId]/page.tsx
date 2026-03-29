import NoteDetailContainer from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/notes/[noteId]/_components/NoteDetailContainer';

export default async function ModalPage({
  params,
}: {
  params: Promise<{ goalId: string; noteId: string }>;
}) {
  const { noteId } = await params;
  return <NoteDetailContainer noteId={Number(noteId)} />;
}
