import { z } from 'zod';

/**
 * 회원가입 요청 본문 (BFF + 클라이언트 공통).
 * `passwordConfirm`은 백엔드로 전달하지 않고 검증에만 사용한다.
 */
export const signupBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: '이름을 입력하세요.' })
      .max(20, { message: '이름이 너무 깁니다.' }),
    email: z
      .string()
      .trim()
      .min(1, { message: '이메일을 입력하세요.' })
      .max(254, { message: '이메일이 너무 깁니다.' })
      .pipe(z.email({ message: '잘못된 이메일입니다.' })),
    password: z
      .string()
      .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
      .max(72, { message: '비밀번호는 72자 이하여야 합니다.' }),
    passwordConfirm: z.string().min(1, { message: '비밀번호 확인을 입력하세요.' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type SignupBody = z.infer<typeof signupBodySchema>;

export function signupValidationMessage(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) return '입력값을 확인해 주세요.';
  if (issue.code === 'invalid_type') return '이메일과 비밀번호를 올바른 형식으로 입력하세요.';
  return issue.message;
}
