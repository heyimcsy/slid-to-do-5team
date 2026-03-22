import type { Post } from '../types';

import { PostDetailClient } from './PostDetailClient';

// TODO: API 연동 후 실제 데이터로 교체 예정
const MOCK_POST: Post = {
  id: 1,
  teamId: 'team',
  userId: 1,
  title: '할 일은 많은데 우선순위를 어떻게 정하시나요?',
  content:
    '요즘 할 일이 너무 많아서 어디서부터 손대야 할지 모르겠어요 😅\n여러분은 중요도나 긴급도를 기준으로 나누시나요, 아니면 그냥 순서대로 하시나요?\n\n추천 방법이 있다면 공유해 주세요!',
  image: null,
  viewCount: 281,
  createdAt: '2025-05-22T00:00:00.000Z',
  updatedAt: '2025-05-22T00:00:00.000Z',
  writer: {
    id: 1,
    name: '체다치즈',
    image: null,
  },
  commentCount: 3,
};

export default function PostDetailPage() {
  return <PostDetailClient post={MOCK_POST} />;
}
