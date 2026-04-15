import NoteDetailContainer from './_components/NoteDetailContainer';

export default async function NoteDetailPage({ params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params;
  return <NoteDetailContainer noteId={Number(noteId)} />;
}
