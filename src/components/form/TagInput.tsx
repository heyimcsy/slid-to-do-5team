'use client';

import type { KeyboardEvent } from 'react';

import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Field, FieldLabel } from '@/components/ui/field';

const COLORS = ['gray', 'green', 'yellow', 'red', 'purple'] as const;
type TagColor = (typeof COLORS)[number];

interface Tag {
  name: string;
  color: TagColor;
}

interface Props {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
}

export const TagInput = React.memo(function TagInput({ value, onChange }: Props) {
  const [tagInput, setTagInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const colorIndexRef = useRef(value.length);

  const getNextColor = (): TagColor => {
    const color = COLORS[colorIndexRef.current % COLORS.length];
    colorIndexRef.current += 1;
    return color;
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    const isDuplicate = value.some((tag) => tag.name === trimmed);
    if (isDuplicate) {
      toast.error('이미 추가된 태그입니다');
      return;
    }

    onChange([...value, { name: trimmed, color: getNextColor() }]);
    setTagInput('');
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && tagInput === '' && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <Field>
      <FieldLabel className="font-sm-semi md:font-base-semibold">태그</FieldLabel>
      <div
        className="flex min-h-11 w-full cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 focus-within:border-orange-500 md:min-h-14 md:rounded-2xl md:px-4"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <Badge key={index} color={tag.color} state="delete" onClick={() => removeTag(index)}>
            {tag.name}
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder={value.length === 0 ? '입력 후 Enter' : ''}
          className="min-w-20 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>
    </Field>
  );
});
