// LinkInput.tsx
'use client';

import type { FormValues } from '@/types/form';
import type { Control, UseFormRegister, UseFormTrigger } from 'react-hook-form';

import React from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Icon } from '@/components/icon/Icon';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface Props {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  trigger: UseFormTrigger<FormValues>;
  setValue: (name: keyof FormValues, value: string) => void;
}

export const LinkInput = React.memo(function LinkInput({
  control,
  register,
  trigger,
  setValue,
}: Props) {
  const { errors } = useFormState({ control });
  const link = useWatch({ control, name: 'link' });

  const handleLinkValidate = async () => {
    const isValid = await trigger('link');
    if (!isValid) {
      const error = errors.link?.message;
      if (error) toast.error(error);
    }
  };

  return (
    <Field>
      <FieldLabel className="font-sm-semi md:font-base-semibold">링크</FieldLabel>
      <Input
        type="url"
        placeholder="링크를 업로드해주세요"
        className="w-full border-dashed bg-gray-50"
        {...register('link')}
        onBlur={handleLinkValidate}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleLinkValidate();
          }
        }}
        startAdornment={
          <button type="button">
            <Icon name="linkEditor" />
          </button>
        }
        endAdornment={
          link && (
            <button type="button" onClick={() => setValue('link', '')}>
              <Icon name="close" color="gray" />
            </button>
          )
        }
      />
    </Field>
  );
});
