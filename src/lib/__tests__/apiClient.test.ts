/**
 * apiClient 레이어 점검
 *
 * - `@/lib/apiClient` (바렐): `createApiClient`·타입·`prepareApiClientBody` + **브라우저 인스턴스** `apiClient` / `use*`
 *   → Client Component·브라우저에서 쓰는 기본 경로 (서버 전용 코드 없음).
 * - `@/lib/apiClient.server`: `apiClientServer` — Route Handler / RSC 등 **서버만** (`import 'server-only'`).
 * - 팩토리 단위 동작은 `createApiClient` + 최소 deps로 검증.
 */
import { apiClient, ApiClientError, createApiClient, prepareApiClientBody } from '@/lib/apiClient';

import { AUTH_TOKENS_EXPIRED_MESSAGE_KO } from '@/constants/error-message';

describe('prepareApiClientBody', () => {
  it('객체 → JSON 문자열 + application/json 플래그', () => {
    const r = prepareApiClientBody({ a: 1 });
    expect(r.setJsonContentType).toBe(true);
    expect(r.stripContentTypeForFormData).toBe(false);
    expect(r.body).toBe('{"a":1}');
  });

  it('FormData → 원본 + strip Content-Type', () => {
    const fd = new FormData();
    fd.append('file', new Blob(['x'], { type: 'text/plain' }), 'a.txt');
    const r = prepareApiClientBody(fd);
    expect(r.body).toBe(fd);
    expect(r.setJsonContentType).toBe(false);
    expect(r.stripContentTypeForFormData).toBe(true);
  });

  it('Blob → 원본, JSON 타입 아님', () => {
    const b = new Blob(['abc'], { type: 'image/png' });
    const r = prepareApiClientBody(b);
    expect(r.body).toBe(b);
    expect(r.setJsonContentType).toBe(false);
  });

  it('URLSearchParams → 원본 (fetch가 x-www-form-urlencoded 처리)', () => {
    const u = new URLSearchParams({ q: '1' });
    const r = prepareApiClientBody(u);
    expect(r.body).toBe(u);
    expect(r.setJsonContentType).toBe(false);
  });
});

describe('ApiClientError', () => {
  it('status, code, message 생성', () => {
    const err = new ApiClientError(401, 'UNAUTHORIZED', AUTH_TOKENS_EXPIRED_MESSAGE_KO);
    expect(err.status).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
    expect(err.message).toBe(AUTH_TOKENS_EXPIRED_MESSAGE_KO);
    expect(err.name).toBe('ApiClientError');
  });

  it('code가 undefined일 수 있음', () => {
    const err = new ApiClientError(500, undefined, 'Server Error');
    expect(err.code).toBeUndefined();
    expect(err.status).toBe(500);
  });
});

describe('createApiClient — 서버형 인스턴스(allowGlobalInterceptorRegistration: false)', () => {
  it('use* 등록 시 즉시 throw — 서버 인스턴스는 전역 인터셉터 미지원', () => {
    const serverLike = createApiClient({
      resolveUrl: (endpoint) => `https://jsonplaceholder.typicode.com${endpoint}`,
      credentials: 'omit',
      refreshTokens: async () => false,
      shouldRunGlobalInterceptors: () => false,
      allowGlobalInterceptorRegistration: false,
    });

    expect(() => serverLike.useRequestInterceptor((i) => i)).toThrow(/클라이언트 전용/);
    expect(() => serverLike.useResponseInterceptor((_r, d) => d)).toThrow(/클라이언트 전용/);
    expect(() => serverLike.useErrorInterceptor(() => {})).toThrow(/클라이언트 전용/);
  });
});

describe('바렐 export — Client Component와 동일 진입점', () => {
  it('apiClient는 함수(브라우저 인스턴스의 request)', () => {
    expect(typeof apiClient).toBe('function');
  });
});
