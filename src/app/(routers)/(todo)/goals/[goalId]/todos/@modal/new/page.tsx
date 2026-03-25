'use client';

import type { KeyboardEvent } from 'react';

import React, { useRef, useState } from 'react';

import { ImageUploadInput } from '@/components/common/ImageUploadInput';
import { Icon } from '@/components/icon/Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const COLORS = ['gray', 'green', 'yellow', 'red', 'purple'] as const;
type TagColor = (typeof COLORS)[number];
interface Tag {
  name: string;
  color: TagColor;
}

export default function NewPage() {
  const [date, setDate] = React.useState<Date>();
  const [image, setImage] = useState<File | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const colorIndexRef = useRef(0);

  const getNextColor = (): TagColor => {
    const color = COLORS[colorIndexRef.current % COLORS.length];
    colorIndexRef.current += 1;
    return color;
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    setTags((prev) => [...prev, { name: trimmed, color: getNextColor() }]);
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  // ✅ 공통 폼 (Dialog 전용 컴포넌트 제거)
  const formContent = (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel className="font-base-semibold gap-1">
          제목<span className="text-orange-600">*</span>
        </FieldLabel>
        <Input className="w-full" />
      </Field>

      {/* FieldLabel 스타일링에 ! 써도되는지? */}

      <Field>
        <FieldLabel className="font-base-semibold gap-1">
          목표<span className="text-orange-600">*</span>
        </FieldLabel>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 text-sm md:h-14 md:rounded-2xl md:px-4">
            <span>{selectedGoal ?? '선택하세요'}</span>
            <Icon name="arrow" direction="down" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            alignOffset={0}
            className="p-2"
            style={{ width: 'var(--anchor-width)' }}
          >
            <DropdownMenuItem
              className="p-2 focus:bg-orange-200"
              onSelect={() => setSelectedGoal('자바스크립트로 웹 서비스 만들기')}
            >
              자바스크립트로 웹 서비스 만들기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Field>

      <Field>
        <FieldLabel className="font-base-semibold gap-1">
          마감기한<span className="text-orange-600">*</span>
        </FieldLabel>
        <Popover>
          <PopoverTrigger>
            <Input />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
          </PopoverContent>
        </Popover>
      </Field>

      <Field>
        <FieldLabel className="font-base-semibold">태그</FieldLabel>
        <div
          className="flex min-h-11 w-full cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 focus-within:border-orange-500 md:min-h-14 md:rounded-2xl md:px-4"
          onClick={() => inputRef.current?.focus()}
        >
          {tags.map((tag, index) => (
            <Badge key={index} color={tag.color} state="delete" onClick={() => removeTag(index)}>
              {tag.name}
            </Badge>
          ))}
          <input
            ref={inputRef}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? '입력 후 Enter' : ''}
            className="min-w-20 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
      </Field>

      <Field>
        <FieldLabel className="font-base-semibold">링크</FieldLabel>
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="링크를 업로드해주세요"
            className="w-full border-dashed bg-gray-50"
          />
        </div>
      </Field>

      <Field>
        <FieldLabel className="font-base-semibold">이미지</FieldLabel>
        <ImageUploadInput value={image} onChange={setImage} />
      </Field>
    </div>
  );

  return (
    <>
      {/* ✅ 모바일: Drawer */}
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger>open</DrawerTrigger>
          <DrawerContent className="px-4 pb-6">
            <DrawerTitle>할 일 생성</DrawerTitle>

            {formContent}

            <div className="mt-4 flex gap-2">
              <Button size="lg" variant="ghost" className="flex-1">
                취소
              </Button>
              <Button size="lg" disabled className="flex-1">
                확인
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* ✅ 데스크탑: Dialog */}
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger>open</DialogTrigger>
          <DialogContent>
            <DialogHeader className="mb-8">
              <DialogTitle>할 일 생성</DialogTitle>
            </DialogHeader>

            {formContent}

            <DialogFooter className="mt-10 w-full">
              <Button size="lg" variant="ghost" className="flex-1">
                취소
              </Button>
              <Button size="lg" variant="default" disabled className="flex-1">
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
