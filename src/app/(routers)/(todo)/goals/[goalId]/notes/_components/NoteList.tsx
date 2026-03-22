import Image from 'next/image';
import emptyImage from '@/../public/images/big-zero-done.svg';

import NoteCard from './NoteCard';

export interface NoteList {
  id: number;
  title: string;
  todoTitle: string;
  isDone: boolean;
  updatedAt: string;
}

export interface NoteListProps {
  notes: NoteList[];
}

export default function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="flex h-fit w-fit flex-col items-center space-y-4">
          <Image
            width={131}
            height={140}
            src={emptyImage}
            alt="생성된 노트가 없음을 알려주는 이미지"
            className="h-22.5 w-20 object-contain md:h-35 md:w-32.5"
          />
          <p className="font-base-regular text-gray-400">아직 등록된 노트가 없어요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      {notes.map((note: NoteList) => (
        <NoteCard key={note.id} {...note} />
      ))}
    </div>
  );
}
