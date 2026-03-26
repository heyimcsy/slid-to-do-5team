import { z } from 'zod';

/**
 * 로그인 요청 본문 (BFF + 클라이언트 공통).
 */
export const loginBodySchema = z.object({
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
});

export type LoginBody = z.infer<typeof loginBodySchema>;

/** 백엔드 `/auth/login` 실패 시 내려오는 알려진 영문 메시지 — BFF에서 사용자 표시용 한글로 치환 */
export const LOGIN_BACKEND_INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password' as const;

export const LOGIN_FAILURE_USER_MESSAGE_INVALID_CREDENTIALS =
  '이메일 또는 비밀번호가 일치하지 않습니다.' as const;

/**
 * 백엔드 메시지 → BFF/화면용 문구. 알 수 없는 문자열은 그대로 둔다.
 */
export function mapLoginBackendFailureMessage(message: string): string {
  if (message === LOGIN_BACKEND_INVALID_CREDENTIALS_MESSAGE) {
    return LOGIN_FAILURE_USER_MESSAGE_INVALID_CREDENTIALS;
  }
  return message;
}

/**
 * POST `/api/auth/login` BFF JSON 응답 형태 (클라이언트에서 `safeParse`로 계약 검증 가능).
 * 실패 `message`는 BFF가 `mapLoginBackendFailureMessage` 등으로 정규화한 뒤 내려준다.
 */
export const loginBffResponseSchema = z.discriminatedUnion('success', [
  z.object({ success: z.literal(true) }),
  z.object({ success: z.literal(false), message: z.string() }),
]);

export type LoginBffResponse = z.infer<typeof loginBffResponseSchema>;

export function loginValidationMessage(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) return '이메일과 비밀번호를 올바르게 입력하세요.';
  if (issue.code === 'invalid_type') return '이메일과 비밀번호를 올바른 형식으로 입력하세요.';
  return issue.message;
}
