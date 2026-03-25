export interface TodoListProps {
  id: number;
  content: string;
  done: boolean;
  link: string | null;
  noteIds: number[];
  favorites: boolean;
}
export interface TodoSectionProps {
  title: string;
  todos: TodoListProps[];
  bgColor: string;
  emptyImage: string;
  emptyText: string;
  showActions?: boolean;
  clickedId?: number | null;
  onClickItem?: (index: number) => void;
}
