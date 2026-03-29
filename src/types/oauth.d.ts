/**
 * Google Identity Services (`accounts.google.com/gsi/client`) — 최소 타입.
 * Kakao OAuth — 최소 타입.
 * @see https://developers.google.com/identity/gsi/web/reference/js-reference
 * @see https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#login-response
 *
 * @description Google 에러 콜백 타입
 * @enum {string}
 * @see
 * @value popup_closed: 팝업이 닫혔습니다.
 * @value popup_blocked: 팝업이 차단되었습니다.
 * @value access_denied: 액세스가 거절되었습니다.
 * @value invalid_grant: 권한 부여가 거절되었습니다.
 * @value unauthorized_client: 클라이언트가 권한이 없습니다.
 * @value invalid_request: 요청이 유효하지 않습니다.
 * @value invalid_client: 클라이언트가 유효하지 않습니다.
 * @value unsupported_grant_type: 지원되지 않는 권한 부여 유형입니다.
 * @value invalid_scope: 유효하지 않은 권한 범위입니다.
 * @value email_already_exists: 이미 존재하는 이메일입니다.
 * @value default: 로그인 중 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
 */
export type GoogleErrorCallbackType =
  | 'popup_closed'
  | 'popup_blocked'
  | 'access_denied'
  | 'invalid_grant'
  | 'unauthorized_client'
  | 'invalid_request'
  | 'invalid_client'
  | 'unsupported_grant_type'
  | 'invalid_scope'
  | 'email_already_exists'
  | 'default';

// --- Google Types ---
interface GoogleTokenClientError {
  /** 에러 식별자
   * @see {@link https://developers.google.com/identity/gsi/web/reference/js-reference#tokenclient.requestaccesstoken.error_callback}
   * @type {GoogleErrorCallbackType}
   */
  type: GoogleErrorCallbackType;
  /** 에러에 대한 상세 설명 (선택 사항) */
  message?: string;
  /** 브라우저 콘솔 등에 찍히는 스택 트레이스 (선택 사항) */
  stack?: string;
}

interface GoogleTokenResponse {
  /** 액세스 토큰 */
  access_token: string;
  /** 토큰 만료 시간 (초) */
  expires_in: number;
  /** 사용자 이메일 도메인 */
  hd?: string;
  /** 프롬프트 타입 */
  prompt: string;
  /** 토큰 타입 */
  token_type: string;
  /** 권한 범위 */
  scope: string;
}

interface GoogleTokenClientConfig {
  /** 클라이언트 ID */
  client_id: string;
  /** 권한 범위 */
  scope: string;
  /** 포함된 권한 범위 */
  include_granted_scopes?: boolean;
  /** 토큰 응답 콜백 */
  callback: (resp: GoogleTokenResponse) => void;
  /** 에러 콜백 */
  error_callback?: (err: GoogleTokenClientError) => void;
}

interface GoogleTokenClientOverrideConfig {
  /** 프롬프트 타입 */
  prompt?: 'none' | 'consent' | 'select_account';
  /** 로그인 힌트 */
  login_hint?: string;
  /** 상태 */
  state?: string;
  /** 추가 옵션(혹시 모를 추가 옵션을 위해 인덱스 시그니처를 허용함) */
  [key: string]: unknown;
}

// --- Kakao Types ---
interface KakaoError {
  /** 에러 코드 */
  error: string;
  /** 에러 설명 */
  error_description: string;
}

interface KakaoAuthResponse {
  /** 액세스 토큰 */
  access_token: string;
  /** 리프레시 토큰 */
  refresh_token: string;
  /** 토큰 타입 */
  token_type: string;
  /** 토큰 만료 시간 (초) */
  expires_in: number;
  /** 권한 범위 */
  scope: string;
  /** 리프레시 토큰 만료 시간 (초) */
  refresh_token_expires_in: number;
}

interface KakaoLoginOptions {
  /** 성공 콜백 */
  success: (auth: KakaoAuthResponse) => void;
  /** 실패 콜백 */
  fail: (err: KakaoError) => void;
  /** 항상 호출되는 콜백 */
  always?: () => void;
  /** 권한 범위 */
  scope?: string;
  /** 카카오톡 앱으로 로그인 시도 여부 */
  throughTalk?: boolean;
}

interface KakaoAuthorizeOptions {
  /** 리다이렉트 URL */
  redirectUri: string;
  /** 상태 */
  state?: string;
  /** 권한 범위 */
  scope?: string;
  /** 카카오톡 앱으로 로그인 시도 여부 */
  throughTalk?: boolean;
  /** 프롬프트 타입 */
  prompts?: 'login' | 'none' | 'create';
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          /** 토큰 클라이언트 초기화 */
          initTokenClient: (config: GoogleTokenClientConfig) => {
            /** 액세스 토큰 요청 */
            requestAccessToken: (overrideConfig?: GoogleTokenClientOverrideConfig) => void;
          };
        };
      };
    };
    Kakao?: {
      /** 카카오 초기화 */
      init: (appKey: string) => void;
      /** 카카오 초기화 여부 */
      isInitialized: () => boolean;
      /** 카카오 인증 */
      Auth: {
        /** 팝업창으로 카카오 로그인 진행 */
        login: (options: KakaoLoginOptions) => void;
        /** 리다이렉트 URL로 카카오 로그인 진행 */
        authorize: (options: KakaoAuthorizeOptions) => void;
        /** 현재 할당된 액세스 토큰 반환 */
        getAccessToken: () => string | null;
        /** 로그아웃 처리하며 액세스 토큰 만료 */
        logout: (callback?: () => void) => void;
      };
    };
  }
}
