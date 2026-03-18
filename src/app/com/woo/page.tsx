'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQuery } from '@tanstack/react-query';

import { SearchInput } from '@/components/common/SearchInput';
import { Button, IconButton } from '@/components/ui/button';

export default function Woo() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  const styles = ['default', 'outline', 'ghost'];

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    // API 호출 시뮬레이션: fetchSearch(debouncedQuery)
    console.log('[검색 API 호출 쿼리]', debouncedQuery);
  }, [debouncedQuery]);

  /**
   * @description Query 테스트
   * @queryKey - 'test'
   * @queryFn - 임의의 테스트 데이터 페칭(이후 실제 API 호출로 변경하세요)
   * @returns data - 임의의 테스트 응답값
   * @isLoading - 로딩 상태 (true/false)
   */
  const { data, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      return res.json();
    },
  });

  return (
    <main className="flex h-dvh w-full max-w-3xl flex-col gap-6 bg-white p-10">
      <h1 className="font-xl-bold sm:font-2xl-bold">버튼(아이콘 버튼 포함) 그룹</h1>
      <div className="flex min-h-14 w-full cursor-text flex-wrap items-center gap-1.5 rounded-[16px] border border-gray-200 bg-white px-3 py-2 transition-colors focus-within:border-orange-500 focus-within:ring-[1px] focus-within:ring-orange-500/30">
        {styles.map((style) => (
          <Fragment key={style}>
            <Button ref={buttonRef} variant={style as 'default' | 'outline' | 'ghost'}>
              Button CTA
            </Button>
            <IconButton ref={iconButtonRef} variant={style as 'default' | 'outline' | 'ghost'}>
              <HugeiconsIcon icon={Add01Icon} />
              <span>추가하기</span>
            </IconButton>
          </Fragment>
        ))}
      </div>
      <h1 className="font-xl-bold sm:font-2xl-bold">SearchInput 그룹</h1>
      <div className="flex min-h-14 w-full flex-col gap-4">
        <div className="flex min-h-14 w-full cursor-text flex-wrap items-center gap-1.5 rounded-[16px] border border-gray-200 bg-white px-3 py-2 transition-colors focus-within:border-orange-500 focus-within:ring-[1px] focus-within:ring-orange-500/30">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="할 일을 검색해주세요"
          />
          <SearchInput placeholder="노트를 검색해주세요" />
        </div>
        <span className="font-sm-regular text-gray-600">
          첫 번째 SearchInput: Controlled + Debounce: 검색어 입력 후 300ms 지나면 콘솔에 API 호출
          로그
        </span>
      </div>
      <h1 className="font-xl-bold sm:font-2xl-bold">Query Persist 테스트 그룹</h1>
      <div className="flex min-h-14 w-full flex-col gap-4">
        {isLoading ? <div>로딩중...</div> : <pre>데이터: {JSON.stringify(data, null, 2)}</pre>}
        <h3>테스트 방법</h3>
        <p>1. 데이터 로드 후 새로고침, 캐시 유지 확인</p>
        <p>2. React Query Devtools에서 캐시된 데이터 확인</p>
      </div>
    </main>
  );
}
