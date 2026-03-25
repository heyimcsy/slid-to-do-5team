'use client';

import type { Tags } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/_components/TodoDetailContent';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import noteImage from '@/../public/images/img-note.svg';
import MetaTags from '@/app/(routers)/(todo)/_components/MetaTags';
import SpeachComponent from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/_components/SpeachComponent';
import { useEditorWithContent } from '@/hooks/editor';
import { EditorContent } from '@tiptap/react';

import { Icon } from '@/components/icon/Icon';
import { Toolbar } from '@/components/Toolbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface NoteDraft {
  title: string;
  content: string; // editor.getHTML() 또는 JSON.stringify(editor.getJSON())
  savedAt: string; // 언제 임시저장 했는지
}

export default function NewNotePage() {
  const NOTE_CREATE: string = 'note-create';
  const tags: Tags[] = [
    { name: '코딩', color: 'green' },
    { name: '자기계발', color: 'yellow' },
    { name: '공부', color: 'red' },
  ];

  // 임시 mock — 나중에 params.goalId로 API 호출
  const note = {
    id: 1,
    title: '프로그래밍과 데이터 in JavaScript',
    goalTitle: '자바스크립트로 웹 서비스 만들기',
    todoTitle: '자바스크립트 기초 챕터1 듣기',
    isDone: true,
    updatedAt: '2024. 03. 25',
    tags: tags,
    linkUrl: 'https://www.codeit.kr/topics/getting-started-with-javascript/lessons/3480',
    linkTitle: '자바스크립드 기초 챕터1 | 코드잇',
  };

  const [title, setTitle] = useState<string>('');
  const [titleLength, setTitleLength] = useState<number>(0);
  const [saveCheck, setSaveCheck] = useState<boolean>(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  // editor 생성 + html 상태 관리를 한번에
  const { editor } = useEditorWithContent({
    variant: 'note',
    placeholder: '이 곳을 통해 노트 작성을 시작해주세요.',
  });

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const titleValue = event.target.value;
    if (titleLength >= 30) return;
    setTitle(titleValue);
    setTitleLength(titleValue.length);
  };

  // 로컬스토리지에서 값을 불러오는 함수
  const loadDraft = () => {
    const raw = localStorage.getItem(NOTE_CREATE);
    if (!raw) return;

    const draft = JSON.parse(raw) as NoteDraft;
    setTitle(draft.title);
    setTitleLength(draft.title.length);
    editor?.commands.setContent(JSON.parse(draft.content));
  };
  // 로컬스토리지에서 값을 삭제하는 함수
  const clearDraft = () => {
    localStorage.removeItem(NOTE_CREATE);
  };
  // 로컬스토리지에 값을 저장하는 함수
  const saveDraft = () => {
    const now = new Date();
    const draft: NoteDraft = {
      title,
      content: JSON.stringify(editor?.getJSON()),
      savedAt: now.toISOString(),
    };
    localStorage.setItem(NOTE_CREATE, JSON.stringify(draft));
    setSavedAt(now);
    setSaveCheck(true);
    setElapsedSeconds(0);
  };

  // 등록하기 버튼
  const handleSubmit = () => {
    const raw = localStorage.getItem(NOTE_CREATE);
    if (raw) {
      localStorage.removeItem(NOTE_CREATE);
    }
  };

  const getText = () => editor?.state.doc.textContent ?? '';
  // 공백 포함
  const withSpace = getText().length;
  // 공백 제외
  const withoutSpace = getText().replace(/\s/g, '').length;

  useEffect(() => {
    if (!savedAt) return;

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - savedAt.getTime()) / 1000);

      if (seconds >= 5) {
        setSaveCheck(false);
        setSavedAt(null);
        clearInterval(interval);
        return;
      }

      setElapsedSeconds(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [savedAt]);

  return (
    <div className="relative flex h-full w-full flex-col items-center p-4 md:w-159 md:pt-12 md:pb-7.5 lg:w-192 lg:pt-18 lg:pb-15.5">
      <div className="relative flex h-6 w-[343px] items-center justify-between md:h-10 md:w-full">
        <h1 className="font-base-semibold md:font-xl-semibold lg:font-2xl-semibold">
          노트 작성하기
        </h1>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={saveDraft}>
            임시저장
          </Button>
          <Button onClick={handleSubmit} variant={'default'} size="sm">
            등록하기
          </Button>
        </div>
        <div className="absolute top-5 right-4 z-1 hidden h-39 w-83 md:block">
          <SpeachComponent loadDraft={loadDraft} clearDraft={clearDraft} />
        </div>
      </div>

      <div className="mt-4 flex h-full w-[343px] flex-col rounded-[24px] bg-white p-4 pb-8 md:w-full">
        <Toolbar editor={editor} variant="note" />
        <div className="mt-4 flex h-fit items-center space-x-2 md:mt-7 md:space-x-3">
          <div className="flex w-[262px] items-center space-x-0.5 md:w-[527px] lg:w-[649px]">
            <Image src={noteImage} alt="describe note icon" width={40} height={40} />
            <Input
              value={title}
              onChange={onHandleChange}
              placeholder="노트의 제목을 작성해주세요."
              className="font-xl-semibold md:font-2xl-semibold w-full border-0 leading-tight text-gray-800"
            />
          </div>
          <p className="font-xs-medium text-gray-500">
            {titleLength}/<span className="text-orange-600">30</span>
          </p>
        </div>
        <MetaTags
          className="mt-7"
          goalTitle={note.goalTitle}
          todoTitle={note.todoTitle}
          updatedAt={note.updatedAt}
          isDone={note.isDone}
          tags={note.tags}
        />
        <hr className="mt-4 w-full border-gray-200 lg:mt-7" />
        <div className="overflow- y-scroll mt-4 h-3/4 min-h-0 lg:mt-7">
          <div className="w-full break-words whitespace-pre-wrap">
            <EditorContent editor={editor} />
          </div>
        </div>
        <div className="flex w-full justify-end">
          <p className="font-xs-regular text-gray-400">
            공백포함 {withSpace} | 공백제외 {withoutSpace}
          </p>
        </div>
      </div>
      <div className="absolute bottom-20 z-1 h-39 w-83 md:hidden">
        <SpeachComponent loadDraft={loadDraft} clearDraft={clearDraft} />
      </div>
      {saveCheck && (
        <div className="absolute bottom-40 z-1 flex h-10 w-[311px] items-center rounded-[28px] bg-orange-100 px-4 md:w-[576px] lg:w-[688px]">
          <Icon name="check" variant="orange" />
          <p className="font-sm-semibold text-orange-600">
            임시 저장이 완료되었습니다 ㆍ{elapsedSeconds}초 전
          </p>
        </div>
      )}
    </div>
  );
}
