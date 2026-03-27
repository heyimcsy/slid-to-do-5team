export type TagColor = 'gray' | 'red' | 'green' | 'purple' | 'yellow';

export interface NoteTag {
  name: string;
  color: TagColor;
}

export interface Note {
  id: number;
  title: string;
  goalTitle: string;
  todoTitle: string;
  isDone: boolean;
  updatedAt: string; // 'YYYY. MM. DD'
  tags: NoteTag[];
  linkUrl?: string;
  linkTitle?: string;
  content: string; // JSON.stringify(TipTapDoc)
}
