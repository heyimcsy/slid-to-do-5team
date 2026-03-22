import { AUTH_CONFIG } from '@/constants/api';

/**
 * 백엔드 login/refresh JSON에서 토큰 쌍을 읽는다.
 * 스네이크(`AUTH_CONFIG.*_KEY`) 우선, camelCase(`*_JSON_ALTERNATE`) 대체.
 */
export function parseTokenPairFromBackendJson(data: Record<string, unknown>): {
  accessToken: string | undefined;
  refreshToken: string | undefined;
} {
  const accessToken =
    pickString(data, AUTH_CONFIG.ACCESS_TOKEN_KEY) ??
    pickString(data, AUTH_CONFIG.ACCESS_TOKEN_JSON_ALTERNATE);

  const refreshToken =
    pickString(data, AUTH_CONFIG.REFRESH_TOKEN_KEY) ??
    pickString(data, AUTH_CONFIG.REFRESH_TOKEN_JSON_ALTERNATE);

  return { accessToken, refreshToken };
}

function pickString(data: Record<string, unknown>, key: string): string | undefined {
  const v = data[key];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}
