/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import {
  forwardToBackend,
  isAllowedOrigin,
  isPublicPath,
  originMatchesAllowedEntry,
  proxy,
} from '@/proxy';

import { APP_URL } from '@/constants/api';

const TEST_APP_URL = APP_URL || 'http://localhost:3000';

/** `getJwtExp`가 읽을 수 있는 형태 — 만료까지 1시간 (갱신 분기 미진입) */
function mockAccessTokenValidLong(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }),
  ).toString('base64url');
  return `h.${payload}.s`;
}

/** access JWT exp가 과거 → isAccessTokenExpired → refresh 분기 */
function mockAccessTokenExpired(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 60 })).toString(
    'base64url',
  );
  return `h.${payload}.s`;
}

describe('proxy', () => {
  describe('isPublicPath', () => {
    it('PUBLIC path: "/", "/login", "/signup", "/com/woo" → true', () => {
      expect(isPublicPath('/')).toBe(true);
      expect(isPublicPath('/login')).toBe(true);
      expect(isPublicPath('/signup')).toBe(true);
      expect(isPublicPath('/com')).toBe(true);
      expect(isPublicPath('/com/woo')).toBe(true);
    });

    it('비공개 path: "/dashboard", "/todos" → false', () => {
      expect(isPublicPath('/dashboard')).toBe(false);
      expect(isPublicPath('/todos')).toBe(false);
      expect(isPublicPath('/settings')).toBe(false);
    });
  });

  describe('proxy()', () => {
    function createRequest(
      pathname: string,
      cookies?: { access?: string; refresh?: string },
    ): NextRequest {
      const url = `${TEST_APP_URL.replace(/\/$/, '')}${pathname}`;
      const headers = new Headers();
      const parts: string[] = [];
      if (cookies?.access) parts.push(`access_token=${cookies.access}`);
      if (cookies?.refresh) parts.push(`refresh_token=${cookies.refresh}`);
      if (parts.length) headers.set('cookie', parts.join('; '));
      return new NextRequest(url, { headers });
    }

    it('PUBLIC path + 토큰 없음 → next()', () => {
      const req = createRequest('/login');
      const res = proxy(req);
      expect(res.status).toBe(200);
    });

    it('/login + access 또는 refresh → redirect (callbackUrl 없으면 /dashboard)', () => {
      const reqAccess = createRequest('/login', { access: 'valid-token' });
      expect(proxy(reqAccess).headers.get('location')).toMatch(/\/dashboard$/);
      expect(proxy(reqAccess).status).toBe(307);

      const reqRefresh = createRequest('/login', { refresh: 'refresh-only' });
      expect(proxy(reqRefresh).headers.get('location')).toMatch(/\/dashboard$/);
      expect(proxy(reqRefresh).status).toBe(307);
    });

    it('/login + 세션 + callbackUrl(안전) → 해당 경로로 redirect', () => {
      const req = createRequest(
        `/login?${new URLSearchParams({ callbackUrl: '/profile' }).toString()}`,
        { access: 'valid-token' },
      );
      const res = proxy(req);
      expect(res.headers.get('location')).toMatch(/\/profile$/);
      expect(res.status).toBe(307);
    });

    it('/login + 세션 + ?error= → OAuth 실패 처리용으로 next() (리다이렉트 안 함)', () => {
      const req = createRequest('/login?error=access_denied', { access: 'valid-token' });
      const res = proxy(req);
      expect(res.status).toBe(200);
    });

    it('/signup + 세션 → /dashboard로 redirect', () => {
      const req = createRequest('/signup', { access: 'valid-token' });
      const res = proxy(req);
      expect(res.headers.get('location')).toMatch(/\/dashboard$/);
      expect(res.status).toBe(307);
    });

    it('루트 "/" + access 또는 refresh 있음 → redirect /dashboard', () => {
      const reqAccess = createRequest('/', { access: 'valid-token' });
      expect(proxy(reqAccess).headers.get('location')).toMatch(/\/dashboard$/);
      expect(proxy(reqAccess).status).toBe(307);

      const reqRefresh = createRequest('/', { refresh: 'refresh-only' });
      expect(proxy(reqRefresh).headers.get('location')).toMatch(/\/dashboard$/);
      expect(proxy(reqRefresh).status).toBe(307);
    });

    it('루트 "/" + 토큰 없음 → next()', () => {
      const req = createRequest('/');
      const res = proxy(req);
      expect(res.status).toBe(200);
    });

    it('비공개 path + 토큰 없음 → redirect /login + callbackUrl', () => {
      const prev = process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED;
      process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED = 'true';
      const req = createRequest('/dashboard');
      const res = proxy(req);
      expect(res.status).toBe(307);
      const loc = res.headers.get('location');
      expect(loc).toContain('/login');
      expect(loc).toContain('callbackUrl=%2Fdashboard');
      process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED = prev;
    });

    it('비공개 path + access 없음 + refresh 있음 → next() (세션 복구 가능)', () => {
      const prev = process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED;
      process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED = 'true';
      const req = createRequest('/dashboard', { refresh: 'refresh-only' });
      const res = proxy(req);
      expect(res.status).toBe(200);
      process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED = prev;
    });

    it('비공개 path + 토큰 없음 + guard OFF → next()', () => {
      const prev = process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED;
      process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED = 'false';
      const req = createRequest('/dashboard');
      const res = proxy(req);
      expect(res.status).toBe(200);
      process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED = prev;
    });

    it('비공개 path + 토큰 있음 → next()', () => {
      const req = createRequest('/dashboard', { access: 'valid-token' });
      const res = proxy(req);
      expect(res.status).toBe(200);
    });
  });

  describe('originMatchesAllowedEntry', () => {
    it('리터럴 origin 일치', () => {
      expect(originMatchesAllowedEntry('https://example.com', 'https://example.com')).toBe(true);
    });

    it('리터럴 불일치', () => {
      expect(originMatchesAllowedEntry('https://example.com', 'https://other.com')).toBe(false);
    });

    it('https://*.ngrok-free.app → 실제 ngrok 호스트 일치', () => {
      expect(
        originMatchesAllowedEntry('https://*.ngrok-free.app', 'https://abc123.ngrok-free.app'),
      ).toBe(true);
    });

    it('ngrok 패턴 — 외부 도메인 거부', () => {
      expect(originMatchesAllowedEntry('https://*.ngrok-free.app', 'https://evil.com')).toBe(false);
    });
  });

  describe('isAllowedOrigin', () => {
    it('origin 없음, referer 없음 → true', () => {
      const req = new Request(`${TEST_APP_URL}/api/proxy/todos`, {
        method: 'GET',
      });
      expect(isAllowedOrigin(req)).toBe(true);
    });

    it('origin이 targetOrigin과 동일 → true', () => {
      const req = new Request(`${TEST_APP_URL}/api/proxy/todos`, {
        method: 'GET',
        headers: { origin: TEST_APP_URL },
      });
      expect(isAllowedOrigin(req)).toBe(true);
    });

    it('origin이 ALLOWED_ORIGINS에 있음 → true', () => {
      // targetOrigin과 origin 동일 시 항상 true (동일 출처)
      const req = new Request(`${TEST_APP_URL}/api/proxy/todos`, {
        method: 'GET',
        headers: { origin: TEST_APP_URL },
      });
      expect(isAllowedOrigin(req)).toBe(true);
    });

    it('origin이 화이트리스트 외부 → false', () => {
      const origEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true });
      jest.resetModules();
      const req = new Request(`${TEST_APP_URL}/api/proxy/todos`, {
        method: 'GET',
        headers: { origin: 'https://evil.com' },
      });
      expect(isAllowedOrigin(req)).toBe(false);
      Object.defineProperty(process.env, 'NODE_ENV', { value: origEnv, writable: true });
      jest.resetModules();
    });
  });

  describe('forwardToBackend', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
      globalThis.fetch = jest.fn();
    });
    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('Origin 허용 안 됨 → 403', async () => {
      const origEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true });
      jest.resetModules();
      const req = new Request(`${TEST_APP_URL}/api/proxy/todos`, {
        method: 'GET',
        headers: { origin: 'https://evil.com' },
      });
      const res = await forwardToBackend(req, 'todos');
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.message).toBe('허용된 출처가 아닙니다.');
      Object.defineProperty(process.env, 'NODE_ENV', { value: origEnv, writable: true });
      jest.resetModules();
    });

    it('정상 요청 → 백엔드 URL로 fetch, Authorization 주입', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue(
        new Response(JSON.stringify({ data: [] }), { status: 200 }),
      );
      const { cookies } = await import('next/headers');
      const mockCookies = await cookies();
      (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
        name === 'access_token' ? { value: mockAccessTokenValidLong() } : undefined,
      );

      const req = new Request(`${TEST_APP_URL}/api/proxy/todos`, {
        method: 'GET',
      });
      const res = await forwardToBackend(req, 'todos');

      expect(res.status).toBe(200);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
        }),
      );
      const fetchOpts = (globalThis.fetch as jest.Mock).mock.calls[0][1] as RequestInit;
      const upstreamHeaders = fetchOpts.headers as Headers;
      expect(upstreamHeaders.get('Accept-Encoding')).toBe('identity');
    });

    it('클라이언트가 gzip을 요청해도 백엔드로는 Accept-Encoding: identity', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue(
        new Response(JSON.stringify({ data: [] }), { status: 200 }),
      );
      const { cookies } = await import('next/headers');
      const mockCookies = await cookies();
      (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
        name === 'access_token' ? { value: mockAccessTokenValidLong() } : undefined,
      );

      const req = new Request(`${TEST_APP_URL}/api/proxy/posts`, {
        method: 'GET',
        headers: { 'Accept-Encoding': 'gzip, deflate, br' },
      });
      await forwardToBackend(req, 'posts');

      const fetchOpts = (globalThis.fetch as jest.Mock).mock.calls[0][1] as RequestInit;
      const upstreamHeaders = fetchOpts.headers as Headers;
      expect(upstreamHeaders.get('Accept-Encoding')).toBe('identity');
    });

    it('원 요청 쿼리스트링이 백엔드 fetch URL에 포함됨', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue(
        new Response(JSON.stringify({ data: [] }), { status: 200 }),
      );
      const { cookies } = await import('next/headers');
      const mockCookies = await cookies();
      (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
        name === 'access_token' ? { value: mockAccessTokenValidLong() } : undefined,
      );

      const req = new Request(`${TEST_APP_URL}/api/proxy/todos?page=1&sort=desc`, {
        method: 'GET',
      });
      await forwardToBackend(req, 'todos');

      const calledUrl = (globalThis.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(calledUrl).toContain('/todos?page=1');
      expect(calledUrl).toContain('sort=desc');
    });

    it('바디 있음(multipart 등) → upstream fetch에 Uint8Array 복사본(Edge 호환·duplex 미사용)', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );
      const { cookies } = await import('next/headers');
      const mockCookies = await cookies();
      (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
        name === 'access_token' ? { value: mockAccessTokenValidLong() } : undefined,
      );

      const fd = new FormData();
      fd.append('file', new Blob(['x'], { type: 'text/plain' }), 'a.txt');
      const req = new Request(`${TEST_APP_URL}/api/proxy/upload`, {
        method: 'POST',
        body: fd,
      });
      await forwardToBackend(req, 'upload');

      const fetchOpts = (globalThis.fetch as jest.Mock).mock.calls[0][1] as RequestInit & {
        duplex?: string;
      };
      expect(fetchOpts.duplex).toBeUndefined();
      expect(fetchOpts.body).toBeInstanceOf(Uint8Array);
      expect(fetchOpts.body).not.toBeUndefined();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/upload'),
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });

    it('POST /goals — JSON 바디(title)가 업스트림으로 전달되고 Authorization·identity 적용', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue(
        new Response(JSON.stringify({ id: '1', title: '프로젝트 완성' }), { status: 201 }),
      );
      const { cookies } = await import('next/headers');
      const mockCookies = await cookies();
      (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
        name === 'access_token' ? { value: mockAccessTokenValidLong() } : undefined,
      );

      const payload = { title: '프로젝트 완성' };
      const req = new Request(`${TEST_APP_URL}/api/proxy/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await forwardToBackend(req, 'goals');

      expect(res.status).toBe(201);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/goals$/),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(Uint8Array),
        }),
      );

      const fetchOpts = (globalThis.fetch as jest.Mock).mock.calls[0][1] as RequestInit & {
        duplex?: string;
      };
      expect(fetchOpts.duplex).toBeUndefined();
      const upstreamHeaders = fetchOpts.headers as Headers;
      expect(upstreamHeaders.get('Accept-Encoding')).toBe('identity');
      expect(upstreamHeaders.get('Authorization')).toMatch(/^Bearer /);

      const u8 = fetchOpts.body as Uint8Array;
      expect(u8).toBeDefined();
      const forwardedJson = JSON.parse(new TextDecoder().decode(u8));
      expect(forwardedJson).toEqual(payload);
    });

    it('access 만료 + refresh 실패 시 401, 업스트림 API fetch 없음', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 401 }));

      const { cookies } = await import('next/headers');
      const mockCookies = await cookies();
      (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
        name === 'refresh_token'
          ? { value: 'rt' }
          : name === 'access_token'
            ? { value: mockAccessTokenExpired() }
            : undefined,
      );

      const req = new Request(`${TEST_APP_URL}/api/proxy/todos`, { method: 'GET' });
      const res = await forwardToBackend(req, 'todos');

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect((globalThis.fetch as jest.Mock).mock.calls[0][0]).toContain('/auth/refresh');
    });

    it('access 아직 유효(만료 아님) → /auth/refresh 호출 없이 업스트림만', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue(
        new Response(JSON.stringify({ data: [] }), { status: 200 }),
      );
      const { cookies } = await import('next/headers');
      const mockCookies = await cookies();
      (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
        name === 'refresh_token'
          ? { value: 'rt' }
          : name === 'access_token'
            ? { value: mockAccessTokenValidLong() }
            : undefined,
      );

      const req = new Request(`${TEST_APP_URL}/api/proxy/todos`, { method: 'GET' });
      await forwardToBackend(req, 'todos');

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect((globalThis.fetch as jest.Mock).mock.calls[0][0]).toContain('/todos');
    });
  });
});
