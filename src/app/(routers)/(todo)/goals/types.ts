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
  isFavorite: boolean;
}
export interface TodoSectionProps {
  goalId: number;
  done: boolean;
  title: string;
  bgColor: string;
  emptyImage: string;
  emptyText: string;
  showActions?: boolean;
  clickedId?: number | null;
  onClickItem?: (index: number) => void;
}

export interface ItemActionBarProps {
  id: number;
  goalId: number;
  noteIds: number[];
  linkUrl: string | null;
  isFavorite: boolean;
}
