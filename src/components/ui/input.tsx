'use client';

import * as React from 'react';
import { cn } from '@/lib/shadcn';
import { Input as InputPrimitive } from '@base-ui/react/input';

import { FieldDescription } from './field';

/**
 * @param errorMessage 에러 메시지(optional)
 * @param endAdornment 입력 필드 우측(세로 중앙)에 배치할 노드 — 예: 비밀번호 표시 토글(optional)
 */
interface InputProps extends React.ComponentProps<'input'> {
  errorMessage?: string;
  endAdornment?: React.ReactNode;
}

function Input({ className, type, errorMessage, endAdornment, ...props }: InputProps) {
  const inputClassName = cn(
    'h-11 w-full rounded-xl px-3',
    'md:h-14 md:rounded-2xl md:px-4',
    'bg-white text-base transition-colors outline-none',
    'placeholder:text-gray-400',
    'border border-gray-300',
    'focus:border-orange-500',
    'aria-invalid:border-red-500 aria-invalid:focus:border-red-500',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    endAdornment && 'pr-11 md:pr-12',
    className,
  );

  /**
   * @description 기본 입력 요소(조건부 렌더링을 위해 별도로 선언)
   */
  const primitiveInput = (
    <InputPrimitive
      type={type}
      data-slot="input"
      aria-invalid={!!errorMessage}
      className={inputClassName}
      {...props}
    />
  );

  return (
    <div className="flex flex-col">
      {endAdornment ? (
        <div className="relative flex w-full md:w-100">
          {primitiveInput}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 md:pr-3">
            <span className="pointer-events-auto inline-flex">{endAdornment}</span>
          </div>
        </div>
      ) : (
        <div>{primitiveInput}</div>
      )}
      {errorMessage && (
        <FieldDescription className="text-sm-medium px-1 text-[#FF3434]">
          {errorMessage}
        </FieldDescription>
      )}
    </div>
  );
}

export { Input };
