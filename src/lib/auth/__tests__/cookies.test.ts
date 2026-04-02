/**
 * @jest-environment node
 */
import { cookies } from 'next/headers';
import { getJwtExp, isAccessTokenExpired } from '@/lib/auth/cookies';

import { AUTH_CONFIG } from '@/constants/auth-config';

/** base64url 인코딩 */
function b64url(obj: object): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

/** 테스트용 JWT 생성 (header.payload.signature) */
function createJwt(exp: number): string {
  const header = b64url({ alg: 'HS256', typ: 'JWT' });
  const payload = b64url({ exp, iat: exp - 3600 });
  const sig = b64url({ s: 'mock' });
  return `${header}.${payload}.${sig}`;
}

describe('cookies', () => {
  describe('getJwtExp', () => {
    it('정상 JWT → exp 반환', () => {
      const exp = Math.floor(Date.now() / 1000) + 300;
      const token = createJwt(exp);
      expect(getJwtExp(token)).toBe(exp);
    });

    it('잘못된 JWT → null', () => {
      expect(getJwtExp('invalid')).toBe(null);
      expect(getJwtExp('a.b')).toBe(null);
      expect(getJwtExp('')).toBe(null);
      expect(getJwtExp('no-dots')).toBe(null);
      // payload가 유효한 JSON이지만 exp 없음
      const header = b64url({ alg: 'HS256' });
      const payload = b64url({ sub: 'user' });
      expect(getJwtExp(`${header}.${payload}.x`)).toBe(null);
    });
  });

  describe('isAccessTokenExpired', () => {
    const mockCookieStore = { get: jest.fn(), set: jest.fn(), delete: jest.fn() };

    beforeEach(() => {
      jest.clearAllMocks();
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
    });

    it('accessToken 없음 → true', async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      expect(await isAccessTokenExpired()).toBe(true);
    });

    it('exp가 현재 이전 → true', async () => {
      const exp = Math.floor(Date.now() / 1000) - 60;
      const token = createJwt(exp);
      mockCookieStore.get.mockImplementation((name: string) =>
        name === AUTH_CONFIG.ACCESS_TOKEN_KEY ? { value: token } : undefined,
      );
      expect(await isAccessTokenExpired()).toBe(true);
    });

    it('exp가 현재보다 미래 → false', async () => {
      const exp = Math.floor(Date.now() / 1000) + 120;
      const token = createJwt(exp);
      mockCookieStore.get.mockImplementation((name: string) =>
        name === AUTH_CONFIG.ACCESS_TOKEN_KEY ? { value: token } : undefined,
      );
      expect(await isAccessTokenExpired()).toBe(false);
    });

    it('잘못된 JWT → true', async () => {
      mockCookieStore.get.mockImplementation((name: string) =>
        name === AUTH_CONFIG.ACCESS_TOKEN_KEY ? { value: 'invalid-jwt' } : undefined,
      );
      expect(await isAccessTokenExpired()).toBe(true);
    });
  });
});
