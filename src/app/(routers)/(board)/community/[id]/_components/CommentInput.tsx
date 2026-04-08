import type { UseFormRegisterReturn } from 'react-hook-form';

import { cn } from '@/lib';
import { z } from 'zod';

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, '댓글을 입력해주세요')
    .max(500, '댓글은 최대 500자까지 입력할 수 있습니다.'),
});

export type CommentForm = z.infer<typeof commentSchema>;

interface CommentInputProps {
  register: UseFormRegisterReturn;
  contentLength?: number;
  disabled?: boolean;
  variant?: 'create' | 'edit';
}

export function CommentInput({
  register,
  contentLength = 0,
  disabled,
  variant = 'create',
}: CommentInputProps) {
  const isOverLimit = contentLength >= 500;

  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 items-center rounded-xl border bg-white px-3 py-3 md:rounded-2xl md:px-4 md:py-4',
        isOverLimit
          ? 'border-red-400 bg-red-50'
          : variant === 'edit'
            ? 'border-orange-500'
            : 'border-gray-300',
      )}
    >
      <input
        {...register}
        type="text"
        disabled={disabled}
        placeholder="댓글을 입력해주세요"
        maxLength={500}
        aria-label="댓글 입력"
        className={cn(
          'min-w-0 flex-1 pr-3 outline-none placeholder:text-gray-500 disabled:bg-transparent',
          variant === 'create' ? 'font-base-regular text-gray-500' : 'font-sm-regular text-black',
        )}
      />
      <span className="font-xs-regular shrink-0 text-gray-500">{contentLength}/500</span>
    </div>
  );
}
