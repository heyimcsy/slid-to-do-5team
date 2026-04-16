'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditorContent } from '@tiptap/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { MobileFormHeader } from '@/components/formHeader/MobileFormHeader';
import { DeleteIcon } from '@/components/icon/icons/Delete';
import { Toolbar } from '@/components/Toolbar';
import { Spinner } from '@/components/ui/spinner';

import { usePostDraft } from '../_hooks/usePostDraft';
import { usePostEditor } from '../_hooks/usePostEditor';
import { usePostImages } from '../_hooks/usePostImages';
import { DesktopPostHeader } from './DesktopPostHeader';

const TITLE_MAX_LENGTH = 30;
const CONTENT_MAX_LENGTH = 500;

const postSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(TITLE_MAX_LENGTH, `제목은 최대 ${TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`),
  charCount: z
    .number()
    .min(1, '내용을 입력해주세요')
    .max(CONTENT_MAX_LENGTH, `내용은 최대 ${CONTENT_MAX_LENGTH}자까지 입력할 수 있습니다.`),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormClientProps {
  mode: 'create' | 'edit';
  initialValues?: { title: string; content: string };
  initialImageUrls?: string[];
  onSubmit?: (
    data: { title: string; contentJson: string },
    newFiles: File[],
    existingUrls: string[],
  ) => Promise<void>;
}

export function PostFormClient({
  mode,
  initialValues,
  initialImageUrls = [],
  onSubmit,
}: PostFormClientProps) {
  const router = useRouter();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);

  const { editor, hasEditorContent, hasEditorChanged, charCountWithoutSpaces, charCount } =
    usePostEditor({
      initialContent: initialValues?.content,
      limit: CONTENT_MAX_LENGTH,
    });

  const {
    images,
    IMAGE_LIMIT,
    hasImagesChanged,
    handleImageSelected,
    handleImageRemove,
    handleImageSizeExceeded,
    handleImageLimitExceeded,
  } = usePostImages(initialImageUrls);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: initialValues?.title ?? '', charCount: 0 },
    mode: 'onChange',
  });

  const titleValue = watch('title');

  const { saveDraft, loadDraft, clearDraft, hasDraft } = usePostDraft({
    mode,
    titleValue,
    editor,
    setValue,
  });

  useEffect(() => {
    if (mode === 'create' && hasDraft()) {
      setDraftDialogOpen(true);
    }
  }, [mode]);

  useEffect(() => {
    setValue('charCount', charCount, { shouldValidate: true });
  }, [charCount, setValue]);

  const hasChanged = isDirty || hasEditorChanged || hasImagesChanged;
  const isSubmitDisabled =
    !titleValue.trim() ||
    !editor ||
    !hasEditorContent ||
    isSubmitting ||
    !isValid ||
    (mode === 'edit' && !hasChanged);
  const headerTitle = mode === 'create' ? '게시물 작성하기' : '게시물 수정하기';
  const submitLabel = mode === 'create' ? '등록' : '수정';

  const handleFormSubmit = handleSubmit(async ({ title }) => {
    if (!editor || editor.isEmpty) return;
    try {
      const contentJson = JSON.stringify(editor.getJSON());
      const newFiles = images
        .filter((item): item is Extract<typeof item, { type: 'new' }> => item.type === 'new')
        .map((item) => item.file);
      const existingUrls = images
        .filter(
          (item): item is Extract<typeof item, { type: 'existing' }> => item.type === 'existing',
        )
        .map((item) => item.url);

      await onSubmit?.({ title, contentJson }, newFiles, existingUrls);
      clearDraft();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : '게시물 저장에 실패했습니다.');
    }
  });

  const toolbar = useMemo(
    () => (
      <Toolbar
        editor={editor}
        variant="post"
        imageLimit={IMAGE_LIMIT}
        onImageSelected={handleImageSelected}
        onImageLimitExceeded={handleImageLimitExceeded}
        externalImageCount={images.length}
        onImageSizeExceeded={handleImageSizeExceeded}
      />
    ),
    [
      editor,
      IMAGE_LIMIT,
      images.length,
      handleImageSelected,
      handleImageLimitExceeded,
      handleImageSizeExceeded,
    ],
  );

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex h-[calc(100dvh-68px)] w-full flex-col overflow-hidden bg-gray-100 md:h-dvh"
    >
      <DeleteDialog
        open={draftDialogOpen}
        onOpenChange={setDraftDialogOpen}
        title="임시저장된 게시물이 있습니다."
        description="임시저장된 게시물을 불러오시겠습니까?"
        onConfirm={loadDraft}
      />
      <DeleteDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="작성을 취소하시겠습니까?"
        description="작성 중인 내용은 임시저장됩니다."
        onConfirm={() => {
          if (mode === 'create') saveDraft();
          router.back();
        }}
      />
      <DeleteDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        title={mode === 'create' ? '게시물을 등록하시겠습니까?' : '게시물을 수정하시겠습니까?'}
        description="등록 후에도 수정이 가능합니다."
        onConfirm={() => {
          setSubmitDialogOpen(false);
          handleFormSubmit();
        }}
      />
      <MobileFormHeader
        isSubmitDisabled={isSubmitDisabled}
        onCancel={() => setCancelDialogOpen(true)}
        onSubmitClick={() => setSubmitDialogOpen(true)}
        headerTitle={headerTitle}
        secondaryLabel="취소"
        submitLabel={submitLabel}
        toolbar={toolbar}
      />
      <div className="hidden shrink-0 md:block">
        <div className="mx-auto w-full px-8 pt-8 md:max-w-[636px] lg:max-w-[768px]">
          <DesktopPostHeader
            isSubmitDisabled={isSubmitDisabled}
            onCancel={() => setCancelDialogOpen(true)}
            onSubmitClick={() => setSubmitDialogOpen(true)}
            headerTitle={headerTitle}
            secondaryLabel="취소"
            submitLabel={submitLabel}
          />
        </div>
      </div>
      <div className="mx-auto flex w-full flex-1 flex-col overflow-hidden px-4 pt-3 pb-4 md:max-w-[636px] md:px-8 md:pb-10 lg:max-w-[768px]">
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white">
          <div className="shrink-0 px-5 pt-6">
            <div className="hidden md:block">{toolbar}</div>
            <div className="flex items-center justify-between gap-2 md:mt-6">
              {isSubmitting && (
                <Spinner text={mode === 'create' ? '게시물 등록 중...' : '게시물 수정 중...'} />
              )}
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
            className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 md:px-10"
            onClick={() => editor?.commands.focus()}
          >
            <EditorContent editor={editor} className="text-gray-800" />
          </div>

          {images.length > 0 && (
            <div className="m-4 flex shrink-0 gap-2">
              {images.map((item, i) => (
                <div key={item.url} className="relative size-[150px] shrink-0 md:size-[232px]">
                  <Image
                    src={item.url}
                    alt={`첨부 이미지 ${i + 1}`}
                    fill
                    unoptimized
                    className="rounded-xl object-cover"
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

          <div className="font-xs-regular flex shrink-0 flex-col items-end px-5 py-4 text-gray-400 md:px-10 md:py-6 lg:px-14">
            <p className={charCount >= CONTENT_MAX_LENGTH ? 'text-red-600' : ''}>
              공백포함 {charCount}자 / {CONTENT_MAX_LENGTH}자 | 공백제외 {charCountWithoutSpaces}자
            </p>
            <p>이미지는 10MB 이하의 파일만 첨부할 수 있습니다. (최대 {IMAGE_LIMIT}까지)</p>
          </div>
        </div>
      </div>
    </form>
  );
}
