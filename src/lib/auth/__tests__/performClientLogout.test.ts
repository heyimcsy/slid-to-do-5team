import type { Persister } from '@tanstack/react-query-persist-client';

import { apiClient } from '@/lib/apiClient';
import { performClientLogout } from '@/lib/auth/performClientLogout';
import { persistQueryClientSave } from '@tanstack/query-persist-client-core';
import { QueryClient } from '@tanstack/react-query';

const clearQueryPersistStorageMock = jest.fn();

jest.mock('@/providers/createQueryPersister', () => {
  const actual = jest.requireActual<typeof import('@/providers/createQueryPersister')>(
    '@/providers/createQueryPersister',
  );
  return {
    ...actual,
    clearQueryPersistStorage: (...args: unknown[]) => clearQueryPersistStorageMock(...args),
  };
});

jest.mock('@/lib/apiClient', () => ({
  apiClient: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('@tanstack/query-persist-client-core', () => ({
  persistQueryClientSave: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/auth/clearOAuthClientState', () => ({
  clearOAuthClientState: jest.fn(),
}));

jest.mock('@/stores/authUserStore', () => ({
  authUserStore: {
    getState: jest.fn(() => ({ clearUser: jest.fn() })),
  },
}));

describe('performClientLogout', () => {
  const mockedPersistSave = jest.mocked(persistQueryClientSave);
  const mockRouter = { replace: jest.fn(), refresh: jest.fn() };

  const noopPersister: Persister = {
    persistClient: jest.fn().mockResolvedValue(undefined),
    restoreClient: jest.fn().mockResolvedValue(undefined),
    removeClient: jest.fn().mockResolvedValue(undefined),
  };

  let registerQueryPersister: (persister: Persister | null) => void;

  beforeEach(async () => {
    ({ registerQueryPersister } = await import('@/providers/createQueryPersister'));
    registerQueryPersister(null);
    clearQueryPersistStorageMock.mockClear();
  });

  afterEach(() => {
    registerQueryPersister?.(null);
  });

  it('등록된 persister와 queryClient가 있으면 clear 후 persistQueryClientSave를 await하고 그다음 저장소 정리를 호출한다', async () => {
    const queryClient = new QueryClient();
    registerQueryPersister(noopPersister);

    await performClientLogout(mockRouter, queryClient);

    expect(jest.mocked(apiClient)).toHaveBeenCalled();
    expect(mockedPersistSave).toHaveBeenCalledTimes(1);
    expect(mockedPersistSave).toHaveBeenCalledWith({
      queryClient,
      persister: noopPersister,
      buster: process.env.NEXT_PUBLIC_APP_VERSION ?? '',
    });
    expect(clearQueryPersistStorageMock).toHaveBeenCalledTimes(1);
    const persistOrder = mockedPersistSave.mock.invocationCallOrder[0];
    const clearOrder = clearQueryPersistStorageMock.mock.invocationCallOrder[0];
    expect(persistOrder).toBeLessThan(clearOrder);
  });

  it('persister가 등록되지 않았으면 persistQueryClientSave 없이 저장소만 정리한다', async () => {
    const queryClient = new QueryClient();

    await performClientLogout(mockRouter, queryClient);

    expect(mockedPersistSave).not.toHaveBeenCalled();
    expect(clearQueryPersistStorageMock).toHaveBeenCalledTimes(1);
  });
});
