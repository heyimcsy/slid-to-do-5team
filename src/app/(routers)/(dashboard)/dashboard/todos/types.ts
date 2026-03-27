import type { Goal } from '@/api/goals';
import type { Tag } from '@/api/todos';

export type FilterType = 'ALL' | 'TODO' | 'DONE';

export interface Task {
  id: number;
  teamId: string;
  userId: number;
  goalId: number;
  title: string;
  done: boolean;
  fileUrl: string | null;
  linkUrl: string | null;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  goal: Pick<Goal, 'id' | 'title'>;
  noteIds: number[];
  tags: Tag[];
}
