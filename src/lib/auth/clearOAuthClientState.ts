import {
  STORAGE_OAUTH_GOOGLE_RETURN_PATH,
  STORAGE_OAUTH_GOOGLE_STATE,
  STORAGE_OAUTH_KAKAO_RETURN_PATH,
  STORAGE_OAUTH_KAKAO_STATE,
} from '@/lib/auth/oauth-urls';

const EXPIRE_COOKIE_ATTRS = 'Path=/; Max-Age=0; SameSite=Lax';

/**
 * 로그아웃 시 OAuth 진행 중 남은 **클라이언트** 상태 제거.
 * - 예전 구현·수동 테스트로 남은 `sessionStorage` 키
 * - `signInWithKakao` 또는 `signInWithGoogle`가 심는 짧은 수명 **비 HttpOnly** 쿠키
 *   (`oauth_kakao_state`, `oauth_kakao_return_path`) 또는 (`oauth_google_state`, `oauth_google_return_path`)
 * HttpOnly `oauth_user_flash`는 `POST /api/auth/logout` 응답에서 서버가 삭제한다.
 */
export function clearOAuthClientState(oauthType: 'kakao' | 'google'): void {
  if (typeof window === 'undefined') return;
  const oauthState = oauthType === 'kakao' ? STORAGE_OAUTH_KAKAO_STATE : STORAGE_OAUTH_GOOGLE_STATE;
  const oauthReturnPath =
    oauthType === 'kakao' ? STORAGE_OAUTH_KAKAO_RETURN_PATH : STORAGE_OAUTH_GOOGLE_RETURN_PATH;
  try {
    sessionStorage.removeItem(oauthState);
    sessionStorage.removeItem(oauthReturnPath);
  } catch {
    // 저장소 비허용·사파리 프라이빗 등
  }
  try {
    document.cookie = `${oauthState}=; ${EXPIRE_COOKIE_ATTRS}`;
    document.cookie = `${oauthReturnPath}=; ${EXPIRE_COOKIE_ATTRS}`;
  } catch {
    // ignore
  }
}
