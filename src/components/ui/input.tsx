'use client';

import * as React from 'react';
import { cn } from '@/lib/shadcn';
import { Input as InputPrimitive } from '@base-ui/react/input';

import { FieldDescription } from './field';

/**
 * @param errorMessage 에러 메시지(optional)
 * @param errorMessageVisibility `sr-only`면 시각적으로만 숨기고, `aria-describedby`·스크린리더용 설명은 유지
 * @param invalid 인라인 메시지 없이도 검증 실패 상태(테두리·`aria-invalid`)를 표시할 때
 * @param startAdornment 입력 필드 좌측(세로 중앙) — 예: 검색 아이콘(optional)
 * @param endAdornment 입력 필드 우측(세로 중앙) — 예: 비밀번호 표시 토글(optional)
 */
export interface InputProps extends Omit<React.ComponentProps<'input'>, 'ref'> {
  errorMessage?: string;
  errorMessageVisibility?: 'visible' | 'sr-only';
  invalid?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    type,
    errorMessage,
    errorMessageVisibility = 'visible',
    invalid,
    startAdornment,
    endAdornment,
    ...props
  },
  ref,
) {
  const errorDescriptionId = React.useId();
  const hasAdornment = startAdornment != null || endAdornment != null;
  const { 'aria-describedby': ariaDescribedByProp, ...restProps } = props;
  const hasErrorText = Boolean(errorMessage);
  const ariaDescribedBy =
    [ariaDescribedByProp, hasErrorText ? errorDescriptionId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  const inputClassName = cn(
    'h-11 w-full rounded-xl px-3',
    'md:h-14 md:rounded-2xl md:px-4',
    'bg-white text-base transition-colors outline-none',
    'placeholder:text-gray-400',
    'border border-gray-300',
    'focus:border-orange-500',
    'aria-invalid:border-red-500 aria-invalid:focus:border-red-500',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    startAdornment && 'pl-11 md:pl-12',
    endAdornment && 'pr-11 md:pr-12',
    className,
  );

  /**
   * @description 기본 입력 요소(조건부 렌더링을 위해 별도로 선언)
   */
  const primitiveInput = (
    <InputPrimitive
      ref={ref}
      type={type}
      data-slot="input"
      aria-invalid={invalid ?? !!errorMessage}
      aria-describedby={ariaDescribedBy}
      className={inputClassName}
      {...restProps}
    />
  );

  return (
    <>
      {hasAdornment ? (
        <div className="relative flex w-full">
          {primitiveInput}
          {startAdornment ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 md:pl-3">
              <span aria-hidden="true" className="pointer-events-none inline-flex">
                {startAdornment}
              </span>
            </div>
          ) : null}
          {endAdornment ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 md:pr-3">
              <span className="pointer-events-auto inline-flex">{endAdornment}</span>
            </div>
          ) : null}
        </div>
      ) : (
        <div>{primitiveInput}</div>
      )}
      {errorMessage && (
        <FieldDescription
          id={errorDescriptionId}
          className={cn(
            errorMessageVisibility === 'sr-only' ? 'sr-only' : 'text-sm-medium px-1 text-[#FF3434]',
          )}
        >
          {errorMessage}
        </FieldDescription>
      )}
    </>
  );
});

Input.displayName = 'Input';

export { Input };
