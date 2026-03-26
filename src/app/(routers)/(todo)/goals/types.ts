import type { TodoWithFavorites } from '@/api/todos';

export interface TotalListTabProps {
  goalId: number;
}

export interface TodoListProps {
  goalId: number;
  id: number;
  done: boolean;
  title: string;
  noteIds: number[];
  linkUrl: string | null;
  favorites: boolean;
}
export interface TodoSectionProps {
  goalId: number;
  title: string;
  todos: TodoWithFavorites[];
  bgColor: string;
  emptyImage: string;
  emptyText: string;
  showActions?: boolean;
  clickedId?: number | null;
  onClickItem?: (index: number) => void;
}
