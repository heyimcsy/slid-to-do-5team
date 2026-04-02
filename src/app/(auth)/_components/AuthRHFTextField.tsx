'use client';

import type { InputProps } from '@/components/ui/input';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { useAuthFieldValidationHandlers } from '@/hooks/auth/useAuthFieldValidationHandlers';
import { useController } from 'react-hook-form';

import { Input } from '@/components/ui/input';

type AuthRHFTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  /** true면 인라인 텍스트는 숨기되, `sr-only`·`aria-describedby`로 오류 설명은 유지 */
  hideValidationMessage?: boolean;
  /** blur(dirty 시) 검증 토스트 — 보통 `() => void handleSubmit(() => {}, toastInvalid)()` */
  onValidateToast?: () => void;
} & Omit<
  InputProps,
  'errorMessage' | 'name' | 'onBlur' | 'onChange' | 'onFocus' | 'ref' | 'value'
> & {
    onChange?: InputProps['onChange'];
    onBlur?: InputProps['onBlur'];
    onFocus?: InputProps['onFocus'];
  };

/**
 * 필드별 `useController`로 에러/값 구독을 분리해, 상위 폼이 `errors` 전체를 구독하지 않게 한다.
 */
export const AuthRHFTextField = <T extends FieldValues>({
  control,
  name,
  hideValidationMessage,
  onValidateToast,
  ...inputProps
}: AuthRHFTextFieldProps<T>) => {
  const { field, fieldState } = useController({ control, name });
  const { onChange, onBlur } = useAuthFieldValidationHandlers<T>({
    field,
    fieldState,
    onValidateToast,
  });
  const {
    onChange: onChangeProp,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    ...restInputProps
  } = inputProps;

  return (
    <Input
      {...field}
      {...restInputProps}
      onChange={(e) => {
        onChange(e);
        onChangeProp?.(e);
      }}
      onBlur={(e) => {
        onBlur();
        onBlurProp?.(e);
      }}
      onFocus={(e) => {
        onFocusProp?.(e);
      }}
      errorMessage={fieldState.error?.message}
      errorMessageVisibility={hideValidationMessage ? 'sr-only' : 'visible'}
      invalid={hideValidationMessage ? !!fieldState.error : undefined}
    />
  );
};
