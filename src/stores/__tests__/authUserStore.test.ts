/**
 * @jest-environment jsdom
 */
import { authUserStore, reconcileAuthSessionOAuthFromServer } from '@/stores/authUserStore';

jest.mock('@/lib/auth/authSessionMeta', () => {
  const actual = jest.requireActual<typeof import('@/lib/auth/authSessionMeta')>(
    '@/lib/auth/authSessionMeta',
  );
  return {
    ...actual,
    fetchAuthSessionMeta: jest.fn().mockResolvedValue({
      ok: true,
      meta: {
        hasRefreshToken: false,
        oauthProvider: null,
      },
    }),
  };
});

async function flushAuthSessionMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

type AuthSessionMetaMockModule = {
  fetchAuthSessionMeta: jest.Mock;
};

describe('authUserStore', () => {
  let queueMicrotaskSpy: jest.SpiedFunction<typeof queueMicrotask>;
  let authSessionMetaMock: AuthSessionMetaMockModule;

  beforeEach(() => {
    authSessionMetaMock = jest.requireMock(
      '@/lib/auth/authSessionMeta',
    ) as AuthSessionMetaMockModule;
    queueMicrotaskSpy = jest.spyOn(globalThis, 'queueMicrotask').mockImplementation(() => {});
    authSessionMetaMock.fetchAuthSessionMeta.mockReset();
    authSessionMetaMock.fetchAuthSessionMeta.mockResolvedValue({
      ok: true,
      meta: {
        hasRefreshToken: false,
        oauthProvider: null,
      },
    });
    authUserStore.getState().clearUser();
  });

  afterEach(() => {
    queueMicrotaskSpy.mockRestore();
  });

  it('setUser로 유효한 User 설정', async () => {
    const u = { id: '1', email: 'test@example.com', name: '테스트' };
    authUserStore.getState().setUser(u);
    await flushAuthSessionMicrotasks();
    expect(authUserStore.getState().user).toEqual(u);
  });

  it('스키마에 맞지 않으면 setUser 무시', () => {
    authUserStore.getState().setUser({
      id: '',
      email: 'bad',
      name: 'x',
    } as never);
    expect(authUserStore.getState().user).toBeNull();
  });

  it('clearUser로 초기화', () => {
    authUserStore.getState().setUser({ id: '1', email: 'a@b.com', name: 'N' });
    authUserStore.getState().clearUser();
    expect(authUserStore.getState().user).toBeNull();
  });

  it('setUser 후 세션 oauth가 google이면 user.oauthProvider 반영', async () => {
    authSessionMetaMock.fetchAuthSessionMeta.mockReset();
    authSessionMetaMock.fetchAuthSessionMeta.mockResolvedValue({
      ok: true,
      meta: {
        hasRefreshToken: true,
        oauthProvider: 'google',
      },
    });
    const g = globalThis as unknown as Record<string, unknown>;
    const hadWindow = Reflect.has(g, 'window');
    const prevWindow = g.window;
    g.window = g;
    try {
      authUserStore.setState({ user: { id: '1', email: 'a@b.com', name: 'N' } });
      reconcileAuthSessionOAuthFromServer();
      await flushAuthSessionMicrotasks();
      expect(authUserStore.getState().user).toMatchObject({
        id: '1',
        email: 'a@b.com',
        name: 'N',
        oauthProvider: 'google',
      });
    } finally {
      if (hadWindow) {
        g.window = prevWindow;
      } else {
        Reflect.deleteProperty(g, 'window');
      }
    }
  });
});
