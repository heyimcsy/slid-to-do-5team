'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorWithContent } from '@/hooks/editor';
import { EditorContent } from '@tiptap/react';

import { Toolbar } from '@/components/Toolbar';

import { DesktopPostHeader } from './_components/DesktopPostHeader';
import { MobilePostHeader } from './_components/MobilePostHeader';

const TITLE_MAX_LENGTH = 30;

export function PostCreateClient() {
  const router = useRouter();
  const [title, setTitle] = useState('');
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

  return (
    <>
      <div className="min-h-full w-full overflow-y-auto bg-gray-100">
        <MobilePostHeader
          editor={editor}
          isSubmitDisabled={isSubmitDisabled}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />

        <div className="mx-auto w-full px-4 pt-3 pb-4 md:max-w-[636px] md:px-8 md:py-10 lg:max-w-[768px] lg:p-14">
          <DesktopPostHeader
            isSubmitDisabled={isSubmitDisabled}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />

          <div className="flex flex-col rounded-3xl bg-white px-5 py-6 md:p-10 lg:p-14">
            <div className="hidden md:block">
              <Toolbar editor={editor} variant="post" />
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

            <EditorContent
              editor={editor}
              className="min-h-[50dvh] text-gray-800 md:min-h-[50dvh]"
            />

            <p className="font-xs-regular mt-4 text-right text-gray-400 md:mt-6">
              공백포함 {charCountWithSpaces}자 | 공백제외 {charCountWithoutSpaces}자
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
