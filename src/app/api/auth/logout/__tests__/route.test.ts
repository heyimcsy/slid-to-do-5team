/**
 * @jest-environment node
 */
import { POST } from '@/app/api/auth/logout/route';
import { clearAuthCookies } from '@/lib/auth/cookies';

jest.mock('@/lib/auth/cookies', () => ({
  clearAuthCookies: jest.fn().mockResolvedValue(undefined),
}));

const mockClearAuthCookies = clearAuthCookies as jest.MockedFunction<typeof clearAuthCookies>;

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    mockClearAuthCookies.mockClear();
  });

  it('clearAuthCookies 호출 후 200', async () => {
    const res = await POST();
    expect(res.status).toBe(200);
    expect(mockClearAuthCookies).toHaveBeenCalledTimes(1);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
