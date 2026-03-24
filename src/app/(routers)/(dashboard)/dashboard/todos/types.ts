export type FilterType = 'ALL' | 'TODO' | 'DONE';

export interface Task {
  id: number;
  content: string;
  checked: boolean;
  link: boolean;
  note: boolean;
  favorites: boolean;
}
