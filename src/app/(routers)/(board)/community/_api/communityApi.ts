import type { Post } from '../types';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_TEAM_ID}`;

// 로그인 기능 구현 후 토큰 부분 수정 예정
const getAuthHeader = () => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
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
