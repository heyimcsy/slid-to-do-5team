import type { User } from '@/lib/auth/schemas/user';

import { parseUserFromBackendUnknown } from '@/lib/auth/schemas/user';

import { AUTH_CONFIG } from '@/constants/auth-config';

/**
 * 백엔드 login/refresh JSON에서 토큰 쌍을 읽는다.
 * 스네이크(`AUTH_CONFIG.*_KEY`) 우선, camelCase(`*_JSON_ALTERNATE`) 대체.
 */
export function parseTokenPairFromBackendJson(data: Record<string, unknown>): {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  user: User | undefined;
} {
  const accessToken =
    pickString(data, AUTH_CONFIG.ACCESS_TOKEN_KEY) ??
    pickString(data, AUTH_CONFIG.ACCESS_TOKEN_JSON_ALTERNATE);

  const refreshToken =
    pickString(data, AUTH_CONFIG.REFRESH_TOKEN_KEY) ??
    pickString(data, AUTH_CONFIG.REFRESH_TOKEN_JSON_ALTERNATE);

  const userRaw = pickUserObject(data);
  const user = userRaw ? parseUserFromBackendUnknown(userRaw) : undefined;

  return { accessToken, refreshToken, user };
}

function pickUserObject(data: Record<string, unknown>): unknown {
  const primary = data[AUTH_CONFIG.USER_OBJECT_KEY];
  const alternate = data[AUTH_CONFIG.USER_OBJECT_JSON_ALTERNATE];
  const v = primary !== undefined && primary !== null ? primary : alternate;
  if (v !== null && typeof v === 'object' && !Array.isArray(v)) return v;
  return undefined;
}

function pickString(data: Record<string, unknown>, key: string): string | undefined {
  const v = data[key];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}
