import { NextResponse } from 'next/server';
import { isAccessTokenExpired } from '@/lib/auth/cookies';
import { refreshSessionWithMutex } from '@/lib/auth/refreshSession.server';
import { isPublicPath } from '@/lib/navigation/publicPaths';

import { AUTH_CONFIG } from '@/constants/auth-config';
import {
  AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO,
  REFRESH_SESSION_INVALID_TOKEN_BODY_MESSAGE_KO,
  REFRESH_SESSION_NETWORK_MESSAGE_KO,
  REFRESH_SESSION_REASON,
} from '@/constants/error-message';

/**
 * 리프레시 없음:
 * - 액세스만 있음 → 401
 * - 둘 다 없음 + `clientPathname`이 공개 경로(`isPublicPath`) 또는 헤더 없음 → 200 (비로그인 노이즈·불필요 리다이렉트 방지)
 * - 둘 다 없음 + 비공개 경로 → 401 → 클라이언트 `logoutAndRedirect`가 `/login`으로 이동
 */
function missingRefreshResponse(
  accessToken: string | undefined,
  clientPathname: string | null,
): NextResponse {
  if (accessToken) {
    return NextResponse.json(
      { success: false, message: AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO },
      { status: 401 },
    );
  }
  if (clientPathname && !isPublicPath(clientPathname)) {
    return NextResponse.json(
      { success: false, message: AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO },
      { status: 401 },
    );
  }
  return NextResponse.json({ success: true as const });
}

export async function POST(request: Request) {
  const clientPathname = request.headers.get(AUTH_CONFIG.CLIENT_PATHNAME_HEADER);
  const { getRefreshToken, getAccessToken } = await import('@/lib/auth/cookies');

  const refreshToken = await getRefreshToken();
  const accessToken = await getAccessToken();

  if (!refreshToken) {
    return missingRefreshResponse(accessToken, clientPathname);
  }

  // access가 아직 유효하면 백엔드 회전 없이 OK (선제 갱신·만료 임박 갱신 없음)
  if (!(await isAccessTokenExpired())) {
    return NextResponse.json({ success: true });
  }

  const result = await refreshSessionWithMutex();

  if (result.ok) {
    return NextResponse.json(
      result.user ? { success: true as const, user: result.user } : { success: true as const },
    );
  }

  if (result.reason === REFRESH_SESSION_REASON.NETWORK) {
    return NextResponse.json(
      { success: false, message: REFRESH_SESSION_NETWORK_MESSAGE_KO },
      { status: 502 },
    );
  }

  if (result.reason === REFRESH_SESSION_REASON.INVALID_TOKEN_BODY) {
    return NextResponse.json(
      { success: false, message: REFRESH_SESSION_INVALID_TOKEN_BODY_MESSAGE_KO },
      { status: 502 },
    );
  }

  if (result.reason === REFRESH_SESSION_REASON.BACKEND_REJECTED) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: result.status },
    );
  }

  // no_refresh_token — 위에서 refreshToken 있음을 확인했으나 동시성으로 드물게 빈 경우
  return NextResponse.json(
    { success: false, message: AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO },
    { status: 401 },
  );
}
