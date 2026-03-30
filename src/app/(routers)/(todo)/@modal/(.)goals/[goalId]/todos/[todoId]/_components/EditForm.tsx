'use client';

import type { Todo } from '@/api/todos';
import type { KeyboardEvent } from 'react';

import { useEffect, useRef, useState } from 'react'; // useEffect 추가
import { useRouter } from 'next/navigation';
import { useGetGoals } from '@/api/goals';
import { usePatchTodos } from '@/api/todos';
import { formatDate } from '@/app/(routers)/(board)/community/_utils/formatDate';
import GoalId from '@/app/(routers)/(todo)/goals/[goalId]/page';
import { useIsMobile } from '@/hooks/use-mobile';
import { useForm } from 'react-hook-form';

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

const COLORS = ['gray', 'green', 'yellow', 'red', 'purple'] as const;
type TagColor = (typeof COLORS)[number];

interface Tag {
  name: string;
  color: TagColor;
}

interface EditFormProps {
  todo: Todo;
}

export function EditForm({ todo }: EditFormProps) {
  const { data: goalsData } = useGetGoals();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { mutate: patchTodo, isSuccess } = usePatchTodos(); // isSuccess 추가

  const initialTags: Tag[] = todo.tags.map((tag, index) => ({
    name: tag.name,
    color: COLORS[index % COLORS.length],
  }));

  const [status, setStatus] = useState<'TODO' | 'DONE'>(todo.done ? 'DONE' : 'TODO');
  const [date, setDate] = useState<Date>(new Date(todo.dueDate));
  const [tempDate, setTempDate] = useState<Date | undefined>(new Date(todo.dueDate));
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(todo.goal?.title ?? null);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(todo.goal?.id ?? null);
  const [link, setLink] = useState(todo.linkUrl ?? '');
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [tagInput, setTagInput] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const colorIndexRef = useRef(initialTags.length);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid: titleValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { title: todo.title },
  });

  // API 성공 시 모달 닫기
  useEffect(() => {
    if (isSuccess) router.back();
  }, [isSuccess]);

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

  const isValid = titleValid && selectedGoal !== null && date !== undefined;

  // onSuccess 콜백 제거
  const onSubmit = handleSubmit((formValues) => {
    patchTodo({
      id: todo.id,
      title: formValues.title,
      done: status === 'DONE',
      dueDate: date.toISOString(),
      linkUrl: link || null,
      tags: tags.map((t) => ({ name: t.name })),
    });
  });

  const formContent = (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-2 md:gap-4">
        <Field>
          <FieldLabel className="font-sm-semi md:font-base-semibold gap-1">
            상태<span className="text-orange-600">*</span>
          </FieldLabel>
          <div className="flex items-center gap-4">
            {(['TODO', 'DONE'] as const).map((s) => (
              <button
                key={s}
                type="button"
                className="flex cursor-pointer items-center gap-2"
                onClick={() => setStatus(s)}
              >
                <Icon name="checkBoxD" checked={status === s} size={24} />
                <span className="text-sm">{s === 'TODO' ? 'TO DO' : 'DONE'}</span>
              </button>
            ))}
          </div>
        </Field>

        <Field>
          <FieldLabel className="font-sm-semi md:font-base-semibold gap-1">
            제목<span className="text-orange-600">*</span>
          </FieldLabel>
          <Input className="w-full" {...register('title', { required: true, maxLength: 50 })} />
          {errors.title?.type === 'maxLength' && (
            <p className="font-sm-medium text-red-500">제목은 50자 이내로 입력해주세요</p>
          )}
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
                    setSelectedGoalId(goal.id); // ← 추가
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
                onSelect={(d) => setTempDate(d)}
                defaultMonth={date}
              />
              <div className="flex gap-2 p-3 pt-0">
                <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)}>
                  취소
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (tempDate) setDate(tempDate);
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
          <Input
            type="url"
            value={link}
            placeholder="링크를 업로드해주세요"
            className="w-full border-dashed bg-gray-50"
            onChange={(e) => setLink(e.target.value)}
            startAdornment={
              <button type="button">
                <Icon name="linkEditor" />
              </button>
            }
            endAdornment={
              link && (
                <button type="button" onClick={() => setLink('')}>
                  <Icon name="close" color="gray" />
                </button>
              )
            }
          />
        </Field>

        <Field>
          <FieldLabel className="font-sm-semi md:font-base-semibold">이미지</FieldLabel>
          <ImageUploadInput value={image} onChange={setImage} />
          <p className="font-sm-medium text-gray-400">이미지는 최대 1개만 첨부할 수 있습니다</p>
        </Field>
      </div>
    </form>
  );

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
              <DrawerTitle className="font-xl-semibold">할 일 수정</DrawerTitle>
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
              <Button size="lg" disabled={!isValid} className="flex-1" onClick={onSubmit}>
                수정하기
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog
          open
          onOpenChange={(v) => {
            if (!v) router.back();
          }}
        >
          <DialogContent>
            <DialogHeader className="mb-8">
              <DialogTitle>할 일 수정</DialogTitle>
            </DialogHeader>
            {formContent}
            <DialogFooter className="mt-10 w-full">
              <Button size="lg" variant="ghost" className="flex-1" onClick={() => router.back()}>
                취소
              </Button>
              <Button size="lg" disabled={!isValid} className="flex-1" onClick={onSubmit}>
                수정하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
