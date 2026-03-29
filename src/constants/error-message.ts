/** 백엔드 409(이메일 중복) 시 BFF·OAuth·클라이언트 공통 문구 */
export const DUPLICATE_ACCOUNT_MESSAGE_KO = '이미 가입된 이메일입니다.' as const;
export const AUTH_SERVICE_ERROR_MESSAGE_KO =
  '인증 서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' as const;
export const AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO = '리프레시 토큰이 없습니다.' as const;
export const AUTH_TOKENS_EXPIRED_MESSAGE_KO =
  '인증이 만료되었습니다. 다시 로그인해 주세요.' as const;
