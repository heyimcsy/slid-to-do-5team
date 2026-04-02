import type { TodoResponse } from '@/api/todos';
import type { OgInfoResponse } from '@/components/common/LinkEmbed';

import React from 'react';
import Image from 'next/image';
import noteImage from '@/../public/images/img-note.svg';
import MetaTags from '@/app/(routers)/(todo)/_components/MetaTags';
import { Editor, EditorContent } from '@tiptap/react';

import { LinkEmbed } from '@/components/common/LinkEmbed';
import { Toolbar } from '@/components/Toolbar';
import { Input } from '@/components/ui/input';

interface NoteEditorProps {
  editor: Editor | null;
  setLinkUrl: React.Dispatch<React.SetStateAction<string | null>>;
  title: string;
  onHandleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  titleLength: number;
  todoData: TodoResponse;
  linkUrl: string | null;
  linkData: OgInfoResponse | undefined;
  handleLinkDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleLinkClick: () => void;
}

export default function NoteEditor({
  editor,
  setLinkUrl,
  title,
  titleLength,
  onHandleChange,
  todoData,
  linkUrl,
  linkData,
  handleLinkDelete,
  handleLinkClick,
}: NoteEditorProps) {
  const getText = () => editor?.state.doc.textContent ?? '';

  const withSpace = getText().length;
  const withoutSpace = getText().replace(/\s/g, '').length;
  return (
    <div className="mt-4 flex w-[343px] flex-1 flex-col overflow-hidden rounded-[24px] bg-white p-4 pb-8 md:w-full">
      <Toolbar editor={editor} variant="note" onLinkConfirm={(url) => setLinkUrl(url)} />
      <div className="mt-4 flex h-fit w-full items-center space-x-2 md:mt-7 md:space-x-3">
        <div className="flex w-full items-center space-x-0.5">
          <Image src={noteImage} alt="describe note icon" width={40} height={40} />
          <div className="w-full">
            <Input
              value={title}
              onChange={onHandleChange}
              maxLength={30}
              placeholder="노트의 제목을 작성해주세요."
              className="font-xl-semibold md:font-2xl-semibold border-0 leading-tight text-gray-800"
            />
          </div>
        </div>
        <p className="font-xs-medium shrink-0 text-gray-500">
          {titleLength}/<span className="text-orange-600">30</span>
        </p>
      </div>
      <MetaTags
        className="mt-7"
        goalTitle={todoData.goal.title}
        todoTitle={todoData.title}
        createdAt={todoData.createdAt}
        done={todoData.done}
        tags={todoData.tags}
      />

      <hr className="mt-4 w-full border-gray-200 lg:mt-7" />
      <div className="mt-4 h-3/4 min-h-0 overflow-y-scroll lg:mt-7">
        <div className="w-full break-words whitespace-pre-wrap">
          {linkUrl && (
            <div className="mt-4 cursor-pointer" onClick={handleLinkClick}>
              <LinkEmbed url={linkUrl} onDelete={handleLinkDelete} data={linkData} />
            </div>
          )}
          <div
            className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 md:px-10 [&::-webkit-scrollbar]:hidden"
            onClick={() => editor?.commands.focus()}
          >
            <EditorContent editor={editor} className="text-gray-800" />
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <p className="font-xs-regular text-gray-400">
          공백포함 {withSpace} | 공백제외 {withoutSpace}
        </p>
      </div>
    </div>
  );
}
