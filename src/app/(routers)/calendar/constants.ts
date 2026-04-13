export const CALENDAR_TEXT = {
  USER: (userName: string) => `${userName}님의 캘린더`,
  ADD_TODO: '할 일 추가',
  ALL_GOALS: '전체 목표',
  PREVIOUS_YEAR: '이전 연도로 이동',
  PREVIOUS_MONTH: '이전 달로 이동',
  NEXT_YEAR: '다음 연도로 이동',
  NEXT_MONTH: '다음 달로 이동',
  THE_TODAY: '오늘 날짜로 이동',
  TODO: '할일:',
  COUNT: '개',
  DUEDATE_RANGE: '마감일 범위: ',
  YEAR_MONTH: (y: number, m: number) => `${y}년 ${m}월`,
  TODAY: 'today',
  PLUS: '+',
  CHECK: '✓ ',
  EMPTY_TODO: '해당 날짜의 할일이 없습니다.',
};

export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export const GOAL_IMAGE = {
  ALT: 'goal image',
  WIDTH: 20,
  HEIGHT: 20,
};
