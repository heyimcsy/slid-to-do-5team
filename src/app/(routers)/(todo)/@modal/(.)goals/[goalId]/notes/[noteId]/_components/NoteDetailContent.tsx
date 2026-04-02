'use client';

import type { Goal } from '@/api/goals';
import type { TipTapDoc } from '@/api/notes';
import type { Tags } from '@/api/todos';
import type { OgInfoResponse } from '@/components/common/LinkEmbed';

import Image from 'next/image';
import noteImage from '@/../public/images/img-note.svg';
import MetaTags from '@/app/(routers)/(todo)/_components/MetaTags';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface NoteDetailContentProps {
  content: TipTapDoc;
  noteTitle: string;
  linkUrl: string | null;
  done: boolean;
  createdAt: string;
  goal: Pick<Goal, 'id' | 'title'>;
  tags: Tags[];
  todoTitle: string;
  linkData: OgInfoResponse | undefined;
}
export default function NoteDetailContent({
  content,
  noteTitle,
  linkUrl,
  done,
  createdAt,
  goal,
  tags,
  todoTitle,
  linkData,
}: NoteDetailContentProps) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: true })],
    content: content,
    editable: false,
    immediatelyRender: false,
  });

  return (
    <div className="flex h-full flex-col overflow-scroll">
      {/* ── 헤더 ── */}
      <SheetHeader className="shrink-0 space-y-6 md:space-y-7.5">
        {/* 아이콘 + 제목 */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <Image
            src={noteImage}
            alt="describe note icon"
            width={40}
            height={40}
            className="w-8 md:w-10"
          />
          <SheetTitle className="font-xl-semibold md:font-2xl-semibold leading-tight text-gray-800">
            {noteTitle}
          </SheetTitle>
        </div>

        {/* 메타 정보 */}
        <MetaTags
          goalTitle={goal.title}
          todoTitle={todoTitle}
          createdAt={createdAt}
          done={done}
          tags={tags}
        />
      </SheetHeader>

      {/* 구분선 */}
      <div className="my-4 h-px w-full shrink-0 bg-gray-100 md:my-6" />

      <div className="flex-1 overflow-y-auto">
        {/* 링크 카드 */}
        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 flex min-w-0 flex-col items-start gap-3 rounded-[12px] bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
          >
            <div className="flex min-w-0 items-center justify-start space-x-2 pr-4">
              {linkData?.favicon && (
                <img src={linkData.favicon} alt="favicon" className="size-6 shrink-0" />
              )}
              {linkData?.description && (
                <p className="font-sm-medium truncate">{linkData.description}</p>
              )}
            </div>
            <p className="font-xs-regular truncate text-gray-400">{linkUrl}</p>
          </a>
        )}

        {/* TipTap 읽기 전용 */}
        <EditorContent
          editor={editor}
          className="font-sm-regular prose prose-sm prose-headings:font-base-semibold prose-headings:text-gray-800 prose-headings:mt-6 prose-headings:mb-2 prose-strong:font-semibold prose-strong:text-gray-800 prose-ul:pl-5 prose-li:my-0.5 prose-p:leading-relaxed prose-p:my-2 max-w-none text-gray-700"
        />
      </div>
    </div>
  );
}
