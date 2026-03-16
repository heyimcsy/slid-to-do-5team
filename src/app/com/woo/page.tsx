'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';



import { SearchInput } from '@/components/SearchInput';
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
    </main>
  );
}
