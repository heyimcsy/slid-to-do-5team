'use client';

import type { KeyboardEvent } from 'react';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetGoals } from '@/api/goals';
import { usePostTodo } from '@/api/todos';
import { formatDate } from '@/app/(routers)/(board)/community/_utils/formatDate';
import { useIsMobile } from '@/hooks/use-mobile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

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
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type TagColor = (typeof COLORS)[number];
type FormValues = z.infer<typeof schema>;

interface Tag {
  name: string;
  color: TagColor;
}

const COLORS = ['gray', 'green', 'yellow', 'red', 'purple'] as const;

// zod 스키마 선언
const schema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(50, '제목은 50자 이내로 입력해주세요'),
  link: z
    .string()
    .regex(
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
      '올바른 URL 형식을 입력해주세요 (예: http://www.naver.com)',
    )
    .optional()
    .or(z.literal('')),
});

export default function NewForm() {
  const { data: goalsData } = useGetGoals();
  // 마감기한 날짜 관리 state
  const [date, setDate] = React.useState<Date>();
  const [tempDate, setTempDate] = React.useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState<File | null>(null);

  // 목표탭 상태 관리 state
  const [selectedGoal, setSelectedGoal] = React.useState<string | null>(null);

  // 태그 관리
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const colorIndexRef = useRef(0);

  //RHF + Zod
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { isValid: titleValid },
  } = useForm<FormValues>({
    // 입력할 때마다 실시간으로 유효성 검증 실행
    mode: 'onChange',
    resolver: zodResolver(schema),
    // 초기값을 빈 문자열로 설정해서 처음부터 controlled 컴포넌트로 인식하게 함
    defaultValues: { title: '', link: '' },
  });

  const getNextColor = (): TagColor => {
    const color = COLORS[colorIndexRef.current % COLORS.length];
    colorIndexRef.current += 1;
    return color;
  };

  //태그 추가 함수
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    // 중복된 태그 체크
    const isDuplicate = tags.some((tag) => tag.name === trimmed);
    if (isDuplicate) return;

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

  const router = useRouter();
  const link = watch('link');

  // 유효성 체크 변수

  const [selectedGoalId, setSelectedGoalId] = React.useState<number | null>(null);
  const isValid = titleValid && selectedGoalId !== null && date !== undefined;

  const { mutate: createTodo } = usePostTodo();

  const handleSubmit = () => {
    if (!selectedGoalId || !date) return;

    createTodo(
      {
        title: getValues('title'),
        goalId: selectedGoalId,
        dueDate: date.toISOString(),
        linkUrl: link || undefined,
        tags: tags.map(({ name }) => ({ name })), // color는 프론트 전용이라 제외
      },
      {
        onSuccess: () => {
          router.back(); // ← 전송 성공 후 모달 닫기
        },
      },
    );
  };

  // ✅ 공통 폼 (Dialog 전용 컴포넌트 제거)
  const formContent = (
    <form>
      <div className="flex flex-col gap-2 md:gap-4">
        <Field>
          <FieldLabel className="font-sm-semi md:font-base-semibold gap-1">
            제목<span className="text-orange-600">*</span>
          </FieldLabel>
          <Input className="w-full" {...register('title', {})} />
        </Field>

        <Field>
          <FieldLabel className="font-sm-semi md:font-base-semibold gap-1">
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
              {goalsData?.goals.map((goal) => (
                <DropdownMenuItem
                  key={goal.id}
                  className="p-2 focus:bg-orange-200"
                  onClick={() => {
                    setSelectedGoal(goal.title);
                    setSelectedGoalId(goal.id); // ← 이게 없음
                  }}
                >
                  {goal.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Field>

        <Field>
          <FieldLabel className="font-sm-semi md:font-base-semibold gap-1">
            마감기한<span className="text-orange-600">*</span>
          </FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Input
                readOnly
                startAdornment={<Icon name="calendar" />}
                placeholder="날짜를 선택하세요"
                className="cursor-pointer"
                value={date ? formatDate(date.toISOString()) : ''}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={tempDate}
                onSelect={(date) => {
                  setTempDate(date);
                }}
                defaultMonth={date}
              />
              <div className="flex gap-2 p-3 pt-0">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  취소
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setDate(tempDate);
                    setOpen(false);
                  }}
                >
                  확인
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </Field>

        <Field>
          <FieldLabel className="font-sm-semi md:font-base-semibold">태그</FieldLabel>
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
          <FieldLabel className="font-sm-semi md:font-base-semibold">링크</FieldLabel>
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="링크를 업로드해주세요"
              className="w-full border-dashed bg-gray-50"
              {...register('link')}
              // onClick={() => setLinkOpen(true)}
              startAdornment={
                <button>
                  <Icon name="linkEditor" />
                </button>
              }
              endAdornment={
                link && (
                  //link태그의 값을 빈문자열로 변경 ->setValue
                  <button onClick={() => setValue('link', '')}>
                    <Icon name="close" color="gray" />
                  </button>
                )
              }
            />
          </div>
        </Field>

        <Field>
          <FieldLabel className="font-sm-semi md:font-base-semibold">이미지</FieldLabel>
          <ImageUploadInput value={image} onChange={setImage} />
          <p className="font-sm-medium text-gray-400">이미지는 최대 1개만 첨바를수 있습니다</p>
        </Field>
      </div>
    </form>
  );

  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <Drawer
          open
          onOpenChange={(v) => {
            if (!v) router.back();
          }}
        >
          <DrawerContent className="mb-4 p-6">
            <DrawerHeader className="mt-0 mb-4 flex flex-row justify-between p-0">
              <DrawerTitle className="font-xl-semibold">할 일 생성</DrawerTitle>
              <button className="cursor-pointer border-0" onClick={() => router.back()}>
                <Icon name="close" color="gray" />
              </button>
            </DrawerHeader>

            {formContent}

            <div className="mt-4 flex gap-2">
              <Button
                size="lg"
                variant="ghost"
                className="flex-1 cursor-pointer"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button size="lg" disabled className="flex-1">
                확인
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open>
          <DialogContent>
            <DialogHeader className="mb-8">
              <DialogTitle>할 일 생성</DialogTitle>
            </DialogHeader>

            {formContent}

            <DialogFooter className="mt-10 w-full">
              <Button size="lg" variant="ghost" className="flex-1" onClick={() => router.back()}>
                취소
              </Button>
              <Button
                onClick={handleSubmit}
                size="lg"
                variant="default"
                disabled={!isValid}
                className="flex-1"
              >
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
