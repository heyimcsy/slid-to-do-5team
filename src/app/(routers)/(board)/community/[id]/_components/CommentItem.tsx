'use client';

import type { Comment } from '../../types';
import type { CommentForm } from './CommentInput';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { formatRelativeTime } from '@/utils/formatRelativeTime';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { KebabMenu } from '@/components/common/KebabMenu';

import { useUpdateComment } from '../../_api/communityQueries';
import { WriterAvatar } from '../../_components/WriterAvatar';
import { CommentInput, commentSchema } from './CommentInput';

interface CommentItemProps {
  comment: Comment;
  isMyComment: boolean;
  onDelete: (commentId: number, options?: { onError?: () => void }) => void;
  isDeleting: boolean;
}

export function CommentItem({ comment, isMyComment, onDelete, isDeleting }: CommentItemProps) {
  const { content, createdAt, writer } = comment;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content },
  });

  const contentValue = watch('content');

  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(
    comment.postId,
    comment.id,
  );

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

  return (
    <li className="flex flex-col gap-3">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WriterAvatar name={writer.name} image={writer.image} />
          <span className="font-xs-regular md:font-sm-regular text-gray-500">{writer.name}</span>
          {isMyComment && (
            <span className="font-xs-medium rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700">
              내 댓글
            </span>
          )}
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
        <div className="flex flex-col gap-2">
          <p className="font-sm-regular md:font-base-regular text-gray-700">{content}</p>
          <span className="font-xs-regular md:font-sm-regular text-gray-400">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
      )}
    </li>
  );
}
