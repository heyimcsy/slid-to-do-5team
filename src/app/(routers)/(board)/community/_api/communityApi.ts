import type { Post } from '../types';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_TEAM_ID}`;

const getAccessToken = () => {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
};

const getAuthHeader = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

export interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
  totalCount: number;
}

// 게시물 전체 조회
export const getPosts = async (): Promise<PostsResponse> => {
  const res = await fetch(`${BASE_URL}/posts?type=all`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error('게시물을 불러오는데 실패했어요.');
  return res.json();
};
