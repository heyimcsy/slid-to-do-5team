'use client';

import { useEffect, useState } from 'react';

// 입력 값을 지연 처리하여 제어 컴포넌트에서 검색어 입력 시 API의 과도한 호출을 방지하기 위한 커스텀 훅
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export { useDebouncedValue };
