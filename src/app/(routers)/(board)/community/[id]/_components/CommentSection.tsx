'use client';

import type { Comment } from '../../types';
import type { CommentForm } from './CommentInput';

import { useEffect, useMemo } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreateComment, useDeleteComment, useGetComments } from '../../_api/communityQueries';
import { CommentInput, commentSchema } from './CommentInput';
import { CommentItem } from './CommentItem';

interface CommentSectionProps {
  postId: number;
  userId: number | undefined;
  isPostDeleting?: boolean;
  onPendingChange?: (isPending: boolean) => void;
}

export function CommentSection({
  postId,
  userId,
  isPostDeleting = false,
  onPendingChange,
}: CommentSectionProps) {
  const { data, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useGetComments(postId);

  const comments: Comment[] = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page.comments),
    [data],
  );

  const { observerRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

  const { mutate: createComment, isPending: isCreating } = useCreateComment(postId);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(postId);

  const isBusy = isPostDeleting || isFetching;

  const { register, handleSubmit, reset, watch } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const contentValue = watch('content');

  useEffect(() => {
    onPendingChange?.(isCreating || isDeleting);
  }, [isCreating, isDeleting, onPendingChange]);

  const onSubmit = ({ content }: CommentForm) => {
    createComment(
      { content },
      {
        onSuccess: () => reset(),
        onError: () => toast.error('댓글 등록에 실패했습니다.'),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-0.5">
        <span className="font-base-semibold md:font-lg-semibold text-gray-800">댓글</span>
        <span className="font-base-semibold md:font-lg-semibold text-orange-600">
          {data?.pages[0]?.totalCount}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 md:gap-4">
        <CommentInput register={register('content')} contentLength={contentValue?.length ?? 0} />
        <button
          type="submit"
          disabled={!contentValue?.trim() || isBusy || isCreating}
          className="font-sm-semibold md:font-base-semibold w-16 shrink-0 rounded-full bg-orange-500 py-2.5 text-white disabled:cursor-not-allowed disabled:bg-gray-300 md:w-20 md:py-3"
        >
          등록
        </button>
      </form>

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
                userId={userId}
              />
            ))}
          </ul>
          <div ref={observerRef} />
        </>
      )}
    </div>
  );
}
