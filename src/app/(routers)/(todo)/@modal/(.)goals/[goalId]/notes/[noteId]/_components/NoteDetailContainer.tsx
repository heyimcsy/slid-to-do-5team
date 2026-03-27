'use client';

import type {
  Note,
  NoteTag,
} from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/notes/[noteId]/types';

import { useRouter } from 'next/navigation';
import NoteDetailContent from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/notes/[noteId]/_components/NoteDetailContent';

import { Sheet, SheetContent } from '@/components/ui/sheet';

const tags: NoteTag[] = [
  { name: '코딩', color: 'green' },
  { name: '자기계발', color: 'yellow' },
  { name: '공부', color: 'red' },
];

const MOCK_NOTE: Note = {
  id: 1,
  title: '프로그래밍과 데이터 in JavaScript',
  goalTitle: '자바스크립트로 웹 서비스 만들기',
  todoTitle: '자바스크립트 기초 챕터1 듣기',
  isDone: false,
  updatedAt: '2024. 03. 25',
  tags: tags,
  linkUrl: 'https://www.codeit.kr/topics/getting-started-with-javascript/lessons/3480',
  linkTitle: '자바스크립드 기초 챕터1 | 코드잇',
  content: JSON.stringify({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: '자바(Java)는 단순한 프로그래밍 언어를 넘어, 기술 발전의 흐름을 함께해온 대표적인 언어입니다. 1990년대 중반, 다양한 플랫폼에서 안정적으로 동작하는 소프트웨어에 대한 요구가 높아지던 시기, 자바는 플랫폼 독립성과 객체지향 프로그래밍을 핵심 가치로 내세우며 등장했습니다. ',
          },
          {
            type: 'text',
            marks: [{ type: 'bold' }],
            text: '"한 번 작성하면, 어디서나 실행된다(Write Once, Run Anywhere)"',
          },
          {
            type: 'text',
            text: '는 자바의 철학은 많은 개발자들에게 새로운 가능성을 제시했고, 이는 곧 웹과 인터넷 기술의 급속한 발전과 맞물리며 폭넓은 채택으로 이어졌습니다.',
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: '🔒 자바의 시작과 성장' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: '1995년, 썬 마이크로시스템즈(Sun Microsystems)의 ' },
                  {
                    type: 'text',
                    marks: [{ type: 'bold' }],
                    text: '제임스 고슬링(James Gosling)',
                  },
                  { type: 'text', text: '에 의해 처음 개발되어 공개되었습니다.' },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: '당시로서는 혁신적이었던 가상 머신(Virtual Machine) 개념을 통해 플랫폼 독립적인 실행 환경을 가능하게 했고, 객체지향 프로그래밍의 확산에도 크게 기여했습니다.',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: '자바는 곧 인터넷과 웹의 급속한 발전과 함께 주요 개발 언어로 자리 잡게 됩니다.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: '🌐 웹 개발의 핵심 기술로' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: '1997년, 자바는 공식 발표되며 웹 프로그래밍을 본격적으로 지원하기 시작했습니다.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: '🔄 변화하는 개발 환경 속에서' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: '오랜 시간 웹 개발의 주류 기술이었던 자바는, 2010년대 이후 프론트엔드와 백엔드 기술이 빠르게 진화함에 따라 상대적으로 비중이 줄어들기 시작합니다.',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: '프론트엔드에서는 ' },
                  {
                    type: 'text',
                    marks: [{ type: 'bold' }],
                    text: '자바스크립트 기반 프레임워크(React, Vue, Angular)',
                  },
                  {
                    type: 'text',
                    text: '가 대세가 되었고, 백엔드에서도 Node.js, Python, Go 같은 언어들이 각광받으면서 자바의 입지는 다소 약해지는 듯 보였습니다.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: '🌐 웹 개발의 핵심 기술로' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: '1997년, 자바는 공식 발표되며 웹 프로그래밍을 본격적으로 지원하기 시작했습니다.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: '🔄 변화하는 개발 환경 속에서' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: '오랜 시간 웹 개발의 주류 기술이었던 자바는, 2010년대 이후 프론트엔드와 백엔드 기술이 빠르게 진화함에 따라 상대적으로 비중이 줄어들기 시작합니다.',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: '프론트엔드에서는 ' },
                  {
                    type: 'text',
                    marks: [{ type: 'bold' }],
                    text: '자바스크립트 기반 프레임워크(React, Vue, Angular)',
                  },
                  {
                    type: 'text',
                    text: '가 대세가 되었고, 백엔드에서도 Node.js, Python, Go 같은 언어들이 각광받으면서 자바의 입지는 다소 약해지는 듯 보였습니다.',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }),
};
export default function NoteDetailContainer({ noteId }: { noteId: number }) {
  const router = useRouter();
  console.log(noteId, '곧 사용할것입니다.');
  const onClose = () => router.back();

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="right">
        <NoteDetailContent note={MOCK_NOTE} />
      </SheetContent>
    </Sheet>
  );
}
