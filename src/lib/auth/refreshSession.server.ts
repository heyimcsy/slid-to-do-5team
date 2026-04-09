/**
 * @file 서버 전용 access/refresh 갱신.
 *
 * 백엔드 토큰 엔드포인트 호출과 HttpOnly 쿠키 반영을 분리해, 동시 요청이
 * 같은 백엔드 응답을 공유해도 각 요청 컨텍스트에 `Set-Cookie`가 적용되도록 한다.
 */
import 'server-only';

import type { TokenPairBackendResponse } from '@/lib/auth/parseTokenPairFromBackendJson';
import type { User } from '@/lib/auth/schemas/user';

import { ApiClientError } from '@/lib/apiClient';
import { apiClientServer } from '@/lib/apiClient.server';
import { getRefreshToken, setAuthCookies } from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';

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
 *   - `invalid_token_body`: 200이나 `response.json()` 실패 또는 파싱된 본문에 access/refresh 토큰 쌍이 없음.
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

type RefreshBackendSuccess = Extract<RefreshBackendResult, { ok: true }>;

/**
 * refresh 토큰 문자열 → 진행 중인 백엔드 갱신 Promise.
 *
 * - **키**: 해당 요청이 `getRefreshToken()`으로 읽은 값. 서로 다른 세션(다른 refresh)은
 *   서로 다른 엔트리 → 프로세스 전역 단일 Promise로 섞이지 않음.
 * - **값**: `fetchRefreshFromBackend` 한 번의 결과를 공유. 동일 키로 동시에 들어온
 *   요청만 백엔드 HTTP를 합침(중복 refresh 완화).
 * - settle 후 `finally`에서 키 삭제 → in-flight만 정리(성공 분기는 아래 TTL 캐시로 흡수).
 */
const refreshInFlightByRefreshToken = new Map<string, Promise<RefreshBackendResult>>();

/**
 * **성공한** 백엔드 갱신 결과를 old refresh 키로 잠깐 보관.
 *
 * 회전(refresh 재발급) 후 첫 응답의 쿠키가 아직 반영되지 않은 요청이 동일 old refresh로
 * 다시 들어오면, in-flight는 이미 끝나 맵에서 빠져 있어 새 `fetch`가 열리고 백엔드는
 * 이미 소비된 토큰으로 `backend_rejected`를 줄 수 있다. 짧은 TTL 동안은 동일 키로
 * 방금 성공한 결과를 재사용해 그 경쟁을 흡수한다.
 */
const refreshSuccessCacheByOldRefreshToken = new Map<
  string,
  { result: RefreshBackendSuccess; expiresAt: number }
>();

function takeRefreshSuccessCache(refreshToken: string): RefreshBackendSuccess | undefined {
  const row = refreshSuccessCacheByOldRefreshToken.get(refreshToken);
  if (!row) return undefined;
  if (Date.now() >= row.expiresAt) {
    refreshSuccessCacheByOldRefreshToken.delete(refreshToken);
    return undefined;
  }
  return row.result;
}

function putRefreshSuccessCache(refreshToken: string, result: RefreshBackendSuccess): void {
  refreshSuccessCacheByOldRefreshToken.set(refreshToken, {
    result,
    expiresAt: Date.now() + AUTH_CONFIG.REFRESH_SUCCESS_CACHE_TTL_MS,
  });
}

/**
 * 백엔드에 refresh 토큰을 보내 access/refresh 쌍과 선택적 user를 받는다.
 *
 * @param refreshToken - 요청에서 꺼낸 refresh(이미 `getRefreshToken`으로 검증된 값이 아니라
 *   호출부에서 넘기는 문자열; in-flight 맵 키와 동일해야 공유가 일치함).
 * @returns 성공 시 파싱된 토큰·user, 실패 시 이유 코드. 쿠키는 건드리지 않음.
 */
