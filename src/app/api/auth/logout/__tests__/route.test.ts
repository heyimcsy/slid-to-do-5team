/**
 * @jest-environment node
 */
import { POST } from '@/app/api/auth/logout/route';
import { clearAuthCookies, clearOAuthUserFlashCookie } from '@/lib/auth/cookies';

jest.mock('@/lib/auth/cookies', () => {
  const actual = jest.requireActual<typeof import('@/lib/auth/cookies')>('@/lib/auth/cookies');
  return {
    ...actual,
    clearAuthCookies: jest.fn().mockResolvedValue(undefined),
    clearOAuthUserFlashCookie: jest.fn(),
  };
});

const mockClearAuthCookies = clearAuthCookies as jest.MockedFunction<typeof clearAuthCookies>;
const mockClearOAuthUserFlashCookie = clearOAuthUserFlashCookie as jest.MockedFunction<
  typeof clearOAuthUserFlashCookie
>;

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    mockClearAuthCookies.mockClear();
    mockClearOAuthUserFlashCookie.mockClear();
  });

  it('clearAuthCookies·clearOAuthUserFlashCookie 호출 후 200', async () => {
    const res = await POST();
    expect(res.status).toBe(200);
    expect(mockClearAuthCookies).toHaveBeenCalledTimes(1);
    expect(mockClearOAuthUserFlashCookie).toHaveBeenCalledTimes(1);
    expect(mockClearOAuthUserFlashCookie).toHaveBeenCalledWith(res);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
