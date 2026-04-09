'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import noteImage from '@/../public/images/img-note.svg';
import MetaTags from '@/app/(routers)/(todo)/_components/MetaTags';
import NoteDetailSkeleton from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/notes/[noteId]/_components/NoteDetailSkeleton';
import { NOTE_IMAGE } from '@/app/(routers)/(todo)/constants';
import { useOgInfo } from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/hooks/useOgInfo';
import { useNoteDetail } from '@/hooks/useNoteDetail';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function NoteDetailContainer({ noteId }: { noteId: number }) {
  const searchParams = useSearchParams();
  const todoId: number = Number(searchParams.get('todoId'));

  const { noteData, todoData, isLoading, isSuccess } = useNoteDetail({ noteId, todoId });

  const { data: linkData } = useOgInfo(todoData?.linkUrl);
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: true })],
    content: noteData?.content,
    editable: false,
    immediatelyRender: false,
  });
  if (isLoading) return <NoteDetailSkeleton />;

  if (!isSuccess || !noteData || !todoData) return null;

  return (
    <div className="flex h-full flex-col py-10">
      <div className="h-full w-[375px] overflow-scroll rounded-[16px] bg-white p-4 md:w-159">
        {/* ── 헤더 ── */}
        <div className="shrink-0 space-y-6 md:space-y-7.5">
          {/* 아이콘 + 제목 */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <Image
              src={noteImage}
              alt={NOTE_IMAGE.ALT}
              width={NOTE_IMAGE.WIDTH}
              height={NOTE_IMAGE.HEIGHT}
              className="w-8 md:w-10"
            />
            <p className="font-xl-semibold md:font-2xl-semibold leading-tight text-gray-800">
              {noteData.title}
            </p>
          </div>

          {/* 메타 정보 */}
          <MetaTags
            goalTitle={todoData.goal.title}
            todoTitle={todoData.title}
            createdAt={todoData.createdAt}
            done={todoData.done}
            tags={todoData.tags}
          />
        </div>

        {/* 구분선 */}
        <div className="my-4 h-px w-full shrink-0 bg-gray-100 md:my-6" />

        <div className="flex-1 overflow-y-auto">
          {/* 링크 카드 */}
          {noteData.linkUrl && (
            <a
              href={noteData.linkUrl}
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
              <p className="font-xs-regular truncate text-gray-400">{noteData.linkUrl}</p>
            </a>
          )}

          {/* TipTap 읽기 전용 */}
          <EditorContent
            editor={editor}
            className="font-sm-regular prose prose-sm prose-headings:font-base-semibold prose-headings:text-gray-800 prose-headings:mt-6 prose-headings:mb-2 prose-strong:font-semibold prose-strong:text-gray-800 prose-ul:pl-5 prose-li:my-0.5 prose-p:leading-relaxed prose-p:my-2 max-w-none text-gray-700"
          />
        </div>
      </div>
    </div>
  );
}
