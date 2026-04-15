/** 대시보드 "목표 별 할 일" — 해당 목표에서 보여줄 할 일 개수, 스크롤 시 동일 크기로 추가 로드 */
export const PAGE_LIMIT = 4;

export type DashboardBreakpoint = 'sm' | 'md' | 'lg';

/** TodoList에서 텍스트 애니메이션 시킬 최소 글자 수(브레이크포인트별) */
export const MARQUEE_CHAR_THRESHOLD: Record<DashboardBreakpoint, number> = {
  sm: 18,
  md: 24,
  lg: 30,
};

/** TodoList에서 텍스트 애니메이션이 트리거될 조건 함수 */
export const shouldMarquee = (title: string, breakpoint: DashboardBreakpoint) =>
  title.trim().length > MARQUEE_CHAR_THRESHOLD[breakpoint];
