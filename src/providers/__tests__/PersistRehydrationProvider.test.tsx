import type { PersistStore } from '@/providers/PersistRehydrationProvider';

import { useState } from 'react';
import { PersistRehydrationProvider } from '@/providers/PersistRehydrationProvider';
import { act, render, screen } from '@testing-library/react';

/**
 * @description {@link PersistRehydrationProvider} 동작 검증
 *
 * **mock 스토어:** `PersistStore`는 프로덕션과 같이 `persist: { rehydrate, getOptions }`를 둔다.
 * (`getRehydrationGateKey`가 `getOptions().name`을 쓰므로 테스트에서도 생략하지 않음.)
 *
 * - rehydrate 대상 없음(`getStoresToRehydrate` 빈 배열) → Gate 없이 즉시 children
 * - 대상 있음 → Gate에서 각 `persist.rehydrate()`가 끝날 때까지 fallback, 이후 children
 * - `stores`가 `[]` → `[mockStore]`로 바뀜 → Gate 마운트 후 위와 동일하게 fallback → 완료 후 children
 * - `Promise.allSettled`: 일부 `rehydrate`가 reject되어도 **모든 promise가 settle**되면 children (남은 스토어 resolve 필요)
 * - 스토어 2개 이상 → 모두 settle 전까지 fallback, 모두 끝나면 children
 * - `stores` 미전달 → 기본 `[]`로 즉시 children
 *
 * @see {@link https://ko.react.dev/learn/you-might-not-need-an-effect | React — You might not need an effect}
 */
describe('PersistRehydrationProvider', () => {
  it('rehydrate 대상이 없으면(getStoresToRehydrate 빈 배열) children만 즉시 렌더', () => {
    const stores: PersistStore[] = [];

    render(
      <PersistRehydrationProvider stores={stores}>
        <span>Content</span>
      </PersistRehydrationProvider>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('rehydrate 대상이 있으면 완료 전까지 fallback, 완료 후 children', async () => {
    let resolveRehydrate!: () => void;
    const rehydrate = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveRehydrate = resolve;
        }),
    );
    const mockStore: PersistStore = {
      persist: { rehydrate, getOptions: () => ({ name: 'test-store' }) },
    };

    render(
      <PersistRehydrationProvider stores={[mockStore]} fallback={<div>Loading</div>}>
        <span>Content</span>
      </PersistRehydrationProvider>,
    );

    await act(async () => {});
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(rehydrate).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveRehydrate();
    });
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('stores가 []에서 persist 스토어로 바뀌면 Gate 마운트 후 rehydrate 끝날 때까지 fallback', async () => {
    jest.useFakeTimers();

    const mockStore: PersistStore = {
      persist: {
        rehydrate: () => new Promise((resolve) => setTimeout(resolve, 30)),
        getOptions: () => ({ name: 'late' }),
      },
    };

    function Wrapper() {
      const [stores, setStores] = useState<PersistStore[]>([]);
      return (
        <>
          <button type="button" onClick={() => setStores([mockStore])}>
            add
          </button>
          <PersistRehydrationProvider stores={stores} fallback={<div>Loading</div>}>
            <span>Content</span>
          </PersistRehydrationProvider>
        </>
      );
    }

    render(<Wrapper />);
    expect(screen.getByText('Content')).toBeInTheDocument();

    await act(async () => {
      screen.getByRole('button', { name: 'add' }).click();
    });
    expect(screen.getByText('Loading')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(30);
    });
    expect(screen.getByText('Content')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('rehydrate가 동기적으로 throw해도 allSettled 후 children이 렌더된다', async () => {
    const syncThrowStore: PersistStore = {
      persist: {
        rehydrate: () => {
          throw new Error('sync rehydrate');
        },
        getOptions: () => ({ name: 'sync-throw-store' }),
      },
    };

    render(
      <PersistRehydrationProvider stores={[syncThrowStore]} fallback={<div>Loading</div>}>
        <span>Content</span>
      </PersistRehydrationProvider>,
    );

    await act(async () => {});
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('rehydrate가 reject되어도 allSettled에 의해 children이 렌더된다', async () => {
    let resolveOk!: () => void;
    const okStore: PersistStore = {
      persist: {
        rehydrate: () =>
          new Promise<void>((resolve) => {
            resolveOk = resolve;
          }),
        getOptions: () => ({ name: 'ok-store' }),
      },
    };
    const failStore: PersistStore = {
      persist: {
        rehydrate: () => Promise.reject(new Error('storage unavailable')),
        getOptions: () => ({ name: 'fail-store' }),
      },
    };

    render(
      <PersistRehydrationProvider stores={[failStore, okStore]} fallback={<div>Loading</div>}>
        <span>Content</span>
      </PersistRehydrationProvider>,
    );

    await act(async () => {});
    expect(screen.getByText('Loading')).toBeInTheDocument();

    await act(async () => {
      resolveOk();
    });
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('두 개 이상의 스토어가 있을 때 모두 완료 후 children 렌더', async () => {
    let resolveA!: () => void;
    let resolveB!: () => void;
    const storeA: PersistStore = {
      persist: {
        rehydrate: () =>
          new Promise<void>((resolve) => {
            resolveA = resolve;
          }),
        getOptions: () => ({ name: 'store-a' }),
      },
    };
    const storeB: PersistStore = {
      persist: {
        rehydrate: () =>
          new Promise<void>((resolve) => {
            resolveB = resolve;
          }),
        getOptions: () => ({ name: 'store-b' }),
      },
    };

    render(
      <PersistRehydrationProvider stores={[storeA, storeB]} fallback={<div>Loading</div>}>
        <span>Content</span>
      </PersistRehydrationProvider>,
    );

    await act(async () => {});
    expect(screen.getByText('Loading')).toBeInTheDocument();

    await act(async () => {
      resolveA();
    });
    expect(screen.getByText('Loading')).toBeInTheDocument();

    await act(async () => {
      resolveB();
    });
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('stores prop 미전달 시 기본값 []가 적용되어 children 즉시 렌더', () => {
    render(
      <PersistRehydrationProvider>
        <span>Content</span>
      </PersistRehydrationProvider>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
