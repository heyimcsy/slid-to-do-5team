/**
 * @jest-environment node
 */
import { POST } from '@/app/api/auth/refresh/route';

import { API_URL, TEAM_ID } from '@/constants/api';
import { AUTH_CONFIG } from '@/constants/auth-config';

describe('POST /api/auth/refresh', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.API_URL = API_URL || '';
    process.env.TEAM_ID = TEAM_ID || '';
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('refreshToken 없음 → 401', async () => {
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockReturnValue(undefined);

    const res = await POST();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe('리프레시 토큰이 없습니다.');
  });

  it('refreshToken 있음 + 백엔드 OK → 200, setAuthCookies 호출', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ accessToken: 'new-access', refreshToken: 'new-refresh' }), {
        status: 200,
      }),
    );
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === 'refresh_token' ? { value: 'valid-refresh' } : undefined,
    );

    const res = await POST();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ [AUTH_CONFIG.REFRESH_TOKEN_KEY]: 'valid-refresh' }),
      }),
    );
    expect(mockCookies.set).toHaveBeenCalled();
  });

  it('백엔드 401 → 401 응답', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({}), { status: 401 }),
    );
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === 'refresh_token' ? { value: 'invalid-refresh' } : undefined,
    );

    const res = await POST();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toBe('토큰 갱신 실패');
  });

  it('fetch 네트워크 실패 → 502', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('ECONNREFUSED'));
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === 'refresh_token' ? { value: 'valid-refresh' } : undefined,
    );

    const res = await POST();
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('인증 서버');
  });

  it('백엔드 200이나 본문이 유효한 JSON이 아님 → 502', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response('<html>error</html>', { status: 200, headers: { 'Content-Type': 'text/html' } }),
    );
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === 'refresh_token' ? { value: 'valid-refresh' } : undefined,
    );

    const res = await POST();
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('인증 서버');
  });
});
