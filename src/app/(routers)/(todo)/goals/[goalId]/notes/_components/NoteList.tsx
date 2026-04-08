import type { Notes } from '@/api/notes';
import type { Ref } from 'react';

import Image from 'next/image';
import emptyImage from '@/../public/images/big-zero-done.svg';

import NoteCard from './NoteCard';

interface NoteListProps {
  notes: Notes[];
  goalId: number;
  observerRef: Ref<HTMLDivElement>;
  hasNextPage: boolean;
}

export default function NoteList({ notes, goalId, observerRef, hasNextPage }: NoteListProps) {
  return (
    <>
      {notes.length === 0 ? (
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
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 pb-10 lg:grid-cols-2">
          {notes.map((note: Notes) => (
            <NoteCard
              key={note.id}
              goalId={goalId}
              id={note.id}
              title={note.title}
              todo={note.todo}
              createdAt={note.createdAt}
            />
          ))}
        </div>
      )}
      {hasNextPage && <div ref={observerRef} className="h-1" />}
    </>
  );
}
