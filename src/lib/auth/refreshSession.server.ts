/**
 * @file 서버 전용 access/refresh 갱신.
 *
 * 백엔드 토큰 엔드포인트 호출과 HttpOnly 쿠키 반영을 분리해, 동시 요청이
 * 같은 백엔드 응답을 공유해도 각 요청 컨텍스트에 `Set-Cookie`가 적용되도록 한다.
 */
import 'server-only';

import type { User } from '@/lib/auth/schemas/user';

import { getRefreshToken, setAuthCookies } from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

import { API_BASE_URL } from '@/constants/api';
import { AUTH_CONFIG } from '@/constants/auth-config';
import {
  REFRESH_SESSION_BACKEND_REJECTED_FALLBACK_MESSAGE_KO,
  REFRESH_SESSION_REASON,
} from '@/constants/error-message';

export type { RefreshSessionFailureReason } from '@/constants/error-message';

/**
 * 공개 API `refreshSessionWithMutex` / `refreshSessionSuccessBoolean`의 결과.
 *
 * - 성공 시 `user`는 백엔드 JSON에 포함된 경우에만 채워짐.
 * - 실패 `reason`별 의미:
 *   - `no_refresh_token`: 요청 쿠키에 refresh 없음.
 *   - `backend_rejected`: 백엔드가 2xx가 아님 (`status`, `message`).
 *   - `network`: fetch 예외(타임아웃·DNS 등).
 *   - `invalid_token_body`: 200이나 파싱된 본문에 access/refresh 토큰 쌍이 없음.
 *
 * @see {@link REFRESH_SESSION_REASON} — discriminant 상수
 */
export type RefreshSessionResult =
  | { ok: true; user?: User }
  | { ok: false; reason: typeof REFRESH_SESSION_REASON.NO_REFRESH_TOKEN }
  | {
      ok: false;
      reason: typeof REFRESH_SESSION_REASON.BACKEND_REJECTED;
      status: number;
      message: string;
    }
  | { ok: false; reason: typeof REFRESH_SESSION_REASON.NETWORK }
  | { ok: false; reason: typeof REFRESH_SESSION_REASON.INVALID_TOKEN_BODY };

/**
 * 백엔드 `POST .../auth/refresh`만 수행한 결과(내부용).
 *
 * **`next/headers`의 `cookies()`를 호출하지 않는다.** 즉 HttpOnly 쿠키 갱신 부작용이 없어,
 * 동시에 여러 요청이 같은 Promise를 `await`해도 “어느 요청의 AsyncLocalStorage에 쓸지”가
 * 한 군데에 고정되지 않는다. 성공 시 토큰 문자열만 넘기고, 실제 `setAuthCookies`는
 * `refreshSessionWithMutex`가 **각 호출 스택**에서 실행한다.
 */
type RefreshBackendResult =
  | { ok: true; accessToken: string; refreshToken: string; user?: User }
  | {
      ok: false;
      reason: typeof REFRESH_SESSION_REASON.BACKEND_REJECTED;
      status: number;
      message: string;
    }
  | { ok: false; reason: typeof REFRESH_SESSION_REASON.NETWORK }
  | { ok: false; reason: typeof REFRESH_SESSION_REASON.INVALID_TOKEN_BODY };

/**
 * refresh 토큰 문자열 → 진행 중인 백엔드 갱신 Promise.
 *
 * - **키**: 해당 요청이 `getRefreshToken()`으로 읽은 값. 서로 다른 세션(다른 refresh)은
 *   서로 다른 엔트리 → 프로세스 전역 단일 Promise로 섞이지 않음.
 * - **값**: `fetchRefreshFromBackend` 한 번의 결과를 공유. 동일 키로 동시에 들어온
 *   요청만 백엔드 HTTP를 합침(중복 refresh 완화).
 * - settle 후 `finally`에서 키 삭제 → 장기 보관·누수 방지.
 */
const refreshInFlightByRefreshToken = new Map<string, Promise<RefreshBackendResult>>();

/**
 * 백엔드에 refresh 토큰을 보내 access/refresh 쌍과 선택적 user를 받는다.
 *
 * @param refreshToken - 요청에서 꺼낸 refresh(이미 `getRefreshToken`으로 검증된 값이 아니라
 *   호출부에서 넘기는 문자열; in-flight 맵 키와 동일해야 공유가 일치함).
 * @returns 성공 시 파싱된 토큰·user, 실패 시 이유 코드. 쿠키는 건드리지 않음.
 */
