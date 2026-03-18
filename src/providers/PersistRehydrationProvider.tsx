'use client';

import { useEffect, useState } from 'react';

/**
 * @description Persist store 타입
 * @property persist - persist 미들웨어 사용 store 목록
 * @property rehydrate - rehydrate 메서드
 * @property getOptions - persist 미들웨어 사용 store 옵션 조회
 */
export type PersistStore = {
  persist?: { rehydrate: () => void | Promise<void>; getOptions: () => { name?: string } };
};

/**
 * @description PersistRehydrationProvider 컴포넌트 타입
 * @param children - 자식 컴포넌트
 * @param stores - persist 미들웨어 사용 store 목록. skipHydration 사용 시 클라이언트에서 rehydrate됨
 * @param fallback - 데이터 로딩 중 렌더링할 대체(fallback) 컴포넌트, 없으면 null
 */
export type PersistRehydrationProviderProps = {
  children: React.ReactNode;
  /** persist 미들웨어 사용 store 목록. skipHydration 사용 시 클라이언트에서 rehydrate됨 */
  stores?: PersistStore[];
  /** 데이터 로딩 중 렌더링할 대체(fallback) 컴포넌트, 없으면 null */
  fallback?: React.ReactNode;
};

export function PersistRehydrationProvider({
  children,
  stores = [],
  fallback = null,
}: PersistRehydrationProviderProps) {
  const [hydrated, setHydrated] = useState(stores.length === 0);

  useEffect(() => {
    // stores가 비어있으면(클라이언트 저장소에 데이터 없음) 클라이언트에서 rehydrate 완료 상태로 변경
    if (stores.length === 0) {
      queueMicrotask(() => setHydrated(true));
      return;
    }
    // stores가 비어있지 않으면(클라이언트 저장소에 데이터 있음) 모든 store에서 rehydrate
    // PersistStore에 포함되어 있고, rehydrate 메서드가 있으며, rehydrate 메서드가 Promise를 반환하는 경우에만 rehydrate 실시
    Promise.allSettled(
      stores
        .filter((s): s is PersistStore & { persist: { rehydrate: () => void | Promise<void> } } =>
          Boolean(s?.persist?.rehydrate),
        )
        .map((s) => Promise.resolve(s.persist!.rehydrate())),
    ).finally(() => setHydrated(true));
  }, [stores]);

  if (!hydrated) return <>{fallback}</>;
  return <>{children}</>;
}
