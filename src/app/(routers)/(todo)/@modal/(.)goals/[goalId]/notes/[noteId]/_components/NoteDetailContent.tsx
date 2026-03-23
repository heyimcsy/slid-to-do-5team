'use client';

import type { Note } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/notes/[noteId]/types';

import Image from 'next/image';
import noteImage from '@/../public/images/img-note.svg';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Chips } from '@/components/common/Chips';
import { Icon } from '@/components/icon/Icon';
import { Badge } from '@/components/ui/badge';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function NoteDetailContent({ note }: { note: Note }) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: true })],
    content: JSON.parse(note.content),
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
            {note.title}
          </SheetTitle>
        </div>

        {/* 메타 정보 */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-x-8">
          {/* 목표 */}
          <div className="font-sm-regular flex items-center gap-2">
            <Icon name="flag" size={18} className="shrink-0" />
            <span className="text-gray-400">목표</span>
            <span className="text-gray-700">{note.goalTitle}</span>
          </div>

          {/* 작성일 */}
          <div className="font-sm-regular flex items-center gap-2">
            <Icon name="calendar" size={18} className="shrink-0" />
            <span className="text-gray-400">작성일</span>
            <span className="text-gray-700">{note.updatedAt}</span>
          </div>

          {/* 할일 + 상태 뱃지 */}
          <div className="font-sm-regular flex items-center gap-2">
            <Icon name="checkMini" size={18} className="shrink-0" />
            <span className="text-gray-400">할 일</span>
            <span className="truncate text-gray-700">{note.todoTitle}</span>
            <Chips variant={note.isDone ? 'done' : 'todo'} />
          </div>

          {/* 태그 */}
          <div className="font-sm-regular flex items-center gap-2">
            <span className="flex size-4.5 shrink-0 items-center justify-center text-gray-400">
              #
            </span>
            <span className="shrink-0 text-gray-400">태그</span>
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag, index) => (
                <Badge key={index} color={tag.color}>
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SheetHeader>

      {/* 구분선 */}
      <div className="my-4 h-px w-full shrink-0 bg-gray-100 md:my-6" />

      {/* ── 스크롤 콘텐츠 ── */}
      <div className="flex-1 overflow-y-auto">
        {/* 링크 카드 */}
        {note.linkUrl && (
          <a
            href={note.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 flex items-center gap-3 rounded-[12px] bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
          >
            <div className="min-w-0">
              <p className="font-sm-semibold truncate text-gray-800">{note.linkTitle}</p>
              <p className="font-xs-regular truncate text-gray-400">{note.linkUrl}</p>
            </div>
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
