import NoteDetailContainer from '@/app/(routers)/(todo)/goals/[goalId]/notes/[noteId]/_components/NoteDetailContainer';

export default async function NoteDetailPage({ params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params;
  return <NoteDetailContainer noteId={Number(noteId)} />;
}
