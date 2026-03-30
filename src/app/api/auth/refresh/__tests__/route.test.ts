/**
 * @jest-environment node
 */
import { POST } from '@/app/api/auth/refresh/route';
import { resetRefreshSessionDedupStateForTests } from '@/lib/auth/refreshSession.server';

import { API_BASE_URL, API_URL, TEAM_ID } from '@/constants/api';
import { AUTH_CONFIG } from '@/constants/auth-config';
import {
  AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO,
  REFRESH_SESSION_BACKEND_REJECTED_FALLBACK_MESSAGE_KO,
} from '@/constants/error-message';

function b64url(obj: object): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

/** exp 미래인 access JWT — isAccessTokenExpired === false */
function createAccessTokenValid(): string {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({ exp, iat: exp - 60 })}.${b64url({ s: 'x' })}`;
}

function postRequest(clientPathname?: string) {
  const headers = new Headers();
  if (clientPathname !== undefined) {
    headers.set(AUTH_CONFIG.CLIENT_PATHNAME_HEADER, clientPathname);
  }
  return new Request(`${API_BASE_URL}/api/auth/refresh`, { method: 'POST', headers });
}

describe('POST /api/auth/refresh', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    resetRefreshSessionDedupStateForTests();
    globalThis.fetch = jest.fn();
    process.env.API_URL = API_URL || '';
    process.env.TEAM_ID = TEAM_ID || '';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('refresh + access 아직 유효 → 백엔드 fetch 없이 200', async () => {
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    const access = createAccessTokenValid();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) => {
      if (name === AUTH_CONFIG.REFRESH_TOKEN_KEY) return { value: 'rt' };
      if (name === AUTH_CONFIG.ACCESS_TOKEN_KEY) return { value: access };
      return undefined;
    });

    const res = await POST(postRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('refreshToken 없음 + accessToken 없음(비로그인) → 200', async () => {
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockReturnValue(undefined);

    const res = await POST(postRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('refreshToken 없음 + accessToken 없음 + 비공개 pathname 헤더 → 401', async () => {
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockReturnValue(undefined);

    const res = await POST(postRequest('/dashboard'));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe(AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO);
  });

  it('refreshToken 없음 + accessToken 있음 → 401', async () => {
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    const access = createAccessTokenValid();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === AUTH_CONFIG.ACCESS_TOKEN_KEY ? { value: access } : undefined,
    );

    const res = await POST(postRequest());
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe(AUTH_MISSING_REFRESH_TOKEN_MESSAGE_KO);
  });

  it('refreshToken 있음 + 백엔드 OK → 200, setAuthCookies 호출', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ accessToken: 'new-access', refreshToken: 'new-refresh' }), {
        status: 200,
      }),
    );
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === 'refresh_token' ? { value: 'valid-refresh' } : undefined,
    );

    const res = await POST(postRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ [AUTH_CONFIG.REFRESH_TOKEN_JSON_ALTERNATE]: 'valid-refresh' }),
      }),
    );
    expect(mockCookies.set).toHaveBeenCalled();
  });

  it('백엔드 응답에 user 포함 시 JSON에 user 반환', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
          user: { id: 'u1', email: 'u@example.com', name: 'User' },
        }),
        { status: 200 },
      ),
    );
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === 'refresh_token' ? { value: 'valid-refresh' } : undefined,
    );

    const res = await POST(postRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.user).toEqual({
      id: 'u1',
      email: 'u@example.com',
      name: 'User',
    });
  });

  it('백엔드 401 → 401 응답', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({}), { status: 401 }),
    );
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === 'refresh_token' ? { value: 'invalid-refresh' } : undefined,
    );

    const res = await POST(postRequest());
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe(REFRESH_SESSION_BACKEND_REJECTED_FALLBACK_MESSAGE_KO);
  });

  it('fetch 네트워크 실패 → 502', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(new Error('ECONNREFUSED'));
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === 'refresh_token' ? { value: 'valid-refresh' } : undefined,
    );

    const res = await POST(postRequest());
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('인증 서버');
  });

  it('백엔드 200이나 본문이 유효한 JSON이 아님 → 502', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response('<html>error</html>', { status: 200, headers: { 'Content-Type': 'text/html' } }),
    );
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === 'refresh_token' ? { value: 'valid-refresh' } : undefined,
    );

    const res = await POST(postRequest());
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('인증 서버');
  });
});