async function fetchRefreshFromBackend(refreshToken: string): Promise<RefreshBackendResult> {
  const timeoutMs = AUTH_CONFIG.REFRESH_FETCH_TIMEOUT_MS;

  let data: TokenPairBackendResponse;
  try {
    data = await apiClientServer<TokenPairBackendResponse>('/auth/refresh', {
      method: 'POST',
      body: {
        [AUTH_CONFIG.REFRESH_TOKEN_JSON_ALTERNATE]: refreshToken,
      },
      retry: false,
      timeoutMs,
      skipSessionExpiredRedirect: true,
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        ok: false,
        reason: REFRESH_SESSION_REASON.BACKEND_REJECTED,
        status: error.status,
        message: error.message || REFRESH_SESSION_BACKEND_REJECTED_FALLBACK_MESSAGE_KO,
      };
    }
    if (isLikelyNetworkError(error)) {
      return { ok: false, reason: REFRESH_SESSION_REASON.NETWORK };
    }
    // apiClient의 2xx JSON 파싱 실패/본문 형식 불일치 등은 본문 계약 위반으로 분류.
    return { ok: false, reason: REFRESH_SESSION_REASON.INVALID_TOKEN_BODY };
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

function isLikelyNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.name === 'AbortError') return true;
  const m = (error.message ?? '').toLowerCase();
  return (
    m.includes('econn') ||
    m.includes('enotfound') ||
    m.includes('etimedout') ||
    m.includes('network') ||
    m.includes('fetch failed') ||
    m.includes('socket') ||
    m.includes('connect')
  );
}

/**
 * 동일 old `refreshToken`에 대해 (1) 직전 성공 캐시가 있으면 즉시 resolve,
 * (2) 진행 중인 갱신이 있으면 그 Promise를 재사용, (3) 아니면 새 `fetchRefreshFromBackend`.
 *
 * 단일 스레드에서 `get` → 없음 → 생성 → `set` 순으로 처리되므로,
 * 동일 키에 대해 동시에 두 번의 백엔드 fetch가 열리지 않는다(첫 호출이 맵에 올린 뒤
 * 이후 호출은 같은 `Promise`를 await).
 *
 * 성공 시 in-flight는 `finally`에서 제거하되, 동일 키로 {@link putRefreshSuccessCache}에
 * 잠깐 넣어 회전 직후 늦게 도착한 요청이 불필요한 두 번째 refresh를 치지 않게 한다.
 *
 * @param refreshToken - in-flight 분리 및 백엔드 요청 본문에 사용할 refresh.
 */
function getOrCreateInFlightRefresh(refreshToken: string): Promise<RefreshBackendResult> {
  const cached = takeRefreshSuccessCache(refreshToken);
  if (cached) {
    return Promise.resolve(cached);
  }

  let p = refreshInFlightByRefreshToken.get(refreshToken);
  if (!p) {
    p = fetchRefreshFromBackend(refreshToken)
      .then((result) => {
        if (result.ok) {
          putRefreshSuccessCache(refreshToken, result);
        }
        return result;
      })
      .finally(() => {
        refreshInFlightByRefreshToken.delete(refreshToken);
      });
    refreshInFlightByRefreshToken.set(refreshToken, p);
  }
  return p;
}

/**
 * 세션 refresh: 백엔드 토큰 갱신 + (성공 시) 현재 요청의 HttpOnly 쿠키 반영.
 *
 * **In-flight + 성공 캐시 (동시성·회전)**
 * - refresh 문자열당 하나의 진행 중 갱신만 유지한다. 같은 쿠키의 refresh로 동시에
 *   여러 핸들러가 들어오면 백엔드 `POST /auth/refresh`는 한 번만 호출되고,
 *   나머지는 그 결과를 공유한다.
 * - 회전 직후 첫 응답이 끝난 뒤에도 동일 old refresh로 들어오는 요청은
 *   `REFRESH_SUCCESS_CACHE_TTL_MS` 동안 메모리에 둔 성공 스냅샷을 재사용해
 *   두 번째 백엔드 refresh(거절)를 피한다.
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

/**
 * 테스트 전용: in-flight·성공 TTL 캐시를 비운다.
 *
 * Jest가 동일 프로세스에서 스위트를 돌릴 때, 이전 테스트가 남긴 old refresh 키로
 * 다음 케이스가 실제 `fetch` 없이 캐시만 타면 기대와 어긋난다.
 */
export function resetRefreshSessionDedupStateForTests(): void {
  refreshInFlightByRefreshToken.clear();
  refreshSuccessCacheByOldRefreshToken.clear();
}
