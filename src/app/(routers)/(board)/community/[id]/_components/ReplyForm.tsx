'use client';

import type { CommentForm } from './CommentInput';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreateComment } from '../../_api/communityQueries';
import { CommentInput, commentSchema } from './CommentInput';

interface ReplyFormProps {
  postId: number;
  parentId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReplyForm({ postId, parentId, onSuccess, onCancel }: ReplyFormProps) {
  const { register, handleSubmit, reset, watch } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const contentValue = watch('content');
  const { mutate: createReply, isPending } = useCreateComment(postId);

  const onSubmit = ({ content }: CommentForm) => {
    createReply(
      { content, parentId },
      {
        onSuccess: () => {
          reset();
          onSuccess();
        },
        onError: () => toast.error('답글 등록에 실패했습니다.'),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 pl-10">
      <CommentInput
        register={register('content')}
        contentLength={contentValue?.length ?? 0}
        variant="underline"
      />
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            onCancel();
          }}
          disabled={isPending}
          className="font-sm-semibold rounded-full border border-gray-300 px-4 py-2 text-gray-500 disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!contentValue?.trim() || isPending}
          className="font-sm-semibold rounded-full bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
        >
          등록
        </button>
      </div>
    </form>
  );
}
