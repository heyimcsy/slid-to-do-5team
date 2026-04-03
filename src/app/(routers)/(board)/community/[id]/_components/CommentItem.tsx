'use client';

import type { Comment } from '../../types';

import { useState } from 'react';
import { toast } from 'sonner';

import { formatRelativeTime } from '@/utils/formatRelativeTime';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { KebabMenu } from '@/components/common/KebabMenu';

import { WriterAvatar } from '../../_components/WriterAvatar';

interface CommentItemProps {
  comment: Comment;
  isMyComment: boolean;
  onDelete: (commentId: number, options?: { onError?: () => void }) => void;
  isDeleting: boolean;
}

export function CommentItem({ comment, isMyComment, onDelete, isDeleting }: CommentItemProps) {
  const { content, createdAt, writer } = comment;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const kebabItems = [
    { label: '삭제하기', onClick: () => setDeleteDialogOpen(true), variant: 'danger' as const },
  ];

  return (
    <li className="flex flex-col gap-3">
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="정말 삭제하시겠어요?"
        description="삭제된 댓글은 복구할 수 없습니다."
        onConfirm={() => {
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

      <div className="flex flex-col gap-2">
        <p className="font-sm-regular md:font-base-regular text-gray-700">{content}</p>
        <span className="font-xs-regular md:font-sm-regular text-gray-400">
          {formatRelativeTime(createdAt)}
        </span>
      </div>
    </li>
  );
}
