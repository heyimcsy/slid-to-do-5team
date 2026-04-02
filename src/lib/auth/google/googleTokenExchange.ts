import 'server-only';

import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

import { AUTH_CONFIG } from '@/constants/auth-config';
import {
  GOOGLE_CLIENT_ID_UNSET_MESSAGE_KO,
  GOOGLE_CLIENT_SECRET_UNSET_MESSAGE_KO,
  GOOGLE_TOKEN_EXCHANGE_FAILED_MESSAGE_KO,
  TOKEN_RESPONSE_INVALID_TYPE_MESSAGE_KO,
  TOKEN_RESPONSE_MISSING_ACCESS_TOKEN_MESSAGE_KO,
} from '@/constants/error-message';

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
    throw new Error(GOOGLE_CLIENT_ID_UNSET_MESSAGE_KO);
  }
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientSecret) {
    throw new Error(GOOGLE_CLIENT_SECRET_UNSET_MESSAGE_KO);
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
  });

  const res = await fetchWithTimeout(
    GOOGLE_TOKEN_URL,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    },
    AUTH_CONFIG.REFRESH_FETCH_TIMEOUT_MS,
  );

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`${GOOGLE_TOKEN_EXCHANGE_FAILED_MESSAGE_KO} (${res.status}): ${raw}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw) as { access_token?: string };
  } catch {
    throw new Error(TOKEN_RESPONSE_INVALID_TYPE_MESSAGE_KO);
  }
  const access_token =
    data && typeof data === 'object' && 'access_token' in data
      ? (data as { access_token?: string }).access_token
      : undefined;
  if (!access_token) {
    throw new Error(TOKEN_RESPONSE_MISSING_ACCESS_TOKEN_MESSAGE_KO);
  }
  return { access_token };
}
