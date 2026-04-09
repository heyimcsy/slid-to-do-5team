'use client';

import type { QueryPersistStorageType } from '@/constants/query';
import type { PersistStore } from '@/providers/PersistRehydrationProvider';
import type { DehydratedState } from '@tanstack/react-query';
import type { ComponentType } from 'react';

import { useEffect, useState } from 'react';
import { useOAuthUserFlashSync } from '@/hooks/auth/useOAuthUserFlashSync';
import { useTokenRefreshOnMount } from '@/hooks/auth/useTokenRefreshOnMount';
import { createQueryPersister } from '@/providers/createQueryPersister';
import { PersistRehydrationProvider } from '@/providers/PersistRehydrationProvider';
import { reconcileAuthSessionOAuthFromServer } from '@/stores/authUserStore';
import { HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { QUERY_MAX_AGE, QUERY_STALE_TIME } from '@/constants/query';
import { PERSIST_STORES } from '@/constants/store';

/**
 * @description 개발환경 전용 React Query Devtools. `next/dynamic` + `ssr: false`는 App Router에서
 * BailoutToCSR 오버레이를 유발하므로, 마운트 후 동적 import로만 로드한다.
 * @environment NODE_ENV=development
 */
function ReactQueryDevtoolsLazy() {
  const [Devtools, setDevtools] = useState<ComponentType<{ initialIsOpen?: boolean }> | null>(null);

  useEffect(() => {
    void import('@tanstack/react-query-devtools').then((m) => {
      setDevtools(() => m.ReactQueryDevtools);
    });
  }, []);

  if (!Devtools) return null;
  return <Devtools initialIsOpen={false} />;
}

/**
 * @description AppProviders 컴포넌트 타입
 * @param children - 자식 컴포넌트
 * @param dehydratedState - 서버 렌더링 시 데이터 dehydrated 된 상태
 * @param persistStores - persist 미들웨어 사용 Zustand store 목록. skipHydration 포함 시 서버에서 hydration 시도하지 않고 클라이언트에서 rehydrate됨
 * @param queryPersistStorage - localStorage: 탭 간 유지. sessionStorage: 탭 닫을 때 삭제.
 */
export type AppProvidersProps = {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
  persistStores?: PersistStore[];
  queryPersistStorage?: QueryPersistStorageType;
};

export function AppProviders({
  children,
  dehydratedState,
  persistStores = PERSIST_STORES,
  queryPersistStorage = 'localStorage',
}: AppProvidersProps) {
  /** OAuth redirect 콜백 직후 `authUserStore` 동기화 (그 다음 refresh 주기와 겹치지 않게 먼저) */
  useOAuthUserFlashSync();
  useTokenRefreshOnMount();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_STALE_TIME, // 60초
            gcTime: QUERY_MAX_AGE, // 24시간 (persist maxAge와 같은 값 사용)
          },
        },
      }),
  );

  /**
   * @description QueryClient persist용 Persister 생성.
   * @returns Persister (서버: no-op, 클라이언트: queryPersistStorage에 지정된 storage(localStorage or sessionStorage))
   */
  const persister = createQueryPersister(queryPersistStorage);

  /**
   * @description 자식 컴포넌트 렌더링
   * @option dehydratedState - 서버 렌더링 시 데이터 dehydrated 된 상태
   * @option persistStores - persist 미들웨어 사용 Zustand store 목록. skipHydration 포함 시 서버에서 hydration 시도하지 않고 클라이언트에서 rehydrate됨
   */
  const content = (
    <>
      <HydrationBoundary state={dehydratedState}>
        <PersistRehydrationProvider
          stores={persistStores}
          waitForQueryPersistRestore
          onZustandRehydrated={reconcileAuthSessionOAuthFromServer}
        >
          {children}
        </PersistRehydrationProvider>
      </HydrationBoundary>
    </>
  );

  /**
   * @description ReactQueryDevtools 컴포넌트 렌더링(개발환경에서만 호출)
   */
  const reactQueryDevtools =
    process.env.NODE_ENV === 'development' ? <ReactQueryDevtoolsLazy /> : null;

  /**
   * @description AppProviders 컴포넌트 반환
   * @option client - QueryClient 인스턴스
   * @option persister - QueryClient persist용 Persister 인스턴스
   * @option maxAge - QueryClient persist maxAge (gcTime과 같은 값 사용)
   * @option buster - package.json에서 프로젝트 버전 변경 시 QueryClient persist 캐시 무효화 트리거됨
   * @option content - 자식 컴포넌트
   * @option reactQueryDevtools - ReactQueryDevtools 컴포넌트
   */
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: QUERY_MAX_AGE,
        buster: process.env.NEXT_PUBLIC_APP_VERSION ?? '',
      }}
    >
      {content}
      {reactQueryDevtools}
    </PersistQueryClientProvider>
  );
}
