'use client';

import type { FormValues } from '@/types/form';
import type { UseFormRegister } from 'react-hook-form';

import React from 'react';

import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface Props {
  register: UseFormRegister<FormValues>;
}

export const TitleInput = React.memo(function TagInput({ register }: Props) {
  const { onChange, ...rest } = register('title');

  return (
    <Field>
      <FieldLabel className="font-sm-semi md:font-base-semibold gap-1">
        제목<span className="text-orange-600">*</span>
      </FieldLabel>
      <Input
        {...rest}
        className="w-full"
        onChange={(e) => {
          onChange(e);
        }}
      />
    </Field>
  );
});
