import 'server-only';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

/**
 * Authorization Code → Google 액세스 토큰
 * @see https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code
 */
export async function exchangeGoogleAuthorizationCode(
  code: string,
  redirectUri: string,
): Promise<{ access_token: string }> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.');
  }
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientSecret) {
    throw new Error('GOOGLE_CLIENT_SECRET이 설정되지 않았습니다.');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
  });

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`Google 토큰 교환 실패 (${res.status}): ${raw}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw) as { access_token?: string };
  } catch {
    throw new Error('Google 토큰 응답이 JSON이 아닙니다.');
  }
  const access_token =
    data && typeof data === 'object' && 'access_token' in data
      ? (data as { access_token?: string }).access_token
      : undefined;
  if (!access_token) {
    throw new Error('Google 응답에 access_token이 없습니다.');
  }
  return { access_token };
}
