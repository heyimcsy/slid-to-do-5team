import type { User } from '@/lib/auth/schemas/user';

import { parseUserFromBackendUnknown } from '@/lib/auth/schemas/user';

import { AUTH_CONFIG } from '@/constants/auth-config';

type BackendUserLike = Partial<User> & Record<string, unknown>;

/**
 * 백엔드 auth 응답(로그인/리프레시)에서 기대하는 최소 계약.
 * - 토큰 키는 snake/camel 대체 키를 모두 허용
 * - user는 앱 User 스키마 기반의 부분집합 + 백엔드 확장 필드 허용
 */
export type TokenPairBackendResponse = {
  [AUTH_CONFIG.ACCESS_TOKEN_KEY]?: string;
  [AUTH_CONFIG.ACCESS_TOKEN_JSON_ALTERNATE]?: string;
  [AUTH_CONFIG.REFRESH_TOKEN_KEY]?: string;
  [AUTH_CONFIG.REFRESH_TOKEN_JSON_ALTERNATE]?: string;
  [AUTH_CONFIG.USER_OBJECT_KEY]?: BackendUserLike;
  [AUTH_CONFIG.USER_OBJECT_JSON_ALTERNATE]?: BackendUserLike;
} & Record<string, unknown>;

/**
 * 백엔드 login/refresh JSON에서 토큰 쌍을 읽는다.
 * 스네이크(`AUTH_CONFIG.*_KEY`) 우선, camelCase(`*_JSON_ALTERNATE`) 대체.
 */
export function parseTokenPairFromBackendJson(data: TokenPairBackendResponse): {
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

function pickUserObject(data: TokenPairBackendResponse): unknown {
  const primary = data[AUTH_CONFIG.USER_OBJECT_KEY];
  const alternate = data[AUTH_CONFIG.USER_OBJECT_JSON_ALTERNATE];
  const v = primary !== undefined && primary !== null ? primary : alternate;
  if (v !== null && typeof v === 'object' && !Array.isArray(v)) return v;
  return undefined;
}

function pickString(data: TokenPairBackendResponse, key: string): string | undefined {
  const v = data[key];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}
