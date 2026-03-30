/** 백엔드 409(이메일 중복) 시 BFF·OAuth·클라이언트 공통 문구 */
export const DUPLICATE_ACCOUNT_MESSAGE_KO = '이미 가입된 이메일입니다.' as const;
export const AUTH_SERVICE_ERROR_MESSAGE_KO =
  '인증 서버와 통신 중 오류가 발생했습니다. 다시 시도해 주세요.' as const;
export const AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO = '리프레시 토큰이 없습니다.' as const;
export const AUTH_TOKENS_EXPIRED_MESSAGE_KO =
  '인증이 만료되었습니다. 다시 로그인해 주세요.' as const;
export const MISSING_OAUTH_RESPONSE_MESSAGE_KO =
  '소셜 로그인 서비스에서 응답이 없습니다. 다시 시도해 주세요.' as const;
export const SESSION_EXPIRED_OR_INVALID_MESSAGE_KO =
  '로그인 세션이 만료되었거나 유효하지 않습니다. 다시 시도해 주세요.' as const;
export const MISMATCHED_REDIRECT_URI_MESSAGE_KO =
  '리다이렉트 URI가 일치하지 않습니다. 다시 시도해 주세요.' as const;
export const TOKEN_EXCHANGE_FAILED_MESSAGE_KO =
  'OAuth 승인 토큰 교환에 실패했습니다. 다시 시도해 주세요.' as const;
export const BACKEND_LOGIN_FAILED_MESSAGE_KO =
  '백엔드 로그인에 실패했습니다. 다시 시도해 주세요.' as const;
export const GOOGLE_CLIENT_ID_UNSET_MESSAGE_KO =
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.' as const;
export const GOOGLE_CLIENT_SECRET_UNSET_MESSAGE_KO =
  'GOOGLE_CLIENT_SECRET가 설정되지 않았습니다.' as const;
export const KAKAO_CLIENT_ID_UNSET_MESSAGE_KO =
  'NEXT_PUBLIC_KAKAO_CLIENT_ID가 설정되지 않았습니다.' as const;
export const KAKAO_CLIENT_SECRET_UNSET_MESSAGE_KO =
  'KAKAO_CLIENT_SECRET가 설정되지 않았습니다.' as const;
export const GOOGLE_TOKEN_EXCHANGE_FAILED_MESSAGE_KO = 'Google 토큰 교환에 실패했습니다.' as const;
export const KAKAO_TOKEN_EXCHANGE_FAILED_MESSAGE_KO = '카카오 토큰 교환에 실패했습니다.' as const;
export const TOKEN_RESPONSE_INVALID_TYPE_MESSAGE_KO = '토큰 응답 형식이 JSON이 아닙니다.' as const;
export const TOKEN_RESPONSE_MISSING_ACCESS_TOKEN_MESSAGE_KO =
  '토큰 응답에 access_token이 없습니다.' as const;
