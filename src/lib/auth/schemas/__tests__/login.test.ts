/**
 * @jest-environment node
 */
import { loginBffResponseSchema, mapLoginBackendFailureMessage } from '@/lib/auth/schemas/login';

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
