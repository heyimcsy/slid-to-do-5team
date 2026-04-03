'use client';

import type { Comment } from '../../types';

import { useEffect, useMemo } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { cn } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { useCreateComment, useDeleteComment, useGetComments } from '../../_api/communityQueries';
import { CommentItem } from './CommentItem';

const schema = z.object({
  content: z.string().min(1, '댓글을 입력해주세요.').max(500, '500자 이내로 입력해주세요'),
});

type CommentForm = z.infer<typeof schema>;

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

  const { mutate: createComment, isPending: isCreating } = useCreateComment(postId);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(postId);

  const isBusy = isPostDeleting || isFetching;

  const { register, handleSubmit, reset, watch } = useForm<CommentForm>({
    resolver: zodResolver(schema),
  });

  const contentValue = watch('content');

  useEffect(() => {
    onPendingChange?.(isCreating || isDeleting);
  }, [isCreating, isDeleting, onPendingChange]);

  const { observerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const onSubmit = ({ content }: CommentForm) => {
    createComment(content, {
      onSuccess: () => reset(),
      onError: () => toast.error('댓글 등록에 실패했습니다.'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-0.5">
        <span className="font-base-semibold md:font-lg-semibold text-gray-800">댓글</span>
        <span className="font-base-semibold md:font-lg-semibold text-orange-600">{totalCount}</span>
      </div>

      <div className="flex gap-3 md:gap-4">
        <div
          className={cn(
            'flex flex-1 items-center justify-between rounded-xl border px-3 py-3 md:rounded-2xl md:px-4 md:py-4',
            contentValue?.length >= 500 ? 'border-red-400 bg-red-50' : 'border-gray-300',
          )}
        >
          <input
            {...register('content')}
            type="text"
            disabled={isBusy}
            placeholder="댓글을 입력해주세요"
            maxLength={500}
            aria-label="댓글 입력"
            className="font-sm-regular md:font-base-regular flex-1 pr-3 text-gray-700 outline-none placeholder:text-gray-500 disabled:bg-gray-50"
          />
          <span className="font-xs-regular text-gray-500">{contentValue?.length}/500</span>
        </div>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!contentValue?.trim() || isBusy || isCreating}
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
