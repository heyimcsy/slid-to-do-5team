/**
 * @jest-environment node
 */
import { redirect } from 'next/navigation';
import { hasAuthSessionCookies } from '@/lib/auth/cookies';
import { redirectIfSessionOnAuthPage } from '@/lib/auth/redirectIfSessionOnAuthPage';

jest.mock('next/navigation', () => ({
  redirect: jest.fn((to: string) => {
    const err = new Error('NEXT_REDIRECT');
    (err as Error & { digest?: string }).digest = to;
    throw err;
  }),
}));

jest.mock('@/lib/auth/cookies', () => ({
  hasAuthSessionCookies: jest.fn(),
}));

const mockHas = hasAuthSessionCookies as jest.MockedFunction<typeof hasAuthSessionCookies>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe('redirectIfSessionOnAuthPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('error 쿼리가 있으면 redirect·hasAuthSessionCookies 호출 안 함', async () => {
    mockHas.mockResolvedValue(true);
    await redirectIfSessionOnAuthPage({ error: 'access_denied' });
    expect(mockHas).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('error가 공백만 있으면 무시하지 않고 스킵하지 않음 — trim 후 비어 있으면 통과', async () => {
    mockHas.mockResolvedValue(true);
    await expect(redirectIfSessionOnAuthPage({ error: '   ' })).rejects.toThrow('NEXT_REDIRECT');
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });

  it('세션 없으면 redirect 안 함', async () => {
    mockHas.mockResolvedValue(false);
    await redirectIfSessionOnAuthPage({});
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('세션 있으면 /dashboard', async () => {
    mockHas.mockResolvedValue(true);
    await expect(redirectIfSessionOnAuthPage({})).rejects.toThrow('NEXT_REDIRECT');
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });

  it('callbackUrl 안전하면 해당 경로', async () => {
    mockHas.mockResolvedValue(true);
    await expect(redirectIfSessionOnAuthPage({ callbackUrl: '/profile' })).rejects.toThrow(
      'NEXT_REDIRECT',
    );
    expect(mockRedirect).toHaveBeenCalledWith('/profile');
  });
});
