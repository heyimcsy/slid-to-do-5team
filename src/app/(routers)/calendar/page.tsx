import BottomButton from '@/app/(routers)/calendar/_components/BottomButton';
import CalenderPageHead from '@/app/(routers)/calendar/_components/CalenderPageHead';
import ScheduleCalendar from '@/app/(routers)/calendar/_components/ScheduleCalendar';

const mockTodos = [
  {
    id: 1,
    title: '자바스크립트 기초 챕터1 듣기',
    done: false,
    dueDate: '2026-03-03T00:00:00.000Z',
  },
  {
    id: 2,
    title: '개발 환경 세팅하기 개발 환경 세팅하기 개발 환경 세팅하기',
    done: true,
    dueDate: '2026-03-10T00:00:00.000Z',
  },
  { id: 3, title: '사용자 테이블 설계', done: false, dueDate: '2026-03-10T00:00:00.000Z' },
  { id: 4, title: '목표 진행도 구현', done: false, dueDate: '2026-03-10T00:00:00.000Z' },
  { id: 5, title: 'JSON 서버 세팅', done: false, dueDate: '2026-03-15T00:00:00.000Z' },
  { id: 6, title: '오류/로딩 상태 처리', done: true, dueDate: '2026-03-30T00:00:00.000Z' },
  { id: 7, title: '오류/로딩 상태 처리 꼭하자', done: false, dueDate: '2026-03-10T00:00:00.000Z' },
  { id: 8, title: '오류/로딩 상태 처리 꼭하자8', done: false, dueDate: '2026-03-10T00:00:00.000Z' },
  { id: 9, title: '컴포넌트 분리 리팩토링', done: false, dueDate: '2026-03-05T00:00:00.000Z' },
  { id: 10, title: 'API 연동 완료하기', done: true, dueDate: '2026-03-07T00:00:00.000Z' },
  { id: 11, title: '단위 테스트 작성', done: false, dueDate: '2026-03-12T00:00:00.000Z' },
  { id: 12, title: 'PR 리뷰 반영하기', done: true, dueDate: '2026-03-12T00:00:00.000Z' },
  { id: 13, title: '스타일 가이드 문서화', done: false, dueDate: '2026-03-14T00:00:00.000Z' },
  { id: 14, title: '다크모드 대응', done: false, dueDate: '2026-03-17T00:00:00.000Z' },
  { id: 15, title: '접근성 개선', done: true, dueDate: '2026-03-17T00:00:00.000Z' },
  { id: 16, title: '성능 최적화', done: false, dueDate: '2026-03-19T00:00:00.000Z' },
  { id: 17, title: '배포 환경 설정', done: false, dueDate: '2026-03-20T00:00:00.000Z' },
  { id: 18, title: '모바일 반응형 수정', done: true, dueDate: '2026-03-21T00:00:00.000Z' },
  { id: 19, title: '캘린더 컴포넌트 구현', done: false, dueDate: '2026-03-24T00:00:00.000Z' },
  { id: 20, title: '노트 에디터 연동', done: false, dueDate: '2026-03-24T00:00:00.000Z' },
  { id: 21, title: '임시저장 기능 구현', done: true, dueDate: '2026-03-25T00:00:00.000Z' },
  { id: 22, title: '검색 필터 디바운스 적용', done: false, dueDate: '2026-03-26T00:00:00.000Z' },
  { id: 23, title: '낙관적 업데이트 적용', done: true, dueDate: '2026-03-27T00:00:00.000Z' },
  { id: 24, title: '인터셉팅 라우트 버그 수정', done: false, dueDate: '2026-03-28T00:00:00.000Z' },
  { id: 25, title: '최종 QA 진행', done: false, dueDate: '2026-03-31T00:00:00.000Z' },
  { id: 26, title: '오류/로딩 상태 처리 꼭하자', done: false, dueDate: '2026-03-10T00:00:00.000Z' },
  { id: 27, title: '오류/로딩 상태 처리 꼭하자', done: false, dueDate: '2026-03-10T00:00:00.000Z' },
  {
    id: 28,
    title: '오류/로딩 상태 처리 꼭하자8 오류/로딩 상태 처리 꼭하자8 오류/로딩 상태 처리 꼭하자8',
    done: false,
    dueDate: '2026-03-10T00:00:00.000Z',
  },
  { id: 29, title: '오류/로딩 상태 처리 꼭하자', done: false, dueDate: '2026-03-10T00:00:00.000Z' },
  {
    id: 30,
    title: '오류/로딩 상태 처리 꼭하자8',
    done: false,
    dueDate: '2026-03-10T00:00:00.000Z',
  },
  { id: 31, title: 'PR 리뷰 반영하기', done: true, dueDate: '2026-03-12T00:00:00.000Z' },
  { id: 32, title: '머리카락 팔기', done: false, dueDate: '2026-03-12T00:00:00.000Z' },
  {
    id: 33,
    title: '한국은 3월 30일, UTC는 3월 29일',
    done: false,
    dueDate: '2026-03-29T16:00:00.000Z', // UTC 29일 16시 = 한국 30일 01시
  },
  {
    id: 34,
    title: '한국은 3월 1일, UTC는 2월 28일',
    done: false,
    dueDate: '2026-02-28T15:00:00.000Z', // UTC 2월 28일 15시 = 한국 3월 1일 00시
  },
];
export default function CalenderPage() {
  return (
    <div className="relative flex h-full w-86 flex-col items-center pt-8 pb-14 md:w-159 md:space-y-6 lg:w-320 lg:space-y-4">
      <CalenderPageHead />
      <ScheduleCalendar todos={mockTodos} />
      <div className="fixed bottom-0 flex h-16 w-full items-center justify-center border-t-1 bg-white px-4 md:hidden">
        <BottomButton />
      </div>
    </div>
  );
}
