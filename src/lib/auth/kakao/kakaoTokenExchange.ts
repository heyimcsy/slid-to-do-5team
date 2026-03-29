import 'server-only';

const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';

/**
 * Authorization Code → 카카오 액세스 토큰
 * @see https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
 */
export async function exchangeKakaoAuthorizationCode(
  code: string,
  redirectUri: string,
): Promise<{ access_token: string }> {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID?.trim();
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_KAKAO_CLIENT_ID가 설정되지 않았습니다.');
  }
  const clientSecret = process.env.KAKAO_CLIENT_SECRET?.trim();

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
  });
  if (clientSecret) {
    body.set('client_secret', clientSecret);
  }

  const res = await fetch(KAKAO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: body.toString(),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`카카오 토큰 교환 실패 (${res.status}): ${raw}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw) as { access_token?: string };
  } catch {
    throw new Error('카카오 토큰 응답이 JSON이 아닙니다.');
  }
  const access_token =
    data && typeof data === 'object' && 'access_token' in data
      ? (data as { access_token?: string }).access_token
      : undefined;
  if (!access_token) {
    throw new Error('카카오 응답에 access_token이 없습니다.');
  }
  return { access_token };
}
