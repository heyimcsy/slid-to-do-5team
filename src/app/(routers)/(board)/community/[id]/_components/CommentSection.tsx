'use client';

import type { Comment } from '../../types';

import { useState } from 'react';

import { CommentItem } from './CommentItem';

interface CommentSectionProps {
  comments: Comment[];
  userId: number | undefined;
  commentCount: number;
}

export function CommentSection({ comments, userId, commentCount }: CommentSectionProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
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
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} isMyComment={comment.userId === userId} />
        ))}
      </ul>
    </div>
  );
}
