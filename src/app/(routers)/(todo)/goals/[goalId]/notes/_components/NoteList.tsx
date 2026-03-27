import type { Notes, NotesWithGoalResponse } from '@/api/notes';

import Image from 'next/image';
import emptyImage from '@/../public/images/big-zero-done.svg';

import NoteCard from './NoteCard';

export interface NoteListProps {
  notesResponse: NotesWithGoalResponse;
}

export default function NoteList({ notesResponse }: NoteListProps) {
  if (notesResponse.notes.length === 0) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="flex h-fit w-fit flex-col items-center space-y-4">
          <Image
            width={131}
            height={140}
            src={emptyImage}
            alt="describe empty note situation"
            className="h-22.5 w-20 object-contain md:h-35 md:w-32.5"
          />
          <p className="font-base-regular text-gray-400">아직 등록된 노트가 없어요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 pb-10 lg:grid-cols-2">
      {notesResponse.notes.map((note: Notes) => (
        <NoteCard
          key={note.id}
          goalId={notesResponse.goalId as number}
          id={note.id}
          title={note.title}
          todo={note.todo}
          createdAt={note.createdAt}
        />
      ))}
    </div>
  );
}
