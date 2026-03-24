export type SortOption = '최신순' | '인기순';

export interface Writer {
  id: number;
  name: string;
  image: string | null;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  writer: Writer;
  isMyComment: boolean;
}

export interface Post {
  id: number;
  teamId: string;
  userId: number;
  title: string;
  content: string;
  image: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  writer: Writer;
  commentCount: number;
}
