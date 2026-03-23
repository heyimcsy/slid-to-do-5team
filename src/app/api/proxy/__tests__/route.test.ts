/**
 * @jest-environment node
 */
import { API_URL, APP_URL, TEAM_ID } from '@/constants/api';

/** `jest.resetModules()` 후 정적 import 값은 갱신되지 않으므로, 동적 import로 읽은 값만 사용 */
const getRouteHandlers = () => import('@/app/api/proxy/[...path]/route');

describe('GET /api/proxy/[...path]', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
    // 앱 origin 고정(테스트 출처와 겹치면 isAllowedOrigin이 통과함)
    Object.defineProperty(process.env, 'APP_URL', {
      value: 'https://app.example.com',
      writable: true,
    });
    Object.defineProperty(process.env, 'API_URL', {
      value: API_URL ?? 'https://api.example.com',
      writable: true,
    });
    Object.defineProperty(process.env, 'TEAM_ID', { value: TEAM_ID ?? 'team5', writable: true });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('Origin 허용 안 됨 → 403', async () => {
    const origEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true });
    jest.resetModules();

    const { GET } = await getRouteHandlers();
    const { APP_URL: appUrl } = await import('@/constants/api');

    // 요청 URL origin(app.example.com) ≠ referer origin(다른 호스트) → 403
    const req = new Request(`${appUrl}/api/proxy/todos`, {
      method: 'GET',
      headers: { referer: 'https://example.org' },
    });
    const res = await GET(req, { params: Promise.resolve({ path: ['todos'] }) });
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
      name === 'access_token' ? { value: 'token123' } : undefined,
    );

    const { GET } = await getRouteHandlers();
    const { API_BASE_URL } = await import('@/constants/api');

    const req = new Request(`${APP_URL}/api/proxy/todos`, {
      method: 'GET',
    });
    const res = await GET(req, { params: Promise.resolve({ path: ['todos'] }) });

    expect(res.status).toBe(200);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringMatching(`${API_BASE_URL}/todos`),
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers),
      }),
    );
  });

  it('쿼리스트링이 백엔드 fetch URL에 전달됨', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), { status: 200 }),
    );
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) =>
      name === 'access_token' ? { value: 'token123' } : undefined,
    );

    const { GET } = await getRouteHandlers();
    const { APP_URL: appUrl } = await import('@/constants/api');

    const req = new Request(`${appUrl}/api/proxy/todos?page=1&sort=desc`, {
      method: 'GET',
    });
    await GET(req, { params: Promise.resolve({ path: ['todos'] }) });

    const calledUrl = (globalThis.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('/todos?page=1');
    expect(calledUrl).toContain('sort=desc');
  });
});
