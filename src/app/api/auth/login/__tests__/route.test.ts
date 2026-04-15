/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/login/route';
import { setAuthCookies } from '@/lib/auth/cookies';
import {
  LOGIN_BACKEND_INVALID_CREDENTIALS_MESSAGE,
  LOGIN_FAILURE_USER_MESSAGE_INVALID_CREDENTIALS,
} from '@/lib/auth/schemas/login';

import { API_URL, TEAM_ID } from '@/constants/api';
import { AUTH_CONFIG } from '@/constants/auth-config';

jest.mock('@/lib/auth/cookies', () => {
  const actual = jest.requireActual<typeof import('@/lib/auth/cookies')>('@/lib/auth/cookies');
  return {
    ...actual,
    setAuthCookies: jest.fn().mockResolvedValue(undefined),
  };
});

const mockSetAuthCookies = setAuthCookies as jest.MockedFunction<typeof setAuthCookies>;

function loginRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/auth/login', () => {
  const originalFetch = globalThis.fetch;
  const originalApiUrl = process.env.API_URL;
  const originalTeamId = process.env.TEAM_ID;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
    mockSetAuthCookies.mockClear();
    process.env.API_URL = API_URL || '';
    process.env.TEAM_ID = TEAM_ID || '';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalApiUrl === undefined) delete process.env.API_URL;
    else process.env.API_URL = originalApiUrl;
    if (originalTeamId === undefined) delete process.env.TEAM_ID;
    else process.env.TEAM_ID = originalTeamId;
  });

  it('본문이 유효한 JSON이 아니면 400', async () => {
    const req = loginRequest('not-json{');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('잘못된 요청');
  });

  it('Zod 검증 실패 시 400', async () => {
    const req = loginRequest({ email: 'bad', password: 'short' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(typeof json.message).toBe('string');
  });

  it('백엔드 401 + Invalid email or password → 메시지 매핑', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ message: LOGIN_BACKEND_INVALID_CREDENTIALS_MESSAGE }), {
        status: 401,
      }),
    );

    const req = loginRequest({ email: 'a@b.com', password: 'password12' });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe(LOGIN_FAILURE_USER_MESSAGE_INVALID_CREDENTIALS);
    expect(mockSetAuthCookies).not.toHaveBeenCalled();
  });

  it('백엔드 !ok + 알 수 없는 메시지 → 그대로 전달', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ message: 'Custom error' }), { status: 403 }),
    );

    const req = loginRequest({ email: 'a@b.com', password: 'password12' });
    const res = await POST(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.message).toBe('Custom error');
  });

  it('백엔드 409(이메일 중복 등) → BFF도 409', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ message: '이미 가입된 이메일입니다.' }), { status: 409 }),
    );

    const req = loginRequest({ email: 'a@b.com', password: 'password12' });
    const res = await POST(req);
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('이미 가입된 이메일입니다.');
  });

  it('백엔드 400 + 중복 메시지 → BFF는 409로 통일', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ message: '이미 가입된 이메일입니다.' }), { status: 400 }),
    );

    const req = loginRequest({ email: 'a@b.com', password: 'password12' });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });

  it('백엔드 !ok + JSON 파싱 실패 → 기본 로그인 실패 메시지', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(new Response('plain', { status: 500 }));

    const req = loginRequest({ email: 'a@b.com', password: 'password12' });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe('로그인 실패');
  });

  it('백엔드 200 + 토큰 쌍 → 200, setAuthCookies 호출', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(
        JSON.stringify({
          [AUTH_CONFIG.ACCESS_TOKEN_KEY]: 'access',
          [AUTH_CONFIG.REFRESH_TOKEN_KEY]: 'refresh',
        }),
        { status: 200 },
      ),
    );

    const req = loginRequest({ email: 'a@b.com', password: 'password12' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(mockSetAuthCookies).toHaveBeenCalledWith('access', 'refresh', 'password');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'a@b.com', password: 'password12' }),
      }),
    );
  });

  it('백엔드 200 + user 포함 → 응답에 user 포함', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(
        JSON.stringify({
          [AUTH_CONFIG.ACCESS_TOKEN_KEY]: 'access',
          [AUTH_CONFIG.REFRESH_TOKEN_KEY]: 'refresh',
          user: { id: 'u1', email: 'a@b.com', name: 'N' },
        }),
        { status: 200 },
      ),
    );

    const req = loginRequest({ email: 'a@b.com', password: 'password12' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.user).toMatchObject({ id: 'u1', email: 'a@b.com', name: 'N' });
  });

  it('백엔드 200인데 토큰 쌍 없음 → 502 계약 위반', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    const req = loginRequest({ email: 'a@b.com', password: 'password12' });
    const res = await POST(req);
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain(AUTH_CONFIG.ACCESS_TOKEN_KEY);
    expect(mockSetAuthCookies).not.toHaveBeenCalled();
  });

  it('fetch 네트워크 실패 → 502', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(new Error('ECONNREFUSED'));

    const req = loginRequest({ email: 'a@b.com', password: 'password12' });
    const res = await POST(req);
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('인증 서버');
  });
});
