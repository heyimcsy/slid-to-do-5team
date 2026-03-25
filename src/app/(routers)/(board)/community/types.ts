export type SortOption = '최신순' | '인기순';

export interface Writer {
  id: number;
  name: string;
  image: string | null;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  writer: Writer;
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

export interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
  totalCount: number;
}

export interface UpdatePostInput {
  title: string;
  content: string;
  image?: string | null;
}

export interface User {
  id: number;
  email: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}
