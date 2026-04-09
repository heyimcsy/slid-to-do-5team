// ──────────────────────────────────────────────
// GoalsInnerTab 관련 상수
// ──────────────────────────────────────────────

/** 표시 텍스트 */
export const GOALS_TEXT = {
  GOAL: '목표',
  TODO_KO: '할일',
  PAGE_TITLE_SUFFIX: '님의 목표',
  PROGRESS_LABEL: '목표 진행도',
  PROGRESS_UNIT: '%',
  NOTE_LINK_LABEL: '노트 모아보기',
  ERROR_TITLE: '목표 상세페이지',
  EDIT_GOAL_DIALOG_TITLE: '목표를 수정하시겠습니까?',
  EDIT_GOAL_INPUT_PLACEHOLDER: '목표 제목을 입력하세요',
  TODO: 'TO DO',
  DONE: 'DONE',
  EMPTY: {
    TODO: '해야할 일이 아직 없어요',
    DONE: '완료한 일이 아직 없어요',
  },
  CALENDAR: '캘린더 보기',
  NOTE_DETAIL_BUTTON: '노트 열기',
} as const;

export const NOTES_TEXT = {
  NOTE: '노트',
  NOTE_ALL: '노트 모아보기',
  NOTE_SEARCH_INPUT: '노트를 검색해주세요',
  EMPTY_NOTE_LABEL: '아직 등록된 노트가 없어요',
  NOTE_EDITOR_PLACEHOLDER: '이 곳을 통해 노트 작성을 시작해주세요.',
  NOTE_CREATE: '노트 작성하기',
  SAVED_DATA: '임시 저장된 노트가 있어요.',
  SAVED_DATA_LOAD: '저장된 노트를 불러오시겠어요?',
  LOAD: '불러오기',
  LOAD_DIALOG: '제목의 노트를 불러오시겠어요?',
  NOTE_TITLE_INPUT: '노트의 제목을 작성해주세요.',
  TITLE_MAX_LENGTH: 30,
  LINK_DELETE_BUTTON: '링크 삭제',
  FAVICON_ALT: 'site favicon image',
  OG_IMAGE_ALT: 'site og image',
  TEMPORARY_SAVED_CHECK: (elapsedSeconds: number) =>
    `임시 저장이 완료되었습니다 ㆍ${elapsedSeconds}초 전`,
  LINK_PANEL_CLOSE: '링크 미리보기 패널 닫기',
};
export const META_TAGS = {
  GOAL: '목표',
  CREATED_AT: '작성일',
  TODO: '할 일',
  TAGS: { ICON: '#', TAG: '태그' },
  ATTACHMENT: '첨부 자료',
  WRITE_NOTE: '작성된 노트',
  DUEDATE: '마감기한',
};

/** 이미지 관련 */
export const NOTE_CREATE: string = 'note-create';

export const NOTE_IMAGE_SMALL = {
  ALT: 'note image for note page route',
  WIDTH: 32,
  HEIGHT: 32,
} as const;

export const NOTE_IMAGE = {
  ALT: 'note image for note page route',
  WIDTH: 40,
  HEIGHT: 40,
} as const;

export const NOTE_IMAGE_BIG = {
  ALT: 'note image for note page route',
  WIDTH: 122,
  HEIGHT: 122,
} as const;

export const GOAL_IMAGE = {
  ALT: 'describe goal icon',
  WIDTH: 32,
  HEIGHT: 32,
} as const;

export const GOAL_IMAGE_BIG = {
  ALT: 'describe goal icon',
  WIDTH: 40,
  HEIGHT: 40,
} as const;

export const EMPTY_IMAGE = {
  ALT: 'describe empty situation',
  WIDTH: 130,
  HEIGHT: 140,
} as const;

export const EMPTY_IMAGE_NOTE = {
  ALT: 'describe empty note situation',
  WIDTH: 133,
  HEIGHT: 140,
} as const;

export const SPEECH_BUBBLE_IMAGE = {
  ALT: 'describe speech bubble image',
  WIDTH: 332,
  HEIGHT: 156,
} as const;

export const TODO_FILE_IMAGE = {
  ALT: 'describe user uploaded image with todo',
  WIDTH: 500,
  HEIGHT: 350,
} as const;

/** 도넛 프로그레스 색상 */
export const DONUT_PROGRESS_COLORS = {
  TRACK_COLOR: '#FFA96C',
} as const;
