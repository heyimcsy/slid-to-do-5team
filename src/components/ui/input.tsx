'use client';

import type { VariantProps } from 'class-variance-authority';

import * as React from 'react';
import { cn } from '@/lib';
import { cva } from 'class-variance-authority';

const inputVariants = cva('border bg-white outline-none focus:ring-0', {
  variants: {
    size: {
      large: 'w-[400px] h-14 rounded-2xl px-4',
      small: 'w-[327px] h-11 rounded-xl px-3',
    },
    state: {
      default: 'border-[#CCCCCC] focus:border-[#FF8442]',
      done: 'border-[#CCCCCC] focus:border-[#FF8442]',
      typing: 'border-[#FF8442]',
      error: 'border-[#FF3434] focus:border-[#FF3434]',
    },
  },
  defaultVariants: {
    size: 'large',
    state: 'default',
  },
});

type InputVariantProps = VariantProps<typeof inputVariants>;

interface CustomInputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  size?: InputVariantProps['size'];
  state?: InputVariantProps['state'];
  errorMessage?: string;
}

export function Input({
  size,
  state,
  errorMessage,
  className,
  onFocus,
  onBlur,
  ...props
}: CustomInputProps) {
  const [focused, setFocused] = React.useState(false);

  const resolvedState = state ?? (focused ? 'typing' : 'default');

  return (
    <div className="flex flex-col gap-1">
      <input
        className={cn(inputVariants({ size, state: resolvedState }), className)}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {resolvedState === 'error' && errorMessage && (
        <span className="px-1 text-sm text-[#FF3434]">{errorMessage}</span>
      )}
    </div>
  );
}
