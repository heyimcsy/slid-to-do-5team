'use client';

import type { Todo } from '@/api/todos';
import type { KeyboardEvent } from 'react';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetGoals } from '@/api/goals';
import { uploadImage } from '@/api/images';
import { usePatchTodos } from '@/api/todos';
import { useIsMobile } from '@/hooks/use-mobile';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { formatDate } from '@/utils/date';

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
import { Spinner } from '@/components/ui/spinner';

const COLORS = ['gray', 'green', 'yellow', 'red', 'purple'] as const;
type TagColor = (typeof COLORS)[number];

interface Tag {
  id?: number;
  name: string;
  color: TagColor;
}

interface EditFormProps {
  todo: Todo;
  onCancel: () => void;
}

export function EditForm({ todo, onCancel }: EditFormProps) {
  const { data: goalsData } = useGetGoals();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { mutate: patchTodo, isSuccess } = usePatchTodos();

  const initialTags: Tag[] = (todo.tags ?? []).map((tag, index) => ({
    name: tag.name,
    color: COLORS[index % COLORS.length],
  }));

  const [status, setStatus] = useState<'TODO' | 'DONE'>(todo.done ? 'DONE' : 'TODO');
  const [date, setDate] = useState<Date>(new Date(todo.dueDate));
  const [tempDate, setTempDate] = useState<Date | undefined>(new Date(todo.dueDate));
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [existingUrl, setExistingUrl] = useState<string | null>(todo.fileUrl ?? null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(todo.goal?.title || null);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(todo.goal?.id || null);
  const [link, setLink] = useState(todo.linkUrl ?? '');
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const colorIndexRef = useRef(initialTags.length);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid: titleValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { title: todo.title },
  });

  useEffect(() => {
    if (isSuccess) router.back();
  }, [isSuccess, router]);

  const title = watch('title');

  useEffect(() => {
    if (title.length > 30) {
      toast.error('제목은 30자 이내로 입력해주세요', { id: 'title-limit' });
    }
  }, [title]);

  const getNextColor = (): TagColor => {
    const color = COLORS[colorIndexRef.current % COLORS.length];
    colorIndexRef.current += 1;
    return color;
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    const isDuplicate = tags.some((tag) => tag.name === trimmed);
    if (isDuplicate) {
      toast.error('이미 추가된 태그입니다', { id: 'tag-duplicate' });
      return;
    }

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

  const isValid = titleValid && selectedGoalId !== null && date !== undefined;

  const onSubmit = handleSubmit(async (formValues) => {
    setIsSubmitting(true);

    let fileUrl: string | undefined;
    if (image) {
      try {
        fileUrl = await uploadImage(image);
      } catch {
        toast.error('이미지 업로드에 실패했습니다.');
        setIsSubmitting(false);
        return;
      }
    }

    patchTodo(
      {
        id: todo.id,
        title: formValues.title,
        done: status === 'DONE',
        dueDate: date.toISOString(),
        linkUrl: link || null,
        tags: tags.map((t) => t.name),
        fileUrl: fileUrl ?? existingUrl ?? null,
      },
      {
        onSettled: () => setIsSubmitting(false),
      },
    );
  });

  const formContent = (
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
        <Input
          className="w-full"
          {...register('title', {
            required: true,
            maxLength: 30,
            onChange: (e) => {
              if (e.target.value.length > 30) {
                toast.error('제목은 30자 이내로 입력해주세요', { id: 'title-limit' });
              }
            },
          })}
        />
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
                  setSelectedGoalId(goal.id);
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
          <PopoverTrigger
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
          >
            <Input
              readOnly
              startAdornment={<Icon name="calendar" />}
              placeholder="날짜를 선택하세요"
              className="cursor-pointer"
              value={date ? formatDate(date.toISOString()) : ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault();
              }}
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
        <ImageUploadInput
          value={image}
          onChange={setImage}
          existingUrl={existingUrl}
          onExistingUrlRemove={() => setExistingUrl(null)}
        />
        <p className="font-sm-medium text-gray-400">이미지는 최대 1개만 첨부할 수 있습니다</p>
      </Field>
    </div>
  );

  return (
    <>
      {isSubmitting && <Spinner text="로딩 중" />}
      {isMobile ? (
        <Drawer
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) router.back();
          }}
        >
          {/* TODO: DrawerContent 내부 CSS 문제로 mb-[-96vh] pb-[100vh] 임시 추가 */}
          <DrawerContent className="overflow-y-auto p-6">
            <form id="edit-todo-modal" onSubmit={onSubmit}>
              <DrawerHeader className="mt-0 mb-4 flex flex-row justify-between p-0">
                <DrawerTitle className="font-xl-semibold">할 일 수정</DrawerTitle>
                <button className="cursor-pointer border-0" onClick={() => onCancel()}>
                  <Icon name="close" color="gray" />
                </button>
              </DrawerHeader>
              {formContent}
              <div className="mt-4 flex gap-2">
                <Button
                  size="lg"
                  variant="ghost"
                  className="flex-1 cursor-pointer"
                  onClick={() => onCancel()}
                >
                  취소
                </Button>
                <Button
                  form="edit-todo-modal"
                  type="submit"
                  size="lg"
                  disabled={!isValid}
                  className="flex-1"
                >
                  수정하기
                </Button>
              </div>
            </form>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) router.back();
          }}
        >
          <DialogContent className="flex max-h-svh flex-col overflow-hidden [&>button]:hidden">
            <form
              id="edit-form-modal"
              onSubmit={onSubmit}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <DialogHeader className="mb-8 shrink-0">
                <DialogTitle>할 일 수정</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
                {formContent}
              </div>
              <DialogFooter className="mt-10 w-full">
                <Button size="lg" variant="ghost" className="flex-1" onClick={onCancel}>
                  취소
                </Button>
                <Button
                  form="edit-form-modal"
                  type="submit"
                  size="lg"
                  disabled={!isValid}
                  className="flex-1"
                >
                  수정하기
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
