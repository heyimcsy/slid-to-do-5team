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

/** REFRESH_BUFFER_SECONDS(60) 이내 만료 → 선행 refresh 분기 */
function mockAccessTokenExpiringSoon(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 30 })).toString(
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
    function createRequest(pathname: string, token?: string): NextRequest {
      const url = `${TEST_APP_URL.replace(/\/$/, '')}${pathname}`;
      const headers = new Headers();
      if (token) {
        headers.set('cookie', `access_token=${token}`);
      }
      return new NextRequest(url, { headers });
    }

    it('PUBLIC path + 토큰 없음 → next()', () => {
      const req = createRequest('/login', undefined);
      const res = proxy(req);
      expect(res.status).toBe(200);
    });

    it('비공개 path + 토큰 없음 → redirect /login', () => {
      const prev = process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED;
      process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED = 'true';
      const req = createRequest('/dashboard', undefined);
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/login');
      process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED = prev;
    });

    it('비공개 path + 토큰 없음 + guard OFF → next()', () => {
      const prev = process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED;
      process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED = 'false';
      const req = createRequest('/dashboard', undefined);
      const res = proxy(req);
      expect(res.status).toBe(200);
      process.env.NEXT_PUBLIC_AUTH_ROUTE_GUARD_ENABLED = prev;
    });

    it('비공개 path + 토큰 있음 → next()', () => {
      const req = createRequest('/dashboard', 'valid-token');
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
    const originalFetch = global.fetch;

    beforeEach(() => {
      global.fetch = jest.fn();
    });
    afterEach(() => {
      global.fetch = originalFetch;
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
      (global.fetch as jest.Mock).mockResolvedValue(
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
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
        }),
      );
    });

    it('원 요청 쿼리스트링이 백엔드 fetch URL에 포함됨', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
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

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(calledUrl).toContain('/todos?page=1');
      expect(calledUrl).toContain('sort=desc');
    });

    it('바디 있음(multipart 등) → upstream fetch에 duplex: half 전달', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(
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

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/upload'),
        expect.objectContaining({
          method: 'POST',
          duplex: 'half',
          body: expect.anything(),
        }),
      );
    });

    it('만료 임박 + refresh 실패 시 401, 백엔드 업스트림 fetch 없음', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 401 }));

      const { cookies } = await import('next/headers');
      const mockCookies = await cookies();
      (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
        name === 'refresh_token'
          ? { value: 'rt' }
          : name === 'access_token'
            ? { value: mockAccessTokenExpiringSoon() }
            : undefined,
      );

      const req = new Request(`${TEST_APP_URL}/api/proxy/todos`, { method: 'GET' });
      const res = await forwardToBackend(req, 'todos');

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain('/auth/refresh');
    });
  });
});
