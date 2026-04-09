export const SELECT_VALUE = {
  EDIT: { LABEL: '수정하기', VALUE: 'edit' },
  DELETE: { LABEL: '삭제하기', VALUE: 'delete' },
  NOTE_EDIT: { LABEL: '노트수정', VALUE: 'note-edit' },
  NOTE_NEW: { LABEL: '노트작성', VALUE: 'note-new' },
};

export const DIALOG_VALUE = {
  BUTTON: { CANCEL: '취소', CONFIRM: '확인' },

  TITLE_EDIT: (value: string) => `${value}을(를) 수정하시겠습니까 ?`,
  TITLE_DELETE: '정말 삭제하시겠어요?',
  DESCRIPTION_DELETE: (value: string) => `삭제된 ${value}은(는) 복구할 수 없습니다.`,

  DOT_TRIGGER_ALIA_LABEL: '더보기',
  TITLE_EXIT: '정말 나가시겠어요?',
};

export const BUTTON_LABEL = {
  NEW_TODO: '할 일 추가',
  TEMPORARY_SAVE: '임시저장',
  RESISTER: '등록하기',
  DELETE: '삭제하기',
};

export const EDITOR_LABELS = {
  WITH_SPACE: '공백포함',
  WITHOUT_SPACE: '공백제외',
};
