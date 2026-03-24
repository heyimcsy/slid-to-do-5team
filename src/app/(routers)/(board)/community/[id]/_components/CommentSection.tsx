'use client';

import type { Comment } from '../../types';

import { useState } from 'react';

import { CommentItem } from './CommentItem';

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    content: '저도 아이젠하워 매트릭스 활용하고 있어요! 확실히 우선순위 정하기 편하더라고요.',
    createdAt: '2025-05-22T01:00:00.000Z',
    writer: { id: 2, name: '고길동', image: null },
    isMyComment: false,
  },
  {
    id: 2,
    content: '저는 그냥 중요한 것부터 하는 편인데, 매트릭스 한번 써봐야겠네요!',
    createdAt: '2025-05-22T02:00:00.000Z',
    writer: { id: 1, name: '체다치즈', image: null },
    isMyComment: true,
  },
  {
    id: 3,
    content: 'GTD 방식도 추천드려요. 일단 모든 할 일을 적고 나서 분류하면 머릿속이 훨씬 정리돼요.',
    createdAt: '2025-05-22T03:00:00.000Z',
    writer: { id: 3, name: '홍길동', image: null },
    isMyComment: false,
  },
];

interface CommentSectionProps {
  commentCount: number;
}

export function CommentSection({ commentCount }: CommentSectionProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    // TODO: 댓글 등록 API 연동
    setInputValue('');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-0.5">
        <span className="font-base-semibold md:font-lg-semibold text-gray-800">댓글</span>
        <span className="font-base-semibold md:font-lg-semibold text-orange-600">
          {commentCount}
        </span>
      </div>

      <div className="flex gap-3 md:gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="댓글을 입력해주세요"
          aria-label="댓글 입력"
          className="font-sm-regular md:font-base-regular flex-1 rounded-xl border border-gray-300 px-3 py-3 text-gray-700 outline-none placeholder:text-gray-500 md:rounded-2xl md:px-4 md:py-4"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          className="font-sm-semibold md:font-base-semibold w-16 shrink-0 rounded-full bg-orange-500 py-2.5 text-white disabled:cursor-not-allowed disabled:bg-gray-300 md:w-20 md:py-3"
        >
          등록
        </button>
      </div>

      <ul className="flex flex-col gap-8 md:gap-10">
        {MOCK_COMMENTS.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </ul>
    </div>
  );
}
