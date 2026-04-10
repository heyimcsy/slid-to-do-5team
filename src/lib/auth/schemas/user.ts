import { z } from 'zod';

import { AUTH_CONFIG } from '@/constants/auth-config';

import { oauthProviderCookieSchema } from './oauth';

/**
 * 앱 전역에서 쓰는 사용자 모델 (camelCase). 비밀번호 등 민감 필드는 포함하지 않는다.
 * 백엔드 JSON은 `parseUserFromBackendUnknown` / `normalizeBackendUserRecord`로 정규화 후 검증한다.
 */
export const userSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String).pipe(z.string().trim().min(1)),
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: '잘못된 이메일입니다.' })),
  name: z
    .string()
    .trim()
    .min(1, { message: '이름이 비어있습니다.' })
    .max(20, { message: '이름이 너무 깁니다.' }),
  image: z.string().nullable().optional(),
  teamId: z
    .union([z.string(), z.number()])
    .transform(String)
    .pipe(z.string().trim().min(1))
    .optional(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
  /**
   * OAuth 세션 구분 — 백엔드 user JSON에는 없을 수 있음.
   * `GET /api/auth/session`·`fetchAuthSessionMeta`로 HttpOnly `oauth_provider` 쿠키와 맞춘다.
   */
  oauthProvider: oauthProviderCookieSchema.optional(),
});

export type User = z.infer<typeof userSchema>;

/** RHF 프로필 등 — 갱신 가능한 필드만 (필요 시 확장) */
export const userProfileUpdateSchema = z.object({
  name: userSchema.shape.name.optional(),
  image: userSchema.shape.image,
});

export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;

function pickField(raw: Record<string, unknown>, primary: string, alternate: string): unknown {
  if (Object.prototype.hasOwnProperty.call(raw, primary) && raw[primary] != null) {
    return raw[primary];
  }
  if (Object.prototype.hasOwnProperty.call(raw, alternate) && raw[alternate] != null) {
    return raw[alternate];
  }
  return undefined;
}

/**
 * 백엔드 사용자 객체(스네이크·카멜 혼용)를 `userSchema` 입력용 camel 레코드로 만든다.
 */
export function normalizeBackendUserRecord(raw: Record<string, unknown>): Record<string, unknown> {
  const C = AUTH_CONFIG;
  const out: Record<string, unknown> = {};

  const id = pickField(raw, C.USER_FIELD_ID, C.USER_FIELD_ID_ALTERNATE);
  if (id !== undefined) out.id = id;

  const email = raw[C.USER_FIELD_EMAIL];
  if (email !== undefined) out.email = email;

  const name = raw[C.USER_FIELD_NAME];
  if (name !== undefined) out.name = name;

  const imagePrimary = raw[C.USER_FIELD_IMAGE];
  const image =
    typeof imagePrimary === 'string' && imagePrimary.length > 0
      ? imagePrimary
      : pickField(raw, C.USER_FIELD_AVATAR_URL, C.USER_FIELD_AVATAR_URL_ALTERNATE);
  if (typeof image === 'string' && image.length > 0) out.image = image;

  return out;
}

/**
 * login/refresh 등에서 내려온 알 수 없는 값을 `User`로 좁힌다. 실패 시 `undefined`.
 */
export function parseUserFromBackendUnknown(input: unknown): User | undefined {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) return undefined;
  const normalized = normalizeBackendUserRecord(input as Record<string, unknown>);
  const r = userSchema.safeParse(normalized);
  return r.success ? r.data : undefined;
}
