'use client';

import type { ReactNode } from 'react';
import type { Mutate, StoreApi } from 'zustand';

import { useEffect, useMemo, useState } from 'react';

/**
 * @description `Mutate<StoreApi, [['zustand/persist', …]]>` 결과에서 **`persist` 프로퍼티 타입**만 취한다
 * @note `StoreApi<unknown>` — vanilla 스토어 API(상태 제네릭을 특정하지 않음)
 * @note `[['zustand/persist', unknown]]` — persist 미들웨어 튜플; 두 번째 `unknown`은 Zustand가 쓰는 **persisted slice 등 타입 파라미터 자리**이며, 여기서는 구체 타입에 묶지 않기 위해 둔다(런타임 “상태 추출”과 무관)
 * @see {@link https://github.com/pmndrs/zustand/blob/main/docs/reference/integrations/persisting-store-data.md#how-can-i-rehydrate-on-storage-event | Zustand — Persisting store data (PersistedStoreApi)}
 * @see {@link https://velog.io/@bluejoyq/Zustand%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EA%B5%AC%ED%98%84%EB%90%98%EC%96%B4-%EC%9E%88%EC%9D%84%EA%B9%8Cv4.5.2 | Zustand는 어떻게 구현되어 있을까?}
 */
type PersistedStoreApi = Mutate<StoreApi<unknown>, [['zustand/persist', unknown]]>['persist'];

/**
 * @description 이 프로바이더에 넘기는 스토어 조각의 타입.
 * @property persist - 공식 persist API 중 **이 컴포넌트가 호출하는 멤버만** `Pick`으로 둔다
 *   - `rehydrate` — 스토리지에서 상태를 수동으로 복원
 *   - `getOptions` — 스토리지 키·이름 등 옵션 조회(Gate `key`에 `name` 사용)
 * @see {@link https://github.com/pmndrs/zustand/blob/main/docs/reference/integrations/persisting-store-data.md#rehydrate | Zustand — Persisting store data (rehydrate)}
 * @see {@link https://github.com/pmndrs/zustand/blob/main/docs/reference/integrations/persisting-store-data.md#getoptions | Zustand — Persisting store data (getOptions)}
 */
export type PersistStore = {
  persist?: Pick<PersistedStoreApi, 'rehydrate' | 'getOptions'>;
};

/**
 * `persist`가 필수인 스토어 — `getStoresToRehydrate` 필터·타입 가드 결과
 * `PersistStore`의 `persist?`를 `Required`로 좁힌 것과 동일(persist가 필수)
 */
type PersistStoreRehydratable = Required<PersistStore>;

/**
 * `persist.rehydrate`가 truthy인 항목만 남긴다.
 *
 * @param stores - 원본 목록
 * @returns 타입은 `PersistStoreRehydratable`로 좁힘(persist가 필수). 런타임 가드는 `rehydrate`만 검사하므로,
 *   이후 `getRehydrationGateKey`에서 `getOptions()`를 호출한다 — **프로덕션에서는 zustand `persist()`가 붙은 스토어만** 넘길 것(테스트 mock도 동일하게).
 */
const getStoresToRehydrate = (stores: PersistStore[]): PersistStoreRehydratable[] =>
  stores.filter((s): s is PersistStoreRehydratable => Boolean(s?.persist?.rehydrate));

/**
 * `PersistRehydrationGate`의 `key`로 사용. `toRehydrate` 구성이 바뀌면 키가 달라져 Gate가 remount되고
 * `rehydrationDone`이 초기화된다.
 *
 * @param toRehydrate - `getStoresToRehydrate` 필터 결과
 * @returns `getOptions().name`을 `\0`으로 이어붙인 문자열 (이름 없으면 빈 조각)
 */
const getRehydrationGateKey = (toRehydrate: PersistStoreRehydratable[]): string =>
  toRehydrate.map((s) => s.persist.getOptions().name ?? '').join('\0');

/**
 * @description `PersistRehydrationGate` 컴포넌트 props
 * @property toRehydrate - `getStoresToRehydrate` 결과 — 비어 있지 않음
 * @property fallback - `rehydrationDone`이 `false`일 때 fallback 표시
 * @property children - 복원 완료 후 표시
 */
