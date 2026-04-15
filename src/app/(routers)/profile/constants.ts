export const PROFILE_TEXT = {
  TITLE: '내 정보 관리',
  SUCCESS_PROFILE_MESSAGE: '유저의 이미지와 닉네임이 저장되었습니다.',
  SUCCESS_PASSWORD_MESSAGE: '유저의 비밀번호가 수정되었습니다. ',
  ERROR_MESSAGE: (target: string) => `${target}을 저장 중 문제가 발생했습니다.`,
  DUPLICATE_CHECK: '중복확인 해주세요',
  SAVE: '저장하기',
  IMAGE_EDIT: '프로필 이미지 편집',
  EMAIL: '이메일',
  NAME: '이름',
  DUPLICATE: '중복확인',
  CHECK: {
    POSSIBLE: '사용 가능한 이름입니다.',
    IMPOSSIBLE: '중복된 이름입니다.',
  },
  NAME_PLACEHOLDER: '이름을 입력해주세요.',
  CHANGE_PASSWORD: '비밀번호 변경',
  CURRENT_PASSWORD: '현재 비밀번호를 입력해주세요',
  NEW_PASSWORD: '새 비밀번호를 입력해주세요',
  CONFIRM_PASSWORD: '새 비밀번호를 다시 입력해주세요',
  PASSWORD_LENGTH: '비밀번호는 8자 이상이어야 합니다',
  REPEAT_PASSWORD: '비밀번호를 다시 입력해주세요',
  DUPLICATE_PASSWORD: '기존 비밀번호와 새 비밀번호가 일치합니다.',
  PASSWORD_UNSAME: '비밀번호가 일치하지 않습니다',
  CURRENT_PASSWORD_UNSAME: '현재 비밀번호가 일치하지 않습니다',
  NICKNAME_LENGTH: '20자 이하로 입력해주세요',
  USER_INFO: '유저 정보',
  PASSWORD: '비밀번호',
  IMAGE_NAME: '이미지와 이름',
};

export const PROFILE_IMAGE = {
  ALT: '유저 이미지',
};

export const CHECK_NICKNAME = 'check-nickname';
export const EMAIL = 'email' as const;
export const NAME = 'name' as const;
export const CURRENT_PASSWORD = 'currentPassword' as const;
export const NEW_PASSWORD = 'newPassword' as const;
export const CONFIRM_PASSWORD = 'confirmPassword' as const;
