import NoteEditContainer from '@/app/(routers)/(todo)/goals/[goalId]/notes/[noteId]/edit/_components/NoteEditContainer';

export default async function NoteDetailPage({ params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params;
  return <NoteEditContainer noteId={Number(noteId)} />;
}