type PersistRehydrationGateProps = {
  toRehydrate: PersistStoreRehydratable[];
  fallback: ReactNode;
  children: ReactNode;
};

/**
 * rehydrate가 필요한 경우에만 부모가 마운트한다. 완료 여부는 persist **storage**(localStorage·sessionStorage·커스텀 등)의
 * 비동기 결과이므로 이 컴포넌트에서만 `useState`로 추적함 (불필요한 effect를 방지)
 * @see {@link https://ko.react.dev/learn/you-might-not-need-an-effect | React — You might not need an effect} (파생 가능한 값은 상위에서 처리)
 */
const PersistRehydrationGate = ({
  toRehydrate,
  fallback,
  children,
}: PersistRehydrationGateProps) => {
  // rehydration 완료 여부를 확인하기 위한 상태 관리
  const [rehydrationDone, setRehydrationDone] = useState(false);

  useEffect(() => {
    // rehydration 취소 여부 (cleanup 함수에서 사용, 초깃값은 취소되지 않음)
    let cancelled = false;

    // rehydration 시작(비동기 즉시 실행 함수 표현식(IIFE), void 키워드를 사용하여 의도적으로 반환(Promise)을 무시)
    void (async function rehydrateStores() {
      // rehydration 대상 스토어들을 순회하며 rehydrate 호출(Promise.allSettled를 사용하여 모든 rehydrate가 완료되었는지 확인)
      await Promise.allSettled(toRehydrate.map((s) => Promise.resolve(s.persist.rehydrate())));
      // rehydration 취소 여부를 확인하고 취소됨(!cancelled === false)이면 rehydration 완료 표시
      if (!cancelled) {
        setRehydrationDone(true);
      }
    })();

    // rehydration이 끝나면 cleanup 함수를 반환하여 rehydration 취소(cancelled를 true로 설정)
    return () => {
      cancelled = true;
    };
    // toRehydrate가 변경되면 rehydration 다시 시작
  }, [toRehydrate]);

  // 아직 rehydration이 완료되지 않았으면 fallback을 렌더링
  if (!rehydrationDone) return <>{fallback}</>;
  // 완료되었으면 children을 렌더링
  return <>{children}</>;
};

/**
 * {@link PersistRehydrationProvider} 컴포넌트 props
 */
export type PersistRehydrationProviderProps = {
  children: ReactNode;
  /**
   * persist 미들웨어를 쓰는 zustand 스토어 목록
   * `skipHydration`을 쓰는 경우 클라이언트에서 `rehydrate()`로 스토리지와 맞춘다.
   *
   * @see {@link https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#skiphydration | Zustand — skipHydration}
   */
  stores?: PersistStore[];
  /** rehydrate 완료 전에 보여줄 UI (없으면 `null`) */
  fallback?: ReactNode;
};

/**
 * zustand persist 스토어를 스토리지와 맞춘 후 자식을 렌더링함
 *
 * - rehydrate 대상이 **없으면** (`getStoresToRehydrate`가 빈 배열) effect 없이 곧바로 `children`을 렌더한다
 * - 대상이 **있으면** {@link PersistRehydrationGate}에서 각 `persist.rehydrate()`가 끝날 때까지 `fallback`을 보여준다
 *   내부는 `Promise.allSettled`이므로 **일부가 reject되어도** 나머지가 끝나면 `children`으로 진행한다
 *
 * @see {@link https://react.dev/reference/react/useMemo | React — useMemo} — `toRehydrate` 메모이제이션
 */
export function PersistRehydrationProvider({
  children,
  stores = [],
  fallback = null,
}: PersistRehydrationProviderProps) {
  const toRehydrate = useMemo(() => getStoresToRehydrate(stores), [stores]);

  if (toRehydrate.length === 0) {
    return <>{children}</>;
  }

  return (
    <PersistRehydrationGate
      key={getRehydrationGateKey(toRehydrate)}
      toRehydrate={toRehydrate}
      fallback={fallback}
    >
      {children}
    </PersistRehydrationGate>
  );
}
