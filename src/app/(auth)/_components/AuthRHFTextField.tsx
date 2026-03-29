'use client';

import type { InputProps } from '@/components/ui/input';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { useController } from 'react-hook-form';

import { Input } from '@/components/ui/input';

type AuthRHFTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  /** true면 검증 메시지는 토스트 등으로만 보여 주고 인라인 표시 안 함 */
  hideValidationMessage?: boolean;
} & Omit<InputProps, 'errorMessage' | 'name' | 'onBlur' | 'onChange' | 'ref' | 'value'>;

/**
 * 필드별 `useController`로 에러/값 구독을 분리해, 상위 폼이 `errors` 전체를 구독하지 않게 한다.
 */
export const AuthRHFTextField = <T extends FieldValues>({
  control,
  name,
  hideValidationMessage,
  ...inputProps
}: AuthRHFTextFieldProps<T>) => {
  const { field, fieldState } = useController({ control, name });

  return (
    <Input
      {...field}
      {...inputProps}
      errorMessage={hideValidationMessage ? undefined : fieldState.error?.message}
      invalid={hideValidationMessage ? !!fieldState.error : undefined}
    />
  );
};
