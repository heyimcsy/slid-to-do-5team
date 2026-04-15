/**
 * @jest-environment node
 */
import { GET } from '@/app/api/auth/session/route';

import { AUTH_CONFIG } from '@/constants/auth-config';

describe('GET /api/auth/session', () => {
  it('refresh 있음 → hasRefreshToken true, oauth 없으면 null', async () => {
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) => {
      if (name === AUTH_CONFIG.REFRESH_TOKEN_KEY) return { value: 'rt' };
      return undefined;
    });

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.hasRefreshToken).toBe(true);
    expect(json.oauthProvider).toBeNull();
  });

  it('refresh 없음 → hasRefreshToken false', async () => {
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockReturnValue(undefined);

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.hasRefreshToken).toBe(false);
    expect(json.oauthProvider).toBeNull();
  });

  it('oauth_provider 쿠키 있음 → oauthProvider 반환', async () => {
    const { cookies } = await import('next/headers');
    const mockCookies = await cookies();
    (mockCookies.get as jest.Mock).mockImplementation((name: string) => {
      if (name === AUTH_CONFIG.REFRESH_TOKEN_KEY) return { value: 'rt' };
      if (name === AUTH_CONFIG.OAUTH_PROVIDER_COOKIE_KEY) return { value: 'kakao' };
      return undefined;
    });

    const res = await GET();
    const json = await res.json();
    expect(json.oauthProvider).toBe('kakao');
  });
});
