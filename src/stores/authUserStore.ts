import type { User } from '@/lib/auth/schemas/user';

import { applyOauthProviderToUser, fetchAuthSessionMeta } from '@/lib/auth/authSessionMeta';
import { oauthProviderCookieSchema } from '@/lib/auth/schemas/oauth';
import { userSchema } from '@/lib/auth/schemas/user';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  OAUTH_PROVIDER_FETCH_FAILED_FROM_USER_MESSAGE_KO,
  UNKNOWN_ERROR_MESSAGE_KO,
} from '@/constants/error-message';
import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKeys';

type AuthUserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

let authSessionReconcileSeq = 0;
let authSessionReconcileController: AbortController | null = null;

export const authUserStore = create<AuthUserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (next) => {
        if (next === null) {
          set({ user: null });
          return;
        }
        const r = userSchema.safeParse(next);
        if (!r.success) {
          set({ user: null });
          return;
        }
        set({ user: r.data });
        if ('window' in globalThis) {
          queueMicrotask(() => reconcileAuthSessionOAuthFromServer());
        }
      },
      clearUser: () => set({ user: null }),
    }),
    {
      name: LOCAL_STORAGE_KEYS.USER_INFO,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

/**
 * HttpOnly `oauth_provider`와 `User.oauthProvider`를 맞춤.
 * persist 리하이드레이션 직후·`setUser` 직후(내부 microtask)에서 호출.
 * 연속 호출 시 이전 요청은 abort하고, 최신 요청 응답만 반영한다.
 * 세션 메타 조회 실패/비정상 응답, 메타/사용자 shape 검증 실패 시 `user: null`로 fail-closed 처리한다.
 */
export function reconcileAuthSessionOAuthFromServer(): void {
  if (!('window' in globalThis)) return;
  const requestSeq = ++authSessionReconcileSeq;
  authSessionReconcileController?.abort();
  authSessionReconcileController = new AbortController();
  const { signal } = authSessionReconcileController;
  void fetchAuthSessionMeta(signal)
    .then((result) => {
      if (requestSeq !== authSessionReconcileSeq) return;
      if (!result.ok) {
        authUserStore.setState({ user: null });
        return;
      }
      const meta = result.meta;

      const parsedProvider =
        meta?.oauthProvider === null
          ? { success: true as const, data: null }
          : oauthProviderCookieSchema.safeParse(meta?.oauthProvider);
      if (!parsedProvider.success) {
        authUserStore.setState({ user: null });
        return;
      }

      authUserStore.setState((s) => ({
        user: (() => {
          if (!s.user) return null;
          const nextUser = applyOauthProviderToUser(s.user, parsedProvider.data);
          const parsedUser = userSchema.safeParse(nextUser);
          return parsedUser.success ? parsedUser.data : null;
        })(),
      }));
    })
    .catch((error) => {
      if (requestSeq !== authSessionReconcileSeq) return;
      if (error instanceof DOMException && error.name === 'AbortError') return;
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `${OAUTH_PROVIDER_FETCH_FAILED_FROM_USER_MESSAGE_KO}: ${error?.message ?? UNKNOWN_ERROR_MESSAGE_KO}`,
        );
      }
    });
}
