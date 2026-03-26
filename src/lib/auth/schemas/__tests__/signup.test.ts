/**
 * @jest-environment node
 */
import { signupBodySchema } from '@/lib/auth/schemas/signup';

describe('signupBodySchema', () => {
  it('유효한 입력 통과', () => {
    const r = signupBodySchema.safeParse({
      name: '테스트',
      email: '  a@b.co  ',
      password: 'password1',
      passwordConfirm: 'password1',
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe('a@b.co');
    }
  });

  it('비밀번호 불일치 시 실패', () => {
    const r = signupBodySchema.safeParse({
      name: '테스트',
      email: 'a@b.co',
      password: 'password1',
      passwordConfirm: 'password2',
    });
    expect(r.success).toBe(false);
  });

  it('비밀번호 8자 미만 실패', () => {
    const r = signupBodySchema.safeParse({
      name: '테스트',
      email: 'a@b.co',
      password: 'short',
      passwordConfirm: 'short',
    });
    expect(r.success).toBe(false);
  });
});
