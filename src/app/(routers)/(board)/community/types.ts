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
  parentId: number | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  writer: Writer;
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
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

export interface PostInput {
  title: string;
  content: string;
  image?: string | null;
}

export interface CommentsResponse {
  comments: Comment[];
  nextCursor: string | null;
  totalCount: number;
}

export interface CommentLikeResponse {
  isLiked: boolean;
  likeCount: number;
}
