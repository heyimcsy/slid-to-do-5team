import { ApiClientError } from '@/lib/apiClient';

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
