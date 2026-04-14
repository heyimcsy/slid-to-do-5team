'use client';

import type { Comment } from '../../types';

import { useMemo, useState } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useOptimisticToggle } from '@/hooks/useOptimisticToggle';
import { cn } from '@/lib';
import { toast } from 'sonner';

import { formatRelativeTime } from '@/utils/formatRelativeTime';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { KebabMenu } from '@/components/common/KebabMenu';
import { Icon } from '@/components/icon/Icon';
import { HeartIcon } from '@/components/icon/icons/Heart';

import { useGetCommentsByParentId, useToggleCommentLike } from '../../_api/communityQueries';
import { WriterAvatar } from '../../_components/WriterAvatar';
import { CommentEditForm } from './CommentEditForm';
import { ReplyForm } from './ReplyForm';

interface CommentItemProps {
  comment: Comment;
  isMyComment: boolean;
  onDelete: (commentId: number, options?: { onError?: () => void }) => void;
  isDeleting: boolean;
  userId?: number;
}

export function CommentItem({
  comment,
  isMyComment,
  onDelete,
  isDeleting,
  userId,
}: CommentItemProps) {
  const { content, createdAt, writer, replyCount, parentId } = comment;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading, isError, refetch } =
    useGetCommentsByParentId(comment.postId, comment.id, showReplies && parentId === null);

  const { mutate: toggleLike } = useToggleCommentLike(
    comment.postId,
    comment.id,
    comment.parentId ?? undefined,
  );

  const isReply = parentId !== null;

  const replyComments: Comment[] = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page.comments),
    [data],
  );

  const { observerRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

  const kebabItems = [
    { label: '수정하기', onClick: () => setIsEditing(true) },
    { label: '삭제하기', onClick: () => setDeleteDialogOpen(true), variant: 'danger' as const },
  ];

  const {
    value: isLiked,
    count: likeCount,
    toggle: handleLikeClick,
  } = useOptimisticToggle({
    serverValue: comment.isLiked,
    serverCount: comment.likeCount,
    onToggle: (serverIsLiked, { onError }) => toggleLike(serverIsLiked, { onError }),
  });

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
          <CommentEditForm
            postId={comment.postId}
            commentId={comment.id}
            initialContent={content}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex flex-col gap-2 pt-1 pl-9">
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
                aria-label={isLiked ? '좋아요 취소' : '좋아요'}
                onClick={handleLikeClick}
                className="flex items-center gap-1 text-gray-400 hover:text-gray-600"
              >
                <HeartIcon aria-hidden filled={isLiked} width={16} height={16} />
                {likeCount !== undefined && likeCount > 0 && (
                  <span className="font-xs-regular">{likeCount}</span>
                )}
              </button>
              {!isReply && (
                <button
                  type="button"
                  onClick={() => setIsReplying((prev) => !prev)}
                  className="font-xs-regular text-gray-400 hover:text-gray-600"
                >
                  답글
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {!isReply && isReplying && (
        <ReplyForm
          postId={comment.postId}
          parentId={comment.id}
          onSuccess={() => {
            setIsReplying(false);
            setShowReplies(true);
          }}
          onCancel={() => setIsReplying(false)}
        />
      )}

      {!isReply && replyCount > 0 && (
        <>
          {!showReplies && (
            <button
              type="button"
              onClick={() => setShowReplies(true)}
              className="font-xs-semibold flex items-center gap-1 text-gray-400"
            >
              <span>답글 {replyCount}개 보기</span>
              <Icon name="arrow" direction="down" />
            </button>
          )}
          {showReplies && (
            <div className="relative">
              {isLoading && (
                <div className="mx-auto my-2 size-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              )}
              {isError && (
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="font-sm-regular items-center pl-10 text-gray-500 underline"
                >
                  다시 시도
                </button>
              )}
              <ul className="flex flex-col gap-4 pt-1">
                {replyComments.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    isMyComment={reply.userId === userId}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
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
              <div ref={observerRef} />
            </div>
          )}
        </>
      )}
    </li>
  );
}
