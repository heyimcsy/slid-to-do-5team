'use client';

import type { ComponentProps } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { useCallback, useState } from 'react';
import { useController } from 'react-hook-form';

import { Input } from '@/components/ui/input';

import { PasswordToggleButton } from './PasswordToggleButton';

export type PasswordFieldWithToggleProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  id: string;
  className?: string;
  placeholder?: string;
  autoComplete: ComponentProps<'input'>['autoComplete'];
  /** true면 인라인 텍스트는 숨기되, `sr-only`·`aria-describedby`로 오류 설명은 유지 */
  hideValidationMessage?: boolean;
};

/**
 * 비밀번호 표시 상태는 내부에 두고, `useCallback`으로 토글 참조를 고정해
 * `PasswordToggleButton`(memo)이 입력값 변경 시 불필요하게 다시 그려지지 않도록 한다.
 * 검증 메시지는 `useController`의 `fieldState`에서만 구독한다.
 */
export const PasswordFieldWithToggle = <T extends FieldValues>({
  className,
  placeholder,
  control,
  name,
  id,
  autoComplete,
  hideValidationMessage,
}: PasswordFieldWithToggleProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => setShowPassword((v) => !v), []);
  const { field, fieldState } = useController({ control, name });

  return (
    <Input
      {...field}
      id={id}
      className={className}
      placeholder={placeholder}
      type={showPassword ? 'text' : 'password'}
      autoComplete={autoComplete}
      errorMessage={fieldState.error?.message}
      errorMessageVisibility={hideValidationMessage ? 'sr-only' : 'visible'}
      invalid={hideValidationMessage ? !!fieldState.error : undefined}
      endAdornment={
        <PasswordToggleButton visible={showPassword} onToggle={togglePassword} controlsId={id} />
      }
    />
  );
};
