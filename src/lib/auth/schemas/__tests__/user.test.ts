/**
 * @jest-environment node
 */
import { normalizeBackendUserRecord, parseUserFromBackendUnknown } from '@/lib/auth/schemas/user';

import { AUTH_CONFIG } from '@/constants/auth-config';

describe('parseUserFromBackendUnknown', () => {
  it('최소 필수 필드만으로 User', () => {
    const u = parseUserFromBackendUnknown({
      [AUTH_CONFIG.USER_FIELD_ID]: '1',
      [AUTH_CONFIG.USER_FIELD_EMAIL]: 'a@b.com',
      [AUTH_CONFIG.USER_FIELD_NAME]: 'Park',
    });
    expect(u).toEqual({
      id: '1',
      email: 'a@b.com',
      name: 'Park',
    });
  });

  it('user_id 대체 키', () => {
    const u = parseUserFromBackendUnknown({
      [AUTH_CONFIG.USER_FIELD_ID_ALTERNATE]: 'u2',
      [AUTH_CONFIG.USER_FIELD_EMAIL]: 'a@b.com',
      [AUTH_CONFIG.USER_FIELD_NAME]: 'Park',
    });
    expect(u?.id).toBe('u2');
  });

  it('무효하면 undefined', () => {
    expect(parseUserFromBackendUnknown(null)).toBeUndefined();
    expect(parseUserFromBackendUnknown([])).toBeUndefined();
    expect(parseUserFromBackendUnknown({})).toBeUndefined();
  });
});

describe('normalizeBackendUserRecord', () => {
  it('camel 키로 출력', () => {
    const n = normalizeBackendUserRecord({
      [AUTH_CONFIG.USER_FIELD_ID]: '1',
      [AUTH_CONFIG.USER_FIELD_EMAIL]: 'a@b.com',
      [AUTH_CONFIG.USER_FIELD_NAME]: 'X',
    });
    expect(n).toMatchObject({ id: '1', email: 'a@b.com', name: 'X' });
  });
});
