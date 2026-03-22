import type { PersistStore } from '@/providers/PersistRehydrationProvider';
import type { ReactNode } from 'react';

import { AppProviders } from '@/providers/AppProviders';
import { useIsRestoring } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

/**
 * {@link AppProviders} 스모크 테스트
 *
 * - 자식이 DOM에 나타나는지 확인
 * - `persistStores={[]}`일 때도 {@link PersistRehydrationProvider}가 Gate 없이 children만 그리는 경로와 맞는지 확인
 *
 * `globalThis.fetch` 모킹: {@link AppProviders}가 마운트 시 `useTokenRefreshOnMount` → `/api/auth/refresh` `fetch`를 호출하므로
 * 테스트에서 네트워크/미처리 rejection을 막기 위함(호출 자체는 검증하지 않음).
 *
 * **PersistQueryClientProvider:** 마운트 후 `persistQueryClientRestore`가 끝나면 `useIsRestoring()`이 `false`가 된다.
 * `queueMicrotask`로 때우지 않고 `waitFor` + `useIsRestoring`으로 복원 완료를 기다린다(React 권장 act 경로).
 */
describe('AppProviders', () => {
  // Arrange - globalThis.fetch 모킹
  const originalFetch = globalThis.fetch;
  beforeEach(() => {
    globalThis.fetch = jest.fn() as typeof fetch;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  // Act - `PersistQueryClientProvider` 내부 `IsRestoringProvider` 값을 DOM에 노출해 테스트에서 대기 가능하게 함
  function RqRestoreProbe({ children }: { children: ReactNode }) {
    // Act - `useIsRestoring` 호출
    const isRestoring = useIsRestoring();
    // Assert - `IsRestoringProvider` 값을 DOM에 노출해 테스트에서 대기 가능하게 함
    return (
      <>
        <span data-testid="rq-is-restoring">{String(isRestoring)}</span>
        {children}
      </>
    );
  }

  it('children 렌더 (기본 `PERSIST_STORES` — rehydrate 완료 후 children)', async () => {
    // Act - `AppProviders` 렌더링
    render(
      <AppProviders>
        <RqRestoreProbe>
          <div data-testid="child">Child</div>
        </RqRestoreProbe>
      </AppProviders>,
    );

    // Assert - PersistRehydrationProvider: zustand rehydrate 후에야 Gate가 children을 마운트
    expect(await screen.findByTestId('child')).toBeInTheDocument();

    // Assert - PersistQueryClientProvider: persist 복원 후 setIsRestoring(false) — act 경고 없이 기다리기
    await waitFor(() => {
      expect(screen.getByTestId('rq-is-restoring')).toHaveTextContent('false');
    });
  });

  it('persistStores가 비어있어도 children 렌더', async () => {
    // Arrange - persistStores가 비어있는 `AppProviders` 렌더링
    const children = <span>Content</span>;
    const persistStores: PersistStore[] = [];

    // Act - persistStores가 비어있는 `AppProviders` 렌더링
    render(
      <AppProviders persistStores={persistStores}>
        <RqRestoreProbe>{children}</RqRestoreProbe>
      </AppProviders>,
    );

    // Assert - children 렌더
    expect(screen.getByText('Content')).toBeInTheDocument();

    // Assert - PersistQueryClientProvider: persist 복원 후 setIsRestoring(false) — act 경고 없이 기다리기
    await waitFor(() => {
      expect(screen.getByTestId('rq-is-restoring')).toHaveTextContent('false');
    });
  });
});
