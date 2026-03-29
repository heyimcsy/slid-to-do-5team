export const AUTH_LINK_VARIANTS = {
  login: {
    message: '슬리드투두가 처음이신가요?',
    href: '/signup',
    linkLabel: '회원가입',
    snsDividerLabel: 'SNS 계정으로 로그인',
  },
  signup: {
    message: '이미 회원이신가요?',
    href: '/login',
    linkLabel: '로그인',
    snsDividerLabel: 'SNS 계정으로 회원가입',
  },
} as const;
