import React from 'react';

export interface TodoListProps {
  content: string;
  checked: boolean;
  link: boolean;
  note: boolean;
  favorites: boolean;
  clicked?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
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
