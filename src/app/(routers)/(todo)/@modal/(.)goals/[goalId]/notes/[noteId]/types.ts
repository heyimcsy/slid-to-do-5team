import type { Tags } from '@/api/todos';

export interface Note {
  id: number;
  title: string;
  goalTitle: string;
  todoTitle: string;
  done: boolean;
  createdAt: string; // 'YYYY. MM. DD'
  tags: Tags[];
  linkUrl?: string;
  linkTitle?: string;
  content: string; // JSON.stringify(TipTapDoc)
}
