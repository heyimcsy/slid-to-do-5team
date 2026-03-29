'use client';

import { useEffect, useRef, useState } from 'react';

// 입력 값을 지연 처리하여 제어 컴포넌트에서 검색어 입력 시 API의 과도한 호출을 방지하기 위한 커스텀 훅
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  /**
   * @description 지연 처리를 위한 타이머 저장 참조
   */
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    /**
     * @description 바로 값을 반환하지 않고 delay 후 값을 반환
     * @param delay - 지연 시간
     * @param value - 입력 값
     * @returns debouncedValue - 지연 처리된 값
     */
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      timeoutRef.current = null;
    }, delay);

    return () => {
      // 클린업 함수에서 clearTimeout으로 정리 (memory leak 방지)
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
