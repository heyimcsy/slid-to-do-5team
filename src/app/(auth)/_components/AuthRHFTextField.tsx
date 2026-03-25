'use client';

import type { InputProps } from '@/components/ui/input';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { useController } from 'react-hook-form';

import { Input } from '@/components/ui/input';

type AuthRHFTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
} & Omit<InputProps, 'errorMessage' | 'name' | 'onBlur' | 'onChange' | 'ref' | 'value'>;

/**
 * 필드별 `useController`로 에러/값 구독을 분리해, 상위 폼이 `errors` 전체를 구독하지 않게 한다.
 */
export const AuthRHFTextField = <T extends FieldValues>({
  control,
  name,
  ...inputProps
}: AuthRHFTextFieldProps<T>) => {
  const { field, fieldState } = useController({ control, name });

  return <Input {...field} {...inputProps} errorMessage={fieldState.error?.message} />;
};
