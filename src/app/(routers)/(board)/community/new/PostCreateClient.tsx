'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorWithContent } from '@/hooks/editor';
import { EditorContent } from '@tiptap/react';
import { toast } from 'sonner';

import { DeleteIcon } from '@/components/icon/icons/Delete';
import { Toolbar } from '@/components/Toolbar';

import { DesktopPostHeader } from './_components/DesktopPostHeader';
import { MobilePostHeader } from './_components/MobilePostHeader';

const TITLE_MAX_LENGTH = 30;

const IMAGE_LIMIT = 2;

export function PostCreateClient() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => imagesRef.current.forEach(({ url }) => URL.revokeObjectURL(url));
  }, []);

  const { editor } = useEditorWithContent({
    variant: 'post',
    placeholder: '이 곳을 통해 내용을 작성해주세요',
  });

  const contentText = editor?.getText() ?? '';
  const charCountWithSpaces = contentText.length;
  const charCountWithoutSpaces = contentText.replace(/\s/g, '').length;
  const isSubmitDisabled = !title.trim() || !contentText.trim();

  const handleCancel = () => router.back();
  const handleSubmit = () => {
    // TODO: 게시물 등록 API 연동
  };

  const handleImageSelected = (file: File) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => [...prev, { file, url }]);
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleImageLimitExceeded = () => {
    toast.error(`이미지는 최대 ${IMAGE_LIMIT}개까지 첨부할 수 있습니다.`);
  };

  return (
    <div className="flex h-[calc(100dvh-68px)] w-full flex-col overflow-hidden bg-gray-100 md:h-dvh">
      <MobilePostHeader
        editor={editor}
        isSubmitDisabled={isSubmitDisabled}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        onImageSelected={handleImageSelected}
        onImageLimitExceeded={handleImageLimitExceeded}
        externalImageCount={images.length}
        imageLimit={IMAGE_LIMIT}
      />
      <div className="hidden shrink-0 md:block">
        <div className="mx-auto w-full px-8 pt-8 md:max-w-[636px] lg:max-w-[768px]">
          <DesktopPostHeader
            isSubmitDisabled={isSubmitDisabled}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      <div className="mx-auto flex w-full flex-1 flex-col overflow-hidden px-4 pt-3 pb-4 md:max-w-[636px] md:px-8 md:pb-10 lg:max-w-[768px]">
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white">
          <div className="shrink-0 px-5 pt-6">
            <div className="hidden md:block">
              <Toolbar
                editor={editor}
                variant="post"
                imageLimit={IMAGE_LIMIT}
                onImageSelected={handleImageSelected}
                onImageLimitExceeded={handleImageLimitExceeded}
                externalImageCount={images.length}
              />
            </div>
            <div className="flex items-center justify-between gap-2 md:mt-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX_LENGTH))}
                placeholder="게시물의 제목을 입력해주세요"
                maxLength={TITLE_MAX_LENGTH}
                className="font-base-semibold md:font-2xl-semibold flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-300"
              />
              <span className="font-xs-regular shrink-0 text-gray-500">
                {title.length}/<span className="text-orange-600">{TITLE_MAX_LENGTH}</span>
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
              {images.map(({ url }, i) => (
                <div key={url} className="relative size-[150px] shrink-0 md:size-[232px]">
                  <img
                    src={url}
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
            공백포함 {charCountWithSpaces}자 | 공백제외 {charCountWithoutSpaces}자
          </p>
        </div>
      </div>
    </div>
  );
}
