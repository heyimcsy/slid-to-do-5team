'use client';

import * as React from 'react';
import { cn } from '@/lib/shadcn';
import { Input as InputPrimitive } from '@base-ui/react/input';

import { FieldDescription } from './field';

interface InputProps extends React.ComponentProps<'input'> {
  errorMessage?: string;
}

function Input({ className, type, errorMessage, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <InputPrimitive
        type={type}
        data-slot="input"
        aria-invalid={!!errorMessage}
        className={cn(
          'h-11 w-81.75 rounded-xl px-3',
          'md:h-14 md:w-100 md:rounded-2xl md:px-4',
          'bg-white text-base transition-colors outline-none',
          'placeholder:text-gray-400',
          'border border-gray-300',
          'focus:border-orange-500',
          'aria-invalid:border-red-500 aria-invalid:focus:border-red-500',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
      {errorMessage && (
        <FieldDescription className="text-sm-medium px-1 text-[#FF3434]">
          {errorMessage}
        </FieldDescription>
      )}
    </div>
  );
}

export { Input };
