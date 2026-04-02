/**
 * @jest-environment node
 */
import {
  loginBffResponseSchema,
  mapLoginBackendFailureMessage,
  resolveLoginFailureHttpStatus,
} from '@/lib/auth/schemas/login';

describe('mapLoginBackendFailureMessage', () => {
  it('백엔드 기본 영문 실패 메시지 → 한글 사용자 문구', () => {
    expect(mapLoginBackendFailureMessage('Invalid email or password')).toBe(
      '이메일 또는 비밀번호가 일치하지 않습니다.',
    );
  });

  it('그 외 메시지는 그대로', () => {
    expect(mapLoginBackendFailureMessage('Too many requests')).toBe('Too many requests');
  });
});

describe('resolveLoginFailureHttpStatus', () => {
  it('백엔드 409 → 409', () => {
    expect(resolveLoginFailureHttpStatus(409, { message: 'x' })).toBe(409);
  });

  it('code가 DUPLICATE_EMAIL 류면 409', () => {
    expect(resolveLoginFailureHttpStatus(400, { code: 'DUPLICATE_EMAIL', message: 'x' })).toBe(409);
  });

  it('message에 중복 힌트면 409', () => {
    expect(resolveLoginFailureHttpStatus(400, { message: '이미 가입된 이메일입니다.' })).toBe(409);
  });

  it('해당 없으면 백엔드 상태 유지', () => {
    expect(resolveLoginFailureHttpStatus(401, { message: 'nope' })).toBe(401);
  });
});

describe('loginBffResponseSchema', () => {
  it('성공 응답', () => {
    const r = loginBffResponseSchema.safeParse({ success: true });
    expect(r.success).toBe(true);
  });

  it('실패 응답', () => {
    const r = loginBffResponseSchema.safeParse({
      success: false,
      message: '이메일 또는 비밀번호가 일치하지 않습니다.',
    });
    expect(r.success).toBe(true);
  });

  it('success 없으면 실패', () => {
    const r = loginBffResponseSchema.safeParse({ message: 'x' });
    expect(r.success).toBe(false);
  });
});
