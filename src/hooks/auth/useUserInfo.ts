'use client';

import type { User } from '@/lib/auth/schemas/user';

import { authUserStore } from '@/stores/authUserStore';

/** 로그인 사용자 전체. 없으면 `null`. */
export function useUserInfo(): User | null;
/** `User`에서 필드 하나만 구독·반환. 없으면 `null`. */
export function useUserInfo<K extends keyof User>(key: K): User[K] | null;
/**
 * 여러 필드를 `Pick`한 객체로 반환. 없으면 `null`.
 * 리터럴로 쓰면 `Pick` 키가 좁혀지므로 `as const` 권장 (예: `useUserInfo(['name', 'email'] as const)`).
 */
export function useUserInfo<const K extends readonly (keyof User)[]>(
  keys: K,
): [K['length']] extends [0] ? null : Pick<User, K[number]> | null;
export function useUserInfo(
  keyOrKeys?: keyof User | readonly (keyof User)[],
): User | User[keyof User] | Pick<User, keyof User> | null {
  const user = authUserStore((s) => s.user);
  if (!user) return null;
  if (keyOrKeys === undefined) return user;
  if (Array.isArray(keyOrKeys)) {
    if (keyOrKeys.length === 0) return null;
    const keys = keyOrKeys as readonly (keyof User)[];
    const out = {} as Pick<User, (typeof keys)[number]>;
    const bucket = out as Record<keyof User, User[keyof User]>;
    for (const k of keys) {
      bucket[k] = user[k];
    }
    return out;
  }
  return user[keyOrKeys as keyof User];
}
