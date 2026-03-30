'use client';

import type { Editor } from '@tiptap/react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorConfig } from '@/hooks/editor';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditorContent } from '@tiptap/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { DeleteIcon } from '@/components/icon/icons/Delete';
import { Toolbar } from '@/components/Toolbar';

import { DesktopPostHeader } from './DesktopPostHeader';
import { MobilePostHeader } from './MobilePostHeader';

const TITLE_MAX_LENGTH = 30;
const IMAGE_LIMIT = 2;

const isEditorFilled = (editor: Editor) => !editor.isEmpty && editor.getText().trim().length > 0;

const postSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(TITLE_MAX_LENGTH, `제목은 최대 ${TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`),
});

type PostFormValues = z.infer<typeof postSchema>;
type ImageItem = { type: 'existing'; url: string } | { type: 'new'; url: string; file: File };

interface PostFormClientProps {
  mode: 'create' | 'edit';
  initialValues?: { title: string; content: string };
  initialImageUrls?: string[];
  onSubmit?: (data: { title: string; contentJson: string }, images: File[]) => Promise<void>;
}

export function PostFormClient({
  mode,
  initialValues,
  initialImageUrls = [],
  onSubmit,
}: PostFormClientProps) {
  const router = useRouter();

  const [images, setImages] = useState<ImageItem[]>(
    initialImageUrls.map((url) => ({ type: 'existing', url })),
  );
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => {
        if (item.type === 'new') URL.revokeObjectURL(item.url);
      });
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: initialValues?.title ?? '' },
    mode: 'onChange',
  });

  const titleValue = watch('title');

  const editor = useEditorConfig({
    content: initialValues?.content,
    variant: 'post',
    placeholder: '이 곳을 통해 내용을 작성해주세요',
  });

  const [hasEditorContent, setHasEditorContent] = useState(false);
  const [contentText, setContentText] = useState('');

  useEffect(() => {
    if (!editor) return;
    setHasEditorContent(isEditorFilled(editor));
    setContentText(editor.getText());

    const onUpdate = () => {
      setHasEditorContent(isEditorFilled(editor));
      setContentText(editor.getText());
    };
    editor.on('update', onUpdate);
    return () => {
      editor.off('update', onUpdate);
    };
  }, [editor]);

  const charCountWithoutSpaces = contentText.replace(/\s/g, '').length;

  const isSubmitDisabled = !titleValue.trim() || !editor || !hasEditorContent || isSubmitting;
  const headerTitle = mode === 'create' ? '게시물 작성하기' : '게시물 수정하기';
  const submitLabel = mode === 'create' ? '등록' : '수정';

  const handleFormSubmit = handleSubmit(async ({ title }) => {
    if (!editor || editor.isEmpty) return;
    try {
      const contentJson = JSON.stringify(editor.getJSON());
      const newFiles = images
        .filter((item): item is Extract<ImageItem, { type: 'new' }> => item.type === 'new')
        .map((item) => item.file);
      await onSubmit?.({ title, contentJson }, newFiles);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : '게시물 저장에 실패했습니다.');
    }
  });

  const handleImageLimitExceeded = useCallback(() => {
    toast.error(`이미지는 최대 ${IMAGE_LIMIT}개까지 첨부할 수 있습니다.`);
  }, []);

  const handleImageSelected = useCallback(
    (file: File) => {
      if (images.length >= IMAGE_LIMIT) {
        handleImageLimitExceeded();
        return;
      }
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, { type: 'new', url, file }]);
    },
    [images.length, handleImageLimitExceeded],
  );

  const handleImageRemove = (index: number) => {
    setImages((prev) => {
      const item = prev[index];
      if (item.type === 'new') URL.revokeObjectURL(item.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const toolbar = useMemo(
    () => (
      <Toolbar
        editor={editor}
        variant="post"
        imageLimit={IMAGE_LIMIT}
        onImageSelected={handleImageSelected}
        onImageLimitExceeded={handleImageLimitExceeded}
        externalImageCount={images.length}
      />
    ),
    [editor, images.length, handleImageSelected, handleImageLimitExceeded],
  );

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex h-[calc(100dvh-68px)] w-full flex-col overflow-hidden bg-gray-100 md:h-dvh"
    >
      <MobilePostHeader
        isSubmitDisabled={isSubmitDisabled}
        onCancel={() => router.back()}
        headerTitle={headerTitle}
        submitLabel={submitLabel}
        toolbar={toolbar}
      />
      <div className="hidden shrink-0 md:block">
        <div className="mx-auto w-full px-8 pt-8 md:max-w-[636px] lg:max-w-[768px]">
          <DesktopPostHeader
            isSubmitDisabled={isSubmitDisabled}
            onCancel={() => router.back()}
            headerTitle={headerTitle}
            submitLabel={submitLabel}
          />
        </div>
      </div>
      <div className="mx-auto flex w-full flex-1 flex-col overflow-hidden px-4 pt-3 pb-4 md:max-w-[636px] md:px-8 md:pb-10 lg:max-w-[768px]">
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white">
          <div className="shrink-0 px-5 pt-6">
            <div className="hidden md:block">{toolbar}</div>
            <div className="flex items-center justify-between gap-2 md:mt-6">
              <input
                {...register('title')}
                type="text"
                placeholder="게시물의 제목을 입력해주세요"
                maxLength={TITLE_MAX_LENGTH}
                className="font-base-semibold md:font-2xl-semibold flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-300"
              />
              <span className="font-xs-regular shrink-0 text-gray-500">
                {titleValue.length}/<span className="text-orange-600">{TITLE_MAX_LENGTH}</span>
              </span>
            </div>
            <hr className="my-4 border-gray-200 md:my-6" />
          </div>

          <div
            className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 md:px-10 [&::-webkit-scrollbar]:hidden"
            onClick={() => editor?.commands.focus()}
          >
            <EditorContent editor={editor} className="text-gray-800" />
          </div>

          {images.length > 0 && (
            <div className="m-4 flex shrink-0 gap-2">
              {images.map((item, i) => (
                <div key={item.url} className="relative size-[150px] shrink-0 md:size-[232px]">
                  <img
                    src={item.url}
                    alt={`첨부 이미지 ${i + 1}`}
                    className="size-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(i)}
                    className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full border border-gray-300 bg-white"
                    aria-label="이미지 삭제"
                  >
                    <DeleteIcon width={18} height={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="font-xs-regular shrink-0 px-5 py-4 text-right text-gray-400 md:px-10 md:py-6 lg:px-14">
            공백포함 {contentText.length}자 | 공백제외 {charCountWithoutSpaces}자
          </p>
        </div>
      </div>
    </form>
  );
}
