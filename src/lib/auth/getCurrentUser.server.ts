import 'server-only';

import type { User } from '@/lib/auth/schemas/user';

import { cache } from 'react';
import { ApiClientError } from '@/lib/apiClient.core';
import { apiClientServer } from '@/lib/apiClient.server';
import { getAccessToken, getRefreshToken } from '@/lib/auth/cookies';
import { parseUserFromBackendUnknown } from '@/lib/auth/schemas/user';

/**
 * RSC / Server Action 등에서 현재 요청의 세션으로 백엔드 `GET /users/me`를 호출해 사용자를 가져온다.
 *
 * **`React.cache`**: 한 번의 서버 렌더(한 요청) 안에서 `getCurrentUser()`를 여러 컴포넌트가 호출해도
 * `fetchCurrentUser` 본문은 한 번만 실행된다. (Next/Data Cache와 무관한 React 레벨 중복 제거)
 *
 * **`fetch`의 `cache: 'no-store'`**: 그 한 번의 실행에서 나가는 HTTP 응답을 **다음 요청**에 재사용하지 않는다.
 * 즉 “크로스 요청 캐시”는 끄고, “이번 요청 안에서의 중복 fetch”만 `React.cache`로 막는다.
 *
 * - 인증 쿠키가 없으면 API를 호출하지 않고 `null`.
 * - 401은 비로그인·만료로 간주하고 `null` (나머지 오류는 그대로 throw).
 * - **`retry: false`**: RSC에서 401 → refresh → `setAuthCookies` 경로는 Next가 허용하지 않음.
 *   access 만료 직후 한 번은 `null`일 수 있음 → 클라이언트 갱신 후 재요청으로 복구.
 */
async function fetchCurrentUser(): Promise<User | null> {
  const access = await getAccessToken();
  const refresh = await getRefreshToken();
  if (!access && !refresh) {
    return null;
  }

  try {
    /** RSC에서는 `cookies().set` 불가 — 401 시 refresh가 `setAuthCookies`를 호출하면 런타임 에러남 */
    const raw = await apiClientServer<unknown>('/users/me', {
      method: 'GET',
      cache: 'no-store',
      retry: false,
    });
    const user = parseUserFromBackendUnknown(raw);
    return user ?? null;
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 401) {
      return null;
    }
    throw e;
  }
}

export const getCurrentUser = cache(fetchCurrentUser);
