import { API_BASE_URL, AUTH_CONFIG } from '@/constants/api';
import { setAuthCookies } from '@/lib/auth/cookies';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';
import { NextResponse } from 'next/server';

export async function POST() {
  const { getRefreshToken, isAccessTokenExpiringSoon } = await import('@/lib/auth/cookies');

  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: '리프레시 토큰이 없습니다.' },
      { status: 401 },
    );
  }

  // accessToken이 만료 직전(REFRESH_BUFFER_SECONDS) 일때만 백엔드로 토큰 갱신 요청
  // isAccessTokenExpiringSoon() === false → 200 OK → 토큰 갱신 필요 없음
  // isAccessTokenExpiringSoon() === true → 백엔드 호출 후 새 토큰 교체
  if (!(await isAccessTokenExpiringSoon())) {
    return NextResponse.json({ success: true }); // 아직 유효, 200 OK 반환
  }

  const base = API_BASE_URL?.replace(/\/$/, '') ?? '';
  const response = await fetch(`${base}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [AUTH_CONFIG.REFRESH_TOKEN_KEY]: refreshToken }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const message =
      (errBody as { message?: string }).message ??
      (errBody as { error?: string }).error ??
      '토큰 갱신 실패';
    return NextResponse.json({ success: false, message }, { status: response.status });
  }

  const data = (await response.json()) as Record<string, unknown>;
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    parseTokenPairFromBackendJson(data);

  if (!newAccessToken || !newRefreshToken) {
    return NextResponse.json(
      {
        success: false,
        message: `토큰 응답 형식 오류 (${AUTH_CONFIG.ACCESS_TOKEN_KEY}/${AUTH_CONFIG.REFRESH_TOKEN_KEY} 또는 camelCase 대체 키 누락)`,
      },
      { status: 502 },
    );
  }

  await setAuthCookies(newAccessToken, newRefreshToken);

  return NextResponse.json({ success: true });
}
