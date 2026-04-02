'use client';

import type { Comment } from '../../types';

import { useEffect, useMemo, useState } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { toast } from 'sonner';

import { useCreateComment, useDeleteComment, useGetComments } from '../../_api/communityQueries';
import { CommentItem } from './CommentItem';

interface CommentSectionProps {
  postId: number;
  totalCount: number;
  userId: number | undefined;
  isPostDeleting?: boolean;
  onPendingChange?: (isPending: boolean) => void;
}

export function CommentSection({
  postId,
  totalCount,
  userId,
  isPostDeleting = false,
  onPendingChange,
}: CommentSectionProps) {
  const {
    data: commentsData,
    isError,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetComments(postId);

  const comments: Comment[] = useMemo(() => {
    const all = (commentsData?.pages ?? []).flatMap((page) => page.comments);
    return Array.from(new Map(all.map((c) => [c.id, c])).values());
  }, [commentsData]);

  const [inputValue, setInputValue] = useState('');
  const { mutate: createComment, isPending: isCreating } = useCreateComment(postId);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(postId);

  const isBusy = isPostDeleting || isFetching;

  useEffect(() => {
    onPendingChange?.(isCreating || isDeleting);
  }, [isCreating, isDeleting, onPendingChange]);

  const { observerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const handleSubmit = () => {
    if (!inputValue.trim() || isCreating) return;
    createComment(inputValue, {
      onSuccess: () => setInputValue(''),
      onError: () => toast.error('댓글 등록에 실패했습니다. 다시 시도해주세요.'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-0.5">
        <span className="font-base-semibold md:font-lg-semibold text-gray-800">댓글</span>
        <span className="font-base-semibold md:font-lg-semibold text-orange-600">{totalCount}</span>
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
          disabled={isBusy}
          placeholder="댓글을 입력해주세요"
          aria-label="댓글 입력"
          className="font-sm-regular md:font-base-regular flex-1 rounded-xl border border-gray-300 px-3 py-3 text-gray-700 outline-none placeholder:text-gray-500 disabled:bg-gray-50 md:rounded-2xl md:px-4 md:py-4"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isBusy || isCreating}
          className="font-sm-semibold md:font-base-semibold w-16 shrink-0 rounded-full bg-orange-500 py-2.5 text-white disabled:cursor-not-allowed disabled:bg-gray-300 md:w-20 md:py-3"
        >
          등록
        </button>
      </div>

      {isError ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <p className="font-sm-regular text-gray-500">댓글을 불러오지 못했습니다.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="font-sm-medium text-orange-500 underline"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-8 md:gap-10">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isMyComment={comment.userId === userId}
                onDelete={deleteComment}
                isDeleting={isBusy}
              />
            ))}
          </ul>
          <div ref={observerRef} className="h-4" />
        </>
      )}
    </div>
  );
}
