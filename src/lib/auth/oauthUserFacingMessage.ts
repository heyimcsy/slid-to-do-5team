import type { GoogleOAuthUserFacingErrorKind } from '@/types/oauth';

/**
 * {@link GoogleOAuthUserFacingErrorKind}별 사용자 노출 문구.
 * GIS `error_callback`, OAuth `error`, 백엔드 메시지 분류에 공통 사용.
 *
 * @see `src/types/oauth.d.ts` — `GoogleOAuthUserFacingErrorKind` vs `GoogleErrorCallbackType`
 */
export const GOOGLE_OAUTH_ERROR_MESSAGE_KO: Record<GoogleOAuthUserFacingErrorKind, string> = {
  popup_failed_to_open: '팝업을 열 수 없습니다. 팝업 차단을 해제한 뒤 다시 시도해 주세요.',
  popup_closed: '팝업이 닫혔습니다.',
  unknown: '로그인 중 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  access_denied: '액세스가 거절되었습니다.',
  invalid_grant: '권한 부여가 거절되었습니다.',
  unauthorized_client: '클라이언트가 권한이 없습니다.',
  invalid_request: '요청이 유효하지 않습니다.',
  invalid_client: '클라이언트가 유효하지 않습니다.',
  unsupported_grant_type: '지원되지 않는 권한 부여 유형입니다.',
  invalid_scope: '유효하지 않은 권한 범위입니다.',
  email_already_exists: '이미 존재하는 이메일입니다.',
  default: '로그인 중 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
};

/** OAuth 2.0 authorize / token 엔드포인트 `error` 코드(소문자) → 사용자 분류 키 */
const OAUTH2_ERROR_CODE_TO_TYPE: Partial<Record<string, GoogleOAuthUserFacingErrorKind>> = {
  access_denied: 'access_denied',
  invalid_request: 'invalid_request',
  unauthorized_client: 'unauthorized_client',
  invalid_client: 'invalid_client',
  invalid_scope: 'invalid_scope',
  unsupported_grant_type: 'unsupported_grant_type',
  invalid_grant: 'invalid_grant',
};

/** 백엔드·BFF가 내려주는 영문 메시지(정확 일치) → 분류 키 */
const BACKEND_MESSAGE_TO_TYPE: Record<string, GoogleOAuthUserFacingErrorKind> = {
  'Email already registered with a different account': 'email_already_exists',
};

function normalizeWhitespace(s: string): string {
  return s.trim().replace(/\s+/g, ' ');
}

/**
 * 원문(영문 에러 코드, OAuth `error`, 백엔드 message, GIS 관련 휴리스틱 등)을
 * {@link GoogleOAuthUserFacingErrorKind}으로 분류한다.
 */
export function resolveGoogleOAuthUserFacingErrorKind(raw: string): GoogleOAuthUserFacingErrorKind {
  const t = normalizeWhitespace(raw);
  if (!t) return 'default';

  const lower = t.toLowerCase();

  if (lower === 'popup_failed_to_open') return 'popup_failed_to_open';
  if (lower === 'popup_closed') return 'popup_closed';
  if (lower === 'unknown') return 'unknown';

  if (BACKEND_MESSAGE_TO_TYPE[t]) {
    return BACKEND_MESSAGE_TO_TYPE[t];
  }

  const directCode = OAUTH2_ERROR_CODE_TO_TYPE[lower];
  if (directCode) {
    return directCode;
  }

  if (lower.includes('invalid_grant')) return 'invalid_grant';
  if (lower.includes('access_denied') || /\baccess denied\b/i.test(t)) return 'access_denied';

  if (
    (lower.includes('email') && lower.includes('already')) ||
    lower.includes('already registered') ||
    lower.includes('different account')
  ) {
    return 'email_already_exists';
  }

  if (lower.includes('popup') && lower.includes('closed')) return 'popup_closed';
  if (lower.includes('popup') && (lower.includes('block') || lower.includes('fail'))) {
    return 'popup_failed_to_open';
  }

  return 'default';
}

/**
 * OAuth 리다이렉트·콜백·백엔드에서 온 에러 문자열을 사용자에게 보여줄 한국어로 바꾼다.
 * 이미 한글이면 그대로 둔다.
 */
export function getOAuthUserFacingMessageKo(raw: string): string {
  const t = normalizeWhitespace(raw);
  if (!t) return GOOGLE_OAUTH_ERROR_MESSAGE_KO.default;

  if (/[가-힣]/.test(t)) {
    return t;
  }

  const kind = resolveGoogleOAuthUserFacingErrorKind(t);
  return GOOGLE_OAUTH_ERROR_MESSAGE_KO[kind];
}
