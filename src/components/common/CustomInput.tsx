'use client';

import type { VariantProps } from 'class-variance-authority';

import * as React from 'react';
import { cn } from '@/lib';
import { cva } from 'class-variance-authority';

import { Input } from '@/components/ui/input';

const inputVariants = cva('border bg-white', {
  variants: {
    size: {
      large: 'w-[400px] h-14 rounded-2xl px-4',
      small: 'w-[327px] h-11 rounded-xl px-3',
    },
    state: {
      default: 'border-[#CCCCCC]',
      done: 'border-[#CCCCCC]',
      typing: 'border-[#FF8442]',
      error: 'border-[#FF3434]',
    },
  },
  defaultVariants: {
    size: 'large',
    state: 'default',
  },
});

type InputVariantProps = VariantProps<typeof inputVariants>;

interface CustomInputProps extends Omit<React.ComponentProps<typeof Input>, 'size'> {
  size?: InputVariantProps['size'];
  state?: InputVariantProps['state'];
}

export function CustomInput({
  size,
  state,
  className,
  onFocus,
  onBlur,
  ...props
}: CustomInputProps) {
  const [focused, setFocused] = React.useState(false);

  const resolvedState = state ?? (focused ? 'typing' : 'default');

  return (
    <Input
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
  );
}
