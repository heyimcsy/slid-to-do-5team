'use client';

import type { Comment } from '../../types';
import type { CommentForm } from './CommentInput';

import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { formatRelativeTime } from '@/utils/formatRelativeTime';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { KebabMenu } from '@/components/common/KebabMenu';
import { Icon } from '@/components/icon/Icon';
import { HeartIcon } from '@/components/icon/icons/Heart';

import {
  useCreateCommentLike,
  useDeleteCommentLike,
  useUpdateComment,
} from '../../_api/communityQueries';
import { WriterAvatar } from '../../_components/WriterAvatar';
import { CommentInput, commentSchema } from './CommentInput';

interface CommentItemProps {
  comment: Comment;
  isMyComment: boolean;
  onDelete: (commentId: number, options?: { onError?: () => void }) => void;
  isDeleting: boolean;
  replies?: Comment[];
  userId?: number;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  isMyComment,
  onDelete,
  isDeleting,
  replies,
  userId,
  isReply = false,
}: CommentItemProps) {
  const { content, createdAt, writer } = comment;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const { register, handleSubmit, reset, watch } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content },
  });

  const contentValue = watch('content');

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(
    comment.postId,
    comment.id,
  );
  const { mutate: createCommentLike, isPending: isLiking } = useCreateCommentLike(
    comment.postId,
    comment.id,
  );
  const { mutate: deleteCommentLike, isPending: isUnliking } = useDeleteCommentLike(
    comment.postId,
    comment.id,
  );
  const isLikePending = isLiking || isUnliking;

  const isLikedRef = useRef(comment.isLiked);
  useEffect(() => {
    isLikedRef.current = comment.isLiked;
  }, [comment.isLiked]);

  const kebabItems = [
    { label: '수정하기', onClick: () => setIsEditing(true) },
    { label: '삭제하기', onClick: () => setDeleteDialogOpen(true), variant: 'danger' as const },
  ];

  const onSubmit = ({ content }: CommentForm) => {
    if (!isMyComment) {
      toast.error('본인이 작성한 댓글만 수정할 수 있습니다.');
      return;
    }

    updateComment(content, {
      onSuccess: () => {
        reset();
        setIsEditing(false);
      },
      onError: () => toast.error('댓글 수정에 실패했습니다.'),
    });
  };

  const handleLikeClick = useDebouncedCallback(() => {
    if (isLikedRef.current) {
      deleteCommentLike();
    } else {
      createCommentLike();
    }
  }, 300);

  return (
    <li className={cn('flex flex-col gap-4', isReply && 'pl-10')}>
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="정말 삭제하시겠어요?"
        description="삭제된 댓글은 복구할 수 없습니다."
        onConfirm={() => {
          if (!isMyComment) {
            toast.error('본인이 작성한 댓글만 삭제할 수 있습니다.');
            setDeleteDialogOpen(false);
            return;
          }

          onDelete(comment.id, {
            onError: () => toast.error('댓글 삭제에 실패했습니다. 다시 시도해주세요.'),
          });
        }}
      />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WriterAvatar name={writer.name} image={writer.image} size={isReply ? 'sm' : 'md'} />
            <span
              className={cn(
                'text-gray-500',
                isReply ? 'font-xs-regular' : 'font-xs-regular md:font-sm-regular',
              )}
            >
              {writer.name}
            </span>
          </div>
          {isMyComment && <KebabMenu items={kebabItems} disabled={isDeleting} />}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <CommentInput
              register={register('content')}
              contentLength={contentValue?.length ?? 0}
              variant="edit"
            />
            <div className="flex items-center justify-between">
              <span className="font-xs-regular md:font-sm-regular text-gray-400">
                {formatRelativeTime(createdAt)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                  disabled={isUpdating}
                  className="font-sm-semibold w-16 rounded-full border border-gray-300 px-[18px] py-[10px] text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!contentValue?.trim() || contentValue === content || isUpdating}
                  className="font-sm-semibold w-16 rounded-full bg-orange-500 px-[18px] py-[10px] text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  수정
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-2 pt-1 pl-8">
            <p
              className={cn(
                'text-gray-700',
                isReply
                  ? 'font-xs-regular md:font-sm-regular'
                  : 'font-sm-regular md:font-base-regular',
              )}
            >
              {content}
            </p>
            <div className="flex items-center gap-3">
              <span className="font-xs-regular md:font-sm-regular text-gray-400">
                {formatRelativeTime(createdAt)}
              </span>
              <button
                type="button"
                aria-label={comment.isLiked ? '좋아요 취소' : '좋아요'}
                onClick={handleLikeClick}
                disabled={isLikePending}
                className="flex items-center gap-1 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <HeartIcon aria-hidden filled={comment.isLiked} width={16} height={16} />
                {comment.likeCount > 0 && (
                  <span className="font-xs-regular">{comment.likeCount}</span>
                )}
              </button>
              {!isReply && (
                <button type="button" className="font-xs-regular text-gray-400">
                  답글
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {!isReply && replies && replies.length > 0 && (
        <>
          {!showReplies && (
            <button
              type="button"
              onClick={() => setShowReplies(true)}
              className="font-xs-semibold flex items-center gap-1 text-gray-400"
            >
              <span>답글 {replies.length}개 보기</span>
              <Icon name="arrow" direction="down" />
            </button>
          )}
          {showReplies && (
            <div className="relative">
              <ul className="flex flex-col gap-4 pt-1">
                {replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    isMyComment={reply.userId === userId}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                    isReply
                  />
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setShowReplies(false)}
                className="font-xs-semibold mt-3 flex items-center gap-1 text-gray-400"
              >
                <span>답글 숨기기</span>
                <Icon name="arrow" direction="up" />
              </button>
            </div>
          )}
        </>
      )}
    </li>
  );
}
