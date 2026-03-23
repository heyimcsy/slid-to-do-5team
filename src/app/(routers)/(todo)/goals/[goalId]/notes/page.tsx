import Image from 'next/image';
import goalImage from '@/../public/images/large-goal.svg';

import { SearchInput } from '@/components/common/SearchInput';
import { SortFilter } from '@/components/common/SortFilter';

import NoteList from './_components/NoteList';

// 임시 mock 데이터 — 실제 API 연동 시 교체

const MOCK_NOTES = [
  {
    id: 1,
    title: '체계적인 폴더 구조 세팅하기',
    todoTitle: '자바스크립트 기초 챕터1 듣기',
    isDone: false,
    updatedAt: '2024. 04. 29',
  },
  {
    id: 2,
    title: '자바스크립트로 서버 연동하기',
    todoTitle: '자바스크립트 기초 챕터1 듣기',
    isDone: false,
    updatedAt: '2024. 04. 29',
  },
  {
    id: 3,
    title: '프로그래밍 시작하기 in JavaScript',
    todoTitle: '자바스크립트 기초 챕터4 듣기',
    isDone: false,
    updatedAt: '2024. 04. 29',
  },
  {
    id: 4,
    title: '프로그래밍과 데이터 in JavaScript',
    todoTitle: '자바스크립트 기초 챕터5 듣기',
    isDone: false,
    updatedAt: '2024. 04. 28',
  },
  {
    id: 5,
    title: '자바스크립트 오류/로딩 상태 처리하기',
    todoTitle: '자바스크립트 기초 챕터6 듣기',
    isDone: false,
    updatedAt: '2024. 04. 28',
  },
  {
    id: 6,
    title: '자바스크립트를 배우기 전 알아두어야 할 것',
    todoTitle: '자바스크립트 기초 챕터2 듣기',
    isDone: true,
    updatedAt: '2024. 04. 28',
  },
  {
    id: 7,
    title: '프로그래밍 시작하기 in JavaScript',
    todoTitle: '자바스크립트 기초 챕터3 듣기',
    isDone: true,
    updatedAt: '2024. 04. 27',
  },
  {
    id: 8,
    title: '자바스크립트 기초 지식',
    todoTitle: '자바스크립트 기초 챕터2 듣기',
    isDone: true,
    updatedAt: '2024. 04. 27',
  },
  {
    id: 9,
    title: '자바스크립트 시작하기 전 준비',
    todoTitle: '자바스크립트 기초 챕터1 듣기',
    isDone: true,
    updatedAt: '2024. 04. 26',
  },
  {
    id: 10,
    title: '체계적인 폴더 구조 세팅하기',
    todoTitle: '자바스크립트 기초 챕터1 듣기',
    isDone: false,
    updatedAt: '2024. 04. 29',
  },
  {
    id: 11,
    title: '자바스크립트로 서버 연동하기',
    todoTitle: '자바스크립트 기초 챕터1 듣기',
    isDone: false,
    updatedAt: '2024. 04. 29',
  },
  {
    id: 12,
    title: '프로그래밍 시작하기 in JavaScript',
    todoTitle: '자바스크립트 기초 챕터4 듣기',
    isDone: false,
    updatedAt: '2024. 04. 29',
  },
  {
    id: 13,
    title: '프로그래밍 시작하기 in JavaScript',
    todoTitle: '자바스크립트 기초 챕터4 듣기',
    isDone: false,
    updatedAt: '2024. 04. 29',
  },
  {
    id: 14,
    title: '프로그래밍과 데이터 in JavaScript',
    todoTitle: '자바스크립트 기초 챕터5 듣기',
    isDone: false,
    updatedAt: '2024. 04. 28',
  },
  {
    id: 15,
    title: '자바스크립트 오류/로딩 상태 처리하기',
    todoTitle: '자바스크립트 기초 챕터6 듣기',
    isDone: false,
    updatedAt: '2024. 04. 28',
  },
  {
    id: 16,
    title: '자바스크립트를 배우기 전 알아두어야 할 것',
    todoTitle: '자바스크립트 기초 챕터2 듣기',
    isDone: true,
    updatedAt: '2024. 04. 28',
  },
  {
    id: 17,
    title: '프로그래밍 시작하기 in JavaScript',
    todoTitle: '자바스크립트 기초 챕터3 듣기',
    isDone: true,
    updatedAt: '2024. 04. 27',
  },
  {
    id: 18,
    title: '자바스크립트 기초 지식',
    todoTitle: '자바스크립트 기초 챕터2 듣기',
    isDone: true,
    updatedAt: '2024. 04. 27',
  },
  {
    id: 19,
    title: '자바스크립트 시작하기 전 준비',
    todoTitle: '자바스크립트 기초 챕터1 듣기',
    isDone: true,
    updatedAt: '2024. 04. 26',
  },
];

export default function Notes() {
  return (
    <div className="h-full w-[343px] overflow-scroll pt-6 md:w-159 md:pt-12 lg:w-328 lg:pt-18">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between">
        <h1 className="font-xl-semibold lg:font-2xl-semibold hidden md:flex">노트 모아보기</h1>
        <div className="flex w-[343px] items-center justify-between md:w-[369px] lg:w-[409px]">
          <div className="w-62 md:w-70 lg:w-80">
            <SearchInput className="overflow-hidden bg-white" placeholder="노트를 검색해주세요" />
          </div>

          <SortFilter />
        </div>
      </div>

      {/* 목표 탭 */}
      <div className="lg:h=30 mt-6 flex h-16 w-full items-center justify-start space-x-3 rounded-[16px] bg-orange-100 p-4 md:mt-8 md:h-20 md:p-6 lg:mt-12 lg:space-x-6 lg:p-10">
        <Image
          src={goalImage}
          alt="describe goal icon"
          width={40}
          height={40}
          className="w-8 object-contain lg:w-10"
        />
        <h2 className="lg:font-2xl-semibold font-base-semibold md:font-xl-semibold text-gray-700">
          자바스크립트로 웹 서비스 만들기
        </h2>
      </div>

      {/* 노트 리스트 */}
      <div className="mt-4 md:mt-6">
        <NoteList notes={MOCK_NOTES} />
      </div>
    </div>
  );
}