async function fetchRefreshFromBackend(refreshToken: string): Promise<RefreshBackendResult> {
  const base = API_BASE_URL?.replace(/\/$/, '') ?? '';
  const timeoutMs = AUTH_CONFIG.REFRESH_FETCH_TIMEOUT_MS;

  let data: Record<string, unknown>;
  try {
    const response = await fetchWithTimeout(
      `${base}/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [AUTH_CONFIG.REFRESH_TOKEN_JSON_ALTERNATE]: refreshToken,
        }),
      },
      timeoutMs,
    );

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const message =
        (errBody as { message?: string }).message ??
        (errBody as { error?: string }).error ??
        REFRESH_SESSION_BACKEND_REJECTED_FALLBACK_MESSAGE_KO;
      return {
        ok: false,
        reason: REFRESH_SESSION_REASON.BACKEND_REJECTED,
        status: response.status,
        message,
      };
    }

    data = (await response.json()) as Record<string, unknown>;
  } catch {
    return { ok: false, reason: REFRESH_SESSION_REASON.NETWORK };
  }

  const {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user,
  } = parseTokenPairFromBackendJson(data);

  if (!newAccessToken || !newRefreshToken) {
    return { ok: false, reason: REFRESH_SESSION_REASON.INVALID_TOKEN_BODY };
  }

  return { ok: true, accessToken: newAccessToken, refreshToken: newRefreshToken, user };
}

/**
 * 동일 `refreshToken`에 대해 이미 진행 중인 갱신이 있으면 그 Promise를 재사용하고,
 * 없으면 새로 `fetchRefreshFromBackend`를 시작해 맵에 등록한다.
 *
 * 단일 스레드에서 `get` → 없음 → 생성 → `set` 순으로 처리되므로,
 * 동일 키에 대해 동시에 두 번의 백엔드 fetch가 열리지 않는다(첫 호출이 맵에 올린 뒤
 * 이후 호출은 같은 `Promise`를 await).
 *
 * @param refreshToken - in-flight 분리 및 백엔드 요청 본문에 사용할 refresh.
 */
function getOrCreateInFlightRefresh(refreshToken: string): Promise<RefreshBackendResult> {
  let p = refreshInFlightByRefreshToken.get(refreshToken);
  if (!p) {
    p = fetchRefreshFromBackend(refreshToken).finally(() => {
      refreshInFlightByRefreshToken.delete(refreshToken);
    });
    refreshInFlightByRefreshToken.set(refreshToken, p);
  }
  return p;
}

/**
 * 세션 refresh: 백엔드 토큰 갱신 + (성공 시) 현재 요청의 HttpOnly 쿠키 반영.
 *
 * **In-flight (동시성)**
 * - refresh 문자열당 하나의 진행 중 갱신만 유지한다. 같은 쿠키의 refresh로 동시에
 *   여러 핸들러가 들어오면 백엔드 `POST /auth/refresh`는 한 번만 호출되고,
 *   나머지는 그 결과를 공유한다.
 * - 서로 다른 사용자(다른 refresh 값)는 서로 다른 Promise를 쓰므로 세션이 섞이지 않는다.
 *
 * **쿠키 / 요청 컨텍스트**
 * - 공유되는 것은 **백엔드 응답 데이터**뿐이다. `setAuthCookies`는 이 함수가
 *   resolve되기 직전, **이 `await` 체인을 가진 호출자**의 `cookies()`에 대해 실행된다.
 *   따라서 동시 요청마다 자기 응답에 `Set-Cookie`가 붙는다(첫 요청만 쿠키가 갱신되는
 *   전역 mutex 안티패턴을 피함).
 *
 * @returns {@link RefreshSessionResult} — 성공 시 `ok: true`, 실패 시 `reason`으로 구분.
 */
export async function refreshSessionWithMutex(): Promise<RefreshSessionResult> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return { ok: false, reason: REFRESH_SESSION_REASON.NO_REFRESH_TOKEN };
  }

  const backend = await getOrCreateInFlightRefresh(refreshToken);

  if (!backend.ok) {
    return backend;
  }

  await setAuthCookies(backend.accessToken, backend.refreshToken);
  return { ok: true, user: backend.user };
}

/**
 * `refreshSessionWithMutex`의 성공 여부만 boolean으로 노출.
 *
 * `apiClient.server.ts`에서 `createApiClient`에 넘기는 `refreshTokens` 등, 401 후
 * “한 번 갱신 시도했는가” 판단에 사용. 상세 실패 이유가 필요하면
 * `refreshSessionWithMutex`를 직접 호출한다.
 *
 * @returns 갱신에 성공해 쿠키가 갱신될 수 있는 경우 `true`, 그 외 `false`.
 */
export async function refreshSessionSuccessBoolean(): Promise<boolean> {
  const r = await refreshSessionWithMutex();
  return r.ok;
}
