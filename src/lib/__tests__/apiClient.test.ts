import { ApiClientError, prepareApiClientBody } from '@/lib/apiClient';

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
    const err = new ApiClientError(401, 'UNAUTHORIZED', '인증이 만료되었습니다.');
    expect(err.status).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
    expect(err.message).toBe('인증이 만료되었습니다.');
    expect(err.name).toBe('ApiClientError');
  });

  it('code가 undefined일 수 있음', () => {
    const err = new ApiClientError(500, undefined, 'Server Error');
    expect(err.code).toBeUndefined();
    expect(err.status).toBe(500);
  });
});
