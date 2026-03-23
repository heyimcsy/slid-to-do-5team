import type { Post } from '../types';

import { PostDetailClient } from './PostDetailClient';

// TODO: API 연동 후 실제 데이터로 교체 예정
const MOCK_POST: Post = {
  id: 1,
  teamId: 'team',
  userId: 1,
  title: '할 일은 많은데 우선순위를 어떻게 정하시나요?',
  content: JSON.stringify({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: '요즘 할 일이 너무 많아서 어디서부터 손대야 할지 모르겠어요 😅' },
        ],
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: '여러분은 ' },
          { type: 'text', marks: [{ type: 'bold' }], text: '중요도' },
          { type: 'text', text: '나 ' },
          { type: 'text', marks: [{ type: 'bold' }], text: '긴급도' },
          { type: 'text', text: '를 기준으로 나누시나요, 아니면 그냥 순서대로 하시나요?' },
        ],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: '추천 방법이 있다면 공유해 주세요!' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: '아이젠하워 매트릭스 (중요도 × 긴급도)' }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'GTD (Getting Things Done)' }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: '시간 블로킹' }],
              },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: '저는 ' },
          { type: 'text', marks: [{ type: 'italic' }], text: '아이젠하워 매트릭스' },
          { type: 'text', text: '를 활용해서 중요도와 긴급도로 나눠서 처리하고 있어요. 여러분도 한번 시도해보세요!' },
        ],
      },
    ],
  }),
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
