/**
 * Google Identity Services (`accounts.google.com/gsi/client`) — 최소 타입.
 * Kakao OAuth — 최소 타입.
 * @see https://developers.google.com/identity/gsi/web/reference/js-reference
 * @see https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#login-response
 */

/**
 * GIS `TokenClient.requestAccessToken` → `error_callback`의 `type` 값.
 * OAuth `error` 코드(access_denied 등)와는 별도 채널이다.
 *
 * @see https://developers.google.com/identity/gsi/web/reference/js-reference — `error_callback`
 */
export type GoogleErrorCallbackType = 'popup_failed_to_open' | 'popup_closed' | 'unknown';

/**
 * GIS `error_callback` 인자 — `type`은 {@link GoogleErrorCallbackType}만 온다.
 */
interface GoogleTokenClientError {
  type: GoogleErrorCallbackType;
  /** 에러에 대한 상세 설명 (선택) */
  message?: string;
  /** 스택 트레이스 (선택) */
  stack?: string;
}

/**
 * 토큰 엔드포인트 성공 시 — `access_token` 포함.
 * @value access_token: 액세스 토큰
 * @value expires_in: 토큰 만료 시간 (초)
 * @value hd: 헤더
 * @value prompt: 프롬프트
 * @value token_type: 토큰 타장
 * @value scope: 권한 범위
 * @see https://developers.google.com/identity/protocols/oauth2/web-server#response
 */
export interface GoogleTokenResponseSuccess {
  access_token: string;
  expires_in: number;
  hd?: string;
  prompt: string;
  token_type: string;
  scope: string;
}

/**
 * OAuth 2.0 토큰 오류 본문 — 같은 `callback`으로 전달될 수 있음(`access_token` 없음).
 * @see https://www.rfc-editor.org/rfc/rfc6749#section-5.2
 */
export interface GoogleTokenResponseOAuthError {
  error: string;
  error_description?: string;
  error_uri?: string;
}

/**
 * GIS `callback(resp)` — 성공 시 {@link GoogleTokenResponseSuccess}, 실패 시 {@link GoogleTokenResponseOAuthError}.
 * 런타임에서 `'access_token' in resp` vs `'error' in resp` 로 구분.
 */
export type GoogleTokenResponse = GoogleTokenResponseSuccess | GoogleTokenResponseOAuthError;

/**
 * GIS {@link GoogleErrorCallbackType} 외, OAuth `error` 코드·백엔드·앱 휴리스틱 분류용 키.
 * 토스트·쿼리 등 사용자 문구 매핑에 사용 — OAuth 문자열과 혼동하지 말 것.
 */
export type GoogleOAuthUserFacingErrorKind =
  | GoogleErrorCallbackType
  | 'access_denied'
  | 'invalid_grant'
  | 'unauthorized_client'
  | 'invalid_request'
  | 'invalid_client'
  | 'unsupported_grant_type'
  | 'invalid_scope'
  | 'email_already_exists'
  | 'default';

/**
 * GIS `TokenClient.initTokenClient` 인자.
 * @see https://developers.google.com/identity/gsi/web/reference/js-reference — `TokenClient.initTokenClient`
 * @value client_id: 클라이언트 ID
 * @value scope: 권한 범위
 * @value include_granted_scopes: 포함된 권한 범위
 * @value callback: 토큰 응답 콜백
 * @value error_callback: 에러 콜백
 */
interface GoogleTokenClientConfig {
  client_id: string;
  scope: string;
  include_granted_scopes?: boolean;
  callback: (resp: GoogleTokenResponse) => void;
  error_callback?: (err: GoogleTokenClientError) => void;
}

/**
 * GIS `TokenClient.requestAccessToken` 인자.
 * @see https://developers.google.com/identity/gsi/web/reference/js-reference — `TokenClient.requestAccessToken`
 * @value prompt: 프롬프트 타입
 * @value login_hint: 로그인 힌트
 * @value state: 상태
 * @value [key: string]: unknown: 추가 인자(혹시 모를 추가 옵션을 위해 인덱스 시그니처를 허용함)
 */
interface GoogleTokenClientOverrideConfig {
  prompt?: 'none' | 'consent' | 'select_account';
  login_hint?: string;
  state?: string;
  [key: string]: unknown;
}

/**
 * Kakao OAuth `error` 코드·백엔드·앱 휴리스틱 분류용 키.
 * @value error: OAuth `error` 코드
 * @value error_description: 에러 설명
 */
interface KakaoError {
  error: string;
  error_description: string;
}

/**
 * Kakao OAuth 응답.
 * @value access_token: 액세스 토큰
 * @value refresh_token: 리프레시 토큰
 * @value token_type: 토큰 타장
 * @value expires_in: 토큰 만료 시간 (초)
 * @value scope: 권한 범위
 * @value refresh_token_expires_in: 리프레시 토큰 만료 시간 (초)
 */
interface KakaoAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

/**
 * Kakao OAuth 로그인 옵션.
 * @value success: 성공 콜백
 * @value fail: 실패 콜백
 * @value always: 항상 콜백
 * @value scope: 권한 범위
 * @value throughTalk: 카카오톡 통과 여부(true: 통과, false: 통과 안 함(default))
 */
interface KakaoLoginOptions {
  success: (auth: KakaoAuthResponse) => void;
  fail: (err: KakaoError) => void;
  always?: () => void;
  scope?: string;
  throughTalk?: boolean;
}

/**
 * Kakao OAuth 인증 옵션.
 * @value redirectUri: 리다이렉트 URI
 * @value state: 상태
 * @value scope: 권한 범위
 * @value throughTalk: 카카오톡 통과 여부(true: 통과, false: 통과 안 함(default))
 * @value prompts: 프롬프트 타입(login: 로그인, none: 로그인 안 함(default), create: 회원가입)
 */
interface KakaoAuthorizeOptions {
  redirectUri: string;
  state?: string;
  scope?: string;
  throughTalk?: boolean;
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
      /** 카카오 초기화 여부 확인 */
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
