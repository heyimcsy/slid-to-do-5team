/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/signup/route';
import { setAuthCookies } from '@/lib/auth/cookies';

import { API_URL, TEAM_ID } from '@/constants/api';
import { AUTH_CONFIG } from '@/constants/auth-config';

jest.mock('@/lib/auth/cookies', () => ({
  setAuthCookies: jest.fn().mockResolvedValue(undefined),
}));

const mockSetAuthCookies = setAuthCookies as jest.MockedFunction<typeof setAuthCookies>;

function signupRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const validSignupBody = {
  name: '테스트',
  email: 'new@example.com',
  password: 'password12',
  passwordConfirm: 'password12',
};

describe('POST /api/auth/signup', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
    mockSetAuthCookies.mockClear();
    process.env.API_URL = API_URL || '';
    process.env.TEAM_ID = TEAM_ID || '';
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('본문이 유효한 JSON이 아니면 400', async () => {
    const req = signupRequest('{');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('잘못된 요청');
  });

  it('비밀번호 불일치 시 400', async () => {
    const req = signupRequest({
      ...validSignupBody,
      passwordConfirm: 'otherpassword',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('비밀번호가 일치하지 않습니다.');
  });

  it('백엔드 !ok → 상태·메시지 전달', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ message: '이미 가입된 이메일입니다.' }), { status: 409 }),
    );

    const req = signupRequest(validSignupBody);
    const res = await POST(req);
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe('이미 가입된 이메일입니다.');
  });

  it('백엔드 !ok + message 없음 → 기본 문구', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response('{}', { status: 400 }));

    const req = signupRequest(validSignupBody);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe('회원가입 실패');
  });

  it('백엔드 200 + 토큰 없음(이메일 인증 대기 등) → 200, sessionIssued false', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    const req = signupRequest(validSignupBody);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.sessionIssued).toBe(false);
    expect(json.message).toBe('회원가입이 완료되었습니다. 로그인해 주세요.');
    expect(mockSetAuthCookies).not.toHaveBeenCalled();
  });

  it('백엔드 200 + 토큰 쌍 → 201, setAuthCookies, sessionIssued true', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(
        JSON.stringify({
          [AUTH_CONFIG.ACCESS_TOKEN_KEY]: 'access',
          [AUTH_CONFIG.REFRESH_TOKEN_KEY]: 'refresh',
        }),
        { status: 200 },
      ),
    );

    const req = signupRequest(validSignupBody);
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.sessionIssued).toBe(true);
    expect(json.message).toBe('회원가입이 완료되었습니다.');
    expect(mockSetAuthCookies).toHaveBeenCalledWith('access', 'refresh');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/signup'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: validSignupBody.email,
          name: validSignupBody.name,
          password: validSignupBody.password,
        }),
      }),
    );
  });

  it('토큰 + user → 201에 user 포함', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(
        JSON.stringify({
          [AUTH_CONFIG.ACCESS_TOKEN_KEY]: 'access',
          [AUTH_CONFIG.REFRESH_TOKEN_KEY]: 'refresh',
          user: { id: 'u2', email: 'new@example.com', name: '테스트' },
        }),
        { status: 200 },
      ),
    );

    const req = signupRequest(validSignupBody);
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.user).toMatchObject({ id: 'u2', email: 'new@example.com', name: '테스트' });
  });

  it('fetch 네트워크 실패 → 502', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('ECONNREFUSED'));

    const req = signupRequest(validSignupBody);
    const res = await POST(req);
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toContain('인증 서버');
  });
});
