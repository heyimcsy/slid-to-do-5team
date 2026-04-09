/**
 * @jest-environment node
 */
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';

import { AUTH_CONFIG } from '@/constants/auth-config';

describe('parseTokenPairFromBackendJson', () => {
  it('스네이크 토큰 + user 스네이크 필드 → User', () => {
    const data = {
      [AUTH_CONFIG.ACCESS_TOKEN_KEY]: 'a',
      [AUTH_CONFIG.REFRESH_TOKEN_KEY]: 'r',
      [AUTH_CONFIG.USER_OBJECT_KEY]: {
        [AUTH_CONFIG.USER_FIELD_ID]: '42',
        [AUTH_CONFIG.USER_FIELD_EMAIL]: 'a@b.com',
        [AUTH_CONFIG.USER_FIELD_NAME]: 'Kim',
        [AUTH_CONFIG.USER_FIELD_AVATAR_URL]: 'https://placehold.co/38x38?text=S',
      },
    };
    const r = parseTokenPairFromBackendJson(data);
    expect(r.accessToken).toBe('a');
    expect(r.refreshToken).toBe('r');
    expect(r.user).toEqual({
      id: '42',
      email: 'a@b.com',
      name: 'Kim',
      image: 'https://placehold.co/38x38?text=S',
    });
  });

  it('camel 토큰·User 키 + user 내부 camel', () => {
    const data = {
      [AUTH_CONFIG.ACCESS_TOKEN_JSON_ALTERNATE]: 'at',
      [AUTH_CONFIG.REFRESH_TOKEN_JSON_ALTERNATE]: 'rt',
      [AUTH_CONFIG.USER_OBJECT_JSON_ALTERNATE]: {
        id: '99',
        email: 'c@d.com',
        name: 'Lee',
        image: 'https://placehold.co/38x38?text=S',
      },
    };
    const r = parseTokenPairFromBackendJson(data);
    expect(r.accessToken).toBe('at');
    expect(r.refreshToken).toBe('rt');
    expect(r.user).toEqual({
      id: '99',
      email: 'c@d.com',
      name: 'Lee',
      image: 'https://placehold.co/38x38?text=S',
    });
  });

  it('user 없음 → undefined', () => {
    const r = parseTokenPairFromBackendJson({
      [AUTH_CONFIG.ACCESS_TOKEN_KEY]: 'a',
      [AUTH_CONFIG.REFRESH_TOKEN_KEY]: 'r',
    });
    expect(r.user).toBeUndefined();
  });

  it('user 형식 불일치 → undefined', () => {
    const r = parseTokenPairFromBackendJson({
      [AUTH_CONFIG.ACCESS_TOKEN_KEY]: 'a',
      [AUTH_CONFIG.REFRESH_TOKEN_KEY]: 'r',
      [AUTH_CONFIG.USER_OBJECT_KEY]: { email: 'bad' },
    });
    expect(r.user).toBeUndefined();
  });
});
