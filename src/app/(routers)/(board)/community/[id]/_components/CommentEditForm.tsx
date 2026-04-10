'use client';

import type { CommentForm } from './CommentInput';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useUpdateComment } from '../../_api/communityQueries';
import { CommentInput, commentSchema } from './CommentInput';

interface CommentEditFormProps {
  postId: number;
  commentId: number;
  initialContent: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CommentEditForm({
  postId,
  commentId,
  initialContent,
  onSuccess,
  onCancel,
}: CommentEditFormProps) {
  const { register, handleSubmit, reset, watch } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: initialContent },
  });

  const contentValue = watch('content');
  const { mutate: updateComment, isPending } = useUpdateComment(postId, commentId);

  const onSubmit = ({ content }: CommentForm) => {
    updateComment(content, {
      onSuccess: () => {
        reset();
        onSuccess();
      },
      onError: () => toast.error('댓글 수정에 실패했습니다.'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 pt-1.5">
      <CommentInput
        register={register('content')}
        contentLength={contentValue?.length ?? 0}
        variant="underline"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            onCancel();
          }}
          disabled={isPending}
          className="font-sm-semibold w-16 rounded-full border border-gray-300 px-[18px] py-[10px] text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!contentValue?.trim() || contentValue === initialContent || isPending}
          className="font-sm-semibold w-16 rounded-full bg-orange-500 px-[18px] py-[10px] text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          수정
        </button>
      </div>
    </form>
  );
}
